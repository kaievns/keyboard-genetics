const co                  = require("co");
const ui                  = require("./ui");
const { text, trigrams, code }  = require("./data");
const Stats               = require("./stats");
const Cluster             = require("./cluster");
const Population          = require("./population");
const { QWERTY, Workman } = require("./presets");

const data         = text;
const cluster      = new Cluster(data);
const use_elites   = true;
const mutate_level = 3;
const seed_layouts = [QWERTY, Workman];
const max_no_chage = 50;

co(boot).catch(e => console.log(e.stack));

function *boot() {
  for (const promise of cluster.schedule(seed_layouts)) {
    const { layout, result } = yield promise;
    ui.addResult(layout, new Stats(result));
  }

  yield start(Population.random(), 1000);
}

function *start(population, count) {
  let last_layout, last_score, no_changes_in;

  for (let i=0; i < count; i++) {
    const [layout, score] = yield handle(population);

    if (!last_layout || last_layout.toString() !== layout.toString()) {
      no_changes_in = 0;
    } else {
      no_changes_in ++;
    }

    ui.addResult(layout, score, no_changes_in, max_no_chage);
    last_layout = layout; last_score  = score;

    if (no_changes_in == max_no_chage) {
      break;
    }

    population = population.next({elite: use_elites, mutate: mutate_level});
  }

  ui.destroy();

  console.log(`Total: ${last_score.total}, Dist: ${last_score.position}\n`);
  console.log(last_layout.toString(), "\n");
  console.log(last_layout.config);
}

function *handle(population) {
  ui.newPopulation(population, use_elites, mutate_level);

  const layouts = population.genomes.map(g => g.toLayout());

  for (const promise of cluster.schedule(layouts)) {
    const { layout, result } = yield promise;
    const score = new Stats(result);
    ui.logGrade(layout, score);
    layouts.forEach((l, i) => {
      if (l.config === layout.config) {
        population.scores[i] = score;
      }
    });
  }

  const best_gene = population.best();
  const best_layout = best_gene.toLayout();
  const score = population.scoreFor(best_gene);

  return [best_layout, score];
}
