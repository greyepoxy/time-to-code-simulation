import * as random from 'random';

export class ProbabilityDistribution {
  static getNormal(mean?: number, standardDeviation?: number): ProbabilityDistribution {
    const distribution = random.normal(mean, standardDeviation);
    const randomGenerator = () => {
      return distribution();
    };
    return new ProbabilityDistribution(randomGenerator);
  }

  static getUniform(lowerBound: number, upperBound: number): ProbabilityDistribution {
    const distribution = random.uniform(lowerBound, upperBound);
    const randomGenerator = () => {
      return distribution();
    };
    return new ProbabilityDistribution(randomGenerator);
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
