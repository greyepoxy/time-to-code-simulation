import { Duration } from 'luxon';

export interface CodeChange {
  id: number;
  timeRequiredToComplete: Duration;
}

let id = 0;

export function getCodeChange(timeRequiredToComplete: Duration): CodeChange {
  return {
    id: id++,
    timeRequiredToComplete
  };
}
