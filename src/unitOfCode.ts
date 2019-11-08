export interface UnitOfCode {
  id: number;
}

let id = 0;

export function getUnitOfCode(): UnitOfCode {
  return {
    id: id++
  };
}
