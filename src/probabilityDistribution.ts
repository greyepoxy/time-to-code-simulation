import * as random from 'random';

export class ProbabilityDistribution {
  static getLogNormal(mean?: number, standardDeviation?: number): ProbabilityDistribution {
    const distribution = random.logNormal(mean, standardDeviation);
    return new ProbabilityDistribution(distribution);
  }

  static getNormal(mean?: number, standardDeviation?: number): ProbabilityDistribution {
    const distribution = random.normal(mean, standardDeviation);
    return new ProbabilityDistribution(distribution);
  }

  static getUniform(lowerBound: number, upperBound: number): ProbabilityDistribution {
    const distribution = random.uniform(lowerBound, upperBound);
    return new ProbabilityDistribution(distribution);
  }

  static getFixed(value: number): ProbabilityDistribution {
    return new ProbabilityDistribution(() => value);
  }

  private randomNumberGenerator: () => number;

  constructor(randomNumberGenerator: () => number) {
    this.randomNumberGenerator = randomNumberGenerator;
  }

  getNext(): number {
    return this.randomNumberGenerator();
  }
}
