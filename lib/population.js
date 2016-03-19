import Genome from "./genome";
import { QWERTY } from "./layout";

const POPULATION_SIZE = 12;

export default class Population {
  static random() {
    const base_genome  = Genome.fromLayout(QWERTY);
    const random_genes = [];

    for (let i=0; i < POPULATION_SIZE; i++) {
      random_genes.push(base_genome.mutate(20));
    }

    return new Population(random_genes);
  }

  constructor(genomes) {
    this.genomes = genomes;
    this.scores  = genomes.map(() => {total: 0});
  }

  grade(fitness) {
    for (let i=0; i < this.genomes.length; i++) {
      this.scores[i] = fitness(this.genomes[i]);
    }
  }

  // using the tournament selection
  pickTwo() {
    const random_func = () => Math.random() > 0.5 ? 1 : Math.random() > 0.5 ? 0 : -1;
    const random_list = [].concat(this.genomes).sort(random_func);
    const random_half = random_list.slice(0, random_list.length / 2 | 0);
    const weighted    = this.sortByScores(random_half);

    return weighted.slice(0, 2);
  }

  next(options) {
    const elite   = (options || {}).elite;
    const mutate  = (options || {}).mutate;
    const genomes = this.pickTwo();
    const first   = genomes[0];
    const second  = genomes[1];

    // first stage with minimal mutations to have the good parts locked in
    while (genomes.length < this.genomes.length * 2/3) {
      genomes.push(first.mutate(1));
      genomes.push(second.mutate(1));
    }

    // a more aggressive second stage to bring more variations into the system
    while (genomes.length < this.genomes.length) {
      genomes.push(first.mutate(mutate));
      genomes.push(second.mutate(mutate));
    }

    elite && genomes.unshift(this.best());

    return new Population(genomes.slice(0, this.genomes.length));
  }

  best() {
    return this.sortByScores(this.genomes)[0];
  }

  sortByScores(list) {
    return [].concat(list).sort((a, b) => {
      const grade_a = this.scoreFor(a).total;
      const grade_b = this.scoreFor(b).total;

      return grade_a > grade_b ? -1 : grade_a === grade_b ? 0 : 1;
    });
  }

  scoreFor(genome) {
    return this.scores[this.genomes.indexOf(genome)];
  }
}
