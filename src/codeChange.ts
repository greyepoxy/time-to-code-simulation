export interface CodeChange {
  id: number;
}

let id = 0;

export function getCodeChange(): CodeChange {
  return {
    id: id++
  };
}
