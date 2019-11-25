declare module 'random' {
  export type RandomGeneratorThunk = () => number;

  /**
   * @param min defaults to zero
   * @param max defaults to 1
   * @returns () => [ min, max )
   */
  export function uniform(min?: number, max?: number): RandomGeneratorThunk;

  /**
   * @param mu defaults to 0
   * @param sigma defaults to 1
   * @returns number generated using a normal distribution
   */
  export function normal(mu?: number, sigma?: number): RandomGeneratorThunk;

  /**
   * @param mu defaults to 0
   * @param sigma defaults to 1
   * @returns number generated using a log normal distribution
   */
  export function logNormal(mu?: number, sigma?: number): RandomGeneratorThunk;
}