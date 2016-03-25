"use strict";
const chalk   = require("chalk");
const blessed = require("blessed");
const contrib = require("blessed-contrib");

const results = [];
const screen  = blessed.screen();
const grid    = new contrib.grid({rows: 12, cols: 12, screen: screen});

const layouts = grid.set(0, 0, 8, 6, contrib.table, {
  label:         "Top layouts",
  content:       "Waiting...",
  keys:          true,
  interactive:   true,
  fg:            'gray',
  selectedBg:    'cyan',
  columnSpacing: 0,
  columnWidth:   [20, 12, 12, 12]
});

const details = grid.set(0, 6, 7, 6, blessed.box, {
  label:   "Keyboard details",
  content: "Waiting...",
  padding: 1
});

const roll = grid.set(7, 6, 5, 6, blessed.log, {
  label:   "Analyzing variations",
  content: "Waiting...",
  padding: 1
});

const genesis = grid.set(8, 0, 4, 6, blessed.box, {
  label:   "Genetics info",
  content: "Loading...",
  padding: 1
});

const chart = contrib.line({
  height:           12,
  top:              1,
  xPadding:         1,
  xLabelPadding:    1,
  wholeNumbersOnly: true,
  showLegend:       false
});
genesis.append(chart);

const breaks_bar = contrib.gauge({
  showLabel: false,
  height:  3,
  top:     5,
  left:    20,
  width:   30
});
genesis.append(breaks_bar);

const breaks_label = blessed.text({
  content: "No changes in 0/0",
  top:      7
});
genesis.append(breaks_label);

layouts.on("item", (row) => {
  details.setContent(String(row));
});

screen.render();

screen.key(['escape', 'q', 'C-c'], () => {
  process.exit(0);
});

exports.newPopulation = function newPopulation(population, use_elites, mutate_level) {
  genesis.setContent(
    `Generation: ${chalk.yellow(population.number)}, `+
    `Elites: ${use_elites ? chalk.green('YES') : chalk.red('NO')}, `+
    `Mutation Level: ${mutate_level}`
  );

  roll.setContent("");

  screen.render();
}

exports.logGrade = function logGrade(layout, score) {
  roll.log(chalk.grey(`Finished: ${layout.name} ..... ${humanize(score.total)}`));
}

exports.addResult = function addResult(layout, score, no_changes_in, max_no_chage) {
  details.setContent(
    `Name: ${chalk.red(layout.name)}, scored: ${chalk.yellow(humanize(score.total))}\n\n` +
    `${chalk.blue(layout.toString())}\n\n` +
    `Fingers: \n${chalk.gray(`${score.fingers.join(" ")}`)}\n\n`+
    `Hands: ${chalk.gray(score.hands.join(" | "))}`
  );

  results.push({layout: layout, score: score});
  rebuildLayoutsTable();
  redrawResultsChart();

  breaks_bar.setPercent(Math.round(no_changes_in / max_no_chage * 100));
  breaks_label.setContent(`No changes in ${no_changes_in || 0}/${max_no_chage || 0}`);

  screen.render();
}

exports.destroy = function destroy() {
  screen.destroy();
}

function humanize(score) {
  let res = (score / 100000).toFixed(1) + "M";
  while (res.length < 5) { res = " " + res; }
  return res;
}

function vs_known(total, vs) {
  const percent = total / vs * 100;
  const diff    = (percent - 100).toFixed(3);

  if (diff < 0) {
    return chalk.red(`${diff}%`);
  } else if (diff == 0) {
    return chalk.grey(` ${diff}%`);
  } else {
    return chalk.green(`+${diff}%`);
  }
}

function rebuildLayoutsTable() {
  const uniq = results.reduce((list, item) => {
    const match = list.filter(i => {
      return i.layout.config === item.layout.config
    }).length !== 0;

    return match ? list : list.concat([item]);
  }, []);

  const sorted = uniq.sort((a, b) => {
    return a.score.total > b.score.total ? -1 : 1;
  });

  const qwerty  = sorted.filter(r => r.layout.name === "QWERTY")[0];
  const workman = sorted.filter(r => r.layout.name === "Workman")[0];

  const data = sorted.map(result => {
    return [
      result.layout.name,
      humanize(result.score.total),
      vs_known(result.score.total, workman ? workman.score.total : result.score.total),
      vs_known(result.score.total, qwerty  ? qwerty.score.total  : result.score.total)
    ];
  })

  layouts.setData({
    headers: [' Name', ' Score', 'vs.Workman', 'vs.QWERTY'].map(i => chalk.magenta(i)),
    data:    data
  });

  layouts.focus();
}

function redrawResultsChart() {
  const scores = results.map(r => r.score.total - results[0].score.total).slice(2);
  const data   = scores.map(score => (score / 10000).toFixed(1));

  chart.setData([{ x: Object.keys(data).map(() => ' '), y: data }]);
  // ⠘⠒⠒⠒⠒⠒⠒⠒⠒⠒⠒⠒⠒⠒⠒⠒⠒⠒⠒⠒⠒⠒⠒⠒⠒⠒⠒⠒⠒⠒⠒⠒⠒⠒⠒⠒⠒⠒⠒⠒⠒⠒⠒⠒⠒⠒⠒⠒⠒⠒⠒⠒
}
