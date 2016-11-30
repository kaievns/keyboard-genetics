const Genome     = require("./genome");
const { QWERTY } = require("./presets");

const POPULATION_SIZE = 12;

module.exports = class Population {
  static random() {
    Genome.resetGenofond();

    const random_genes = [];

    for (let i=0; i < POPULATION_SIZE; i++) {
      random_genes.push(Genome.random());
    }

    return new Population(random_genes);
  }

  constructor(genomes, number) {
    this.number  = number || 1;
    this.genomes = genomes;
    this.scores  = genomes.map(() => {total: 0});
  }

  grade(fitness) {
    for (let i=0; i < this.genomes.length; i++) {
      this.scores[i] = fitness(this.genomes[i]);
    }
  }

  // using the tournament selection
  tournamentWinner() {
    const tournamentSize  = 3; //Math.max(2, this.genomes.length / 4 | 0);
    const tournamentBatch = [];

    while (tournamentBatch.length < tournamentSize) {
      tournamentBatch.push(this.genomes[Math.random() * this.genomes.length | 0]);
    }

    return this.sortByScores(tournamentBatch)[0];
  }

  next(options) {
    const { elite, mutate: mutationLevel } = options || {};
    const newPopulation = elite ? [this.best()] : [];

    // first stage with minimal mutations to have the good parts locked in
    while (newPopulation.length < this.genomes.length * 3/4) {
      newPopulation.push(this.tournamentWinner().mutate(1));
    }

    // a more aggressive second stage to bring more variations into the system
    while (newPopulation.length < this.genomes.length) {
      newPopulation.push(this.tournamentWinner().mutate(mutationLevel));
    }

    // while (newPopulation.length < this.genomes.length) {
    //   newPopulation.push(this.tournamentWinner().mutate(mutationLevel * 2));
    // }

    return new Population(newPopulation.slice(0, this.genomes.length), this.number + 1);
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
