import { ProbabilityDistribution } from './probabilityDistribution';

export interface ModifierToken {
  probabilityOfApplying: number;
  modifierDistribution: ProbabilityDistribution;
}

export function getModifierToken(
  withProbabilityOfApplying: number,
  withModifier: ProbabilityDistribution
): ModifierToken {
  return {
    modifierDistribution: withModifier,
    probabilityOfApplying: withProbabilityOfApplying
  };
}

export function calculateModification(modifierTokens: ReadonlyArray<ModifierToken>): number {
  const uniformDistribution = ProbabilityDistribution.getUniform(0.0, 1.0);
  return modifierTokens
    .map(token => {
      if (uniformDistribution.getNext() >= token.probabilityOfApplying) return 1.0;

      return token.modifierDistribution.getNext();
    })
    .reduce((previous, current) => previous * current, 1.0);
}
