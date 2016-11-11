const cluster = require('cluster');
const { length: numCPUs } = require('os').cpus();
const { fork } = require('child_process');
const Runner = require('./runner');
const Layout = require('./layout');

// the async processing queue
const queue = {
  workers: [],
  awaiting: {}, // promises
  available: [], // idle workers

  addWorker(worker) {
    this.workers.push(worker);
    this.available.push(worker);
    worker.on('message', msg => msg.cmd === 'result' && this.resultRecieved(msg));
  },

  push(layout) {
    const uuid = Date.now() / 10000 + Math.random();

    return new Promise(resolve => {
      this.awaiting[uuid] = {
        callback: resolve,
        payload: Object.assign({ cmd: 'run', uuid }, layout)
      };
      this.scheduleNext();
    });
  },

  scheduleNext() {
    const [uuid] = Object.keys(this.awaiting).filter(uuid => !this.awaiting[uuid].worker);

    if (uuid && this.available.length) {
      const worker = this.available.shift();
      this.awaiting[uuid].worker = worker;
      worker.send(this.awaiting[uuid].payload);
    }
  },

  resultRecieved({ uuid, name, config, result }) {
    const { worker, callback } = this.awaiting[uuid];
    const layout = new Layout(name, config);

    this.available.push(worker);
    this.scheduleNext();

    callback({ layout, result });
  }
};

if (!process.env.CHILD_WORKER) {
  while (queue.workers.length < numCPUs) {
    queue.addWorker(
      fork(__dirname + '/cluster.js', { env: { CHILD_WORKER: 'yup' } })
    );
  }
} else {
  let runner;
  process.on('message', msg => {
    if (msg.cmd === 'reset') {
      runner = new Runner(msg.text, msg.options);
    } else if (msg.cmd === 'run') {
      const result = runner.typeWith(new Layout(msg.name, msg.config));
      process.send(Object.assign({}, msg, { cmd: 'result', result }));
    }
  });
}

module.exports = class Cluster {
  constructor(text, options={}) {
    queue.workers.forEach(worker => {
      worker.send({ cmd: 'reset', text, options });
    });
  }

  schedule(layouts) {
    return layouts.map(layout => queue.push(layout));
  }
};
