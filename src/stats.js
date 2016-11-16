/**
 * Smarts around digesting the runner results and comparing them to each other
 */

const strengths = [0.75, 0.9, 1.0, 0.95, 0.95, 1.0, 0.9, 0.75];
const fingers = 'l-pinky l-ring l-middle l-point r-point r-middle r-ring r-pinky'.split(' ');
const sum = list => list.reduce((sum, i) => sum + i, 0);
const values = object => Object.keys(object).map(key => object[key]);
const percentify = value => Math.round(value * 100);
const percentages = list => {
  const total = sum(list);
  return list.map(value => percentify(value / total));
};
const diff = (one, two) => Math.min(one, two) / Math.max(one, two) || 1;
const avg = list => sum(list) / list.length || 1;

module.exports = class Stats {
  constructor(data) {
    this.data = data;
  }

  get overheads() {
    return sum(values(this.data.overheads));
  }

  get effort() {
    return this.data.effort;
  }

  get distance() {
    return this.data.distance;
  }

  get position() {
    return this.data.position;
  }

  get fingersUsage() {
    const counts = fingers.map(name => this.data.counts[name]);
    return percentages(counts.map(counts => sum(counts)));
  }

  get handsUsage() {
    return percentages(fingers.reduce(([left, right], name) => {
      const count = sum(this.data.counts[name]);
      if (name[0] === 'l') left += count;
      if (name[0] === 'r') right += count;
      return [left, right];
    }, [0, 0]));
  }

  get rowsUsage() {
    return percentages(fingers.reduce((rows, name) => {
      for (let row=0, counts = this.data.counts[name]; row < counts.length; row++) {
        rows[row] += counts[row];
      }
      return rows;
    }, [0, 0, 0, 0]));
  }

  get symmetry() {
    // row by row diffs for each finger
    const diffs = [0,1,2,3].map(index =>
      this.data.counts[fingers[index]].map((count, i) =>
        diff(count, this.data.counts[fingers[7-index]][i])
      ).slice(1)
    );

    // overall average in percents
    return percentify(avg(diffs.map(list => avg(list))));
  }

  get evenness() {
    const percentsPerFinger = this.fingersUsage;
    const correctedByStrength = percentsPerFinger.map((p, i) => p / strengths[i]);
    const diffs = correctedByStrength.map(percent => diff(percent, 12.5));

    return percentify(avg(diffs));
  }

  get score() {
    const { position, symmetry, evenness } = this;
    const bonuses = [symmetry, evenness].map(percent =>
      // normalized to the 1/5th of the reached text position
      Math.round(position / 5 / 100 * percent)
    );

    return position + sum(bonuses);
  }

  get total() {
    const overhead_reduction_bonus = this.position/(this.overheads / this.effort)
    return this.position + overhead_reduction_bonus / 10;
  }
};
