const cluster = require('cluster');
const { length: numCPUs } = require('os').cpus();
const { fork } = require('child_process');
const Runner = require('./runner');
const Layout = require('./layout');

const workers = [];
if (!process.env.CHILD_WORKER) {
  while (workers.length < numCPUs) {
    workers.push(fork(__dirname + '/cluster.js', { env: { CHILD_WORKER: 'yup' } }));
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
    workers.forEach(worker => {
      worker.send({ cmd: 'reset', text, options });
      worker.on('message', msg => this.receivedMessage(msg));
    });

    this.waiters = {};
  }

  *runCollection(layouts) {
    const promises = layouts.map((layout, index) => {
      const worker = workers[index % workers.length];
      return this.scheduleRunWith(layout, worker);
    });

    return yield Promise.all(promises);
  }

  scheduleRunWith(layout, worker) {
    return new Promise(resolve => {
      const uuid = Date.now() / 10000 + Math.random();
      this.waiters[uuid] = { resolve, worker };
      worker.send(Object.assign({ cmd: 'run', uuid }, layout));
    });
  }

  receivedMessage(msg) {
    const { cmd, uuid, result, name, config } = msg;
    if (cmd === 'result') {
      const layout = new Layout(name, config);
      const { worker, resolve } = this.waiters[uuid];
      delete(this.waiters[uuid]);
      resolve && resolve({ result, layout });
    }
  }
};
