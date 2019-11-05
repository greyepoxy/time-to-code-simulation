import { Duration } from 'luxon';
import { UnitOfCode, getUnitOfCode } from './unitOfCode';

const timeStep = Duration.fromObject({ hours: 1 });

export interface ItemInProgress {
  timeSpentSoFar: Duration;
  timeRequired: Duration;
  codeUnit: UnitOfCode;
}

export interface SimulationState {
  completedUnitsOfCode: ReadonlyArray<UnitOfCode>;
  currentItemInProgress: ItemInProgress;
}

export function runOneTimeStep(state: SimulationState): SimulationState {
  const updatedProgress = {
    ...state.currentItemInProgress,
    timeSpentSoFar: state.currentItemInProgress.timeSpentSoFar.plus(timeStep)
  };

  if (updatedProgress.timeSpentSoFar.equals(updatedProgress.timeRequired)) {
    return {
      completedUnitsOfCode: state.completedUnitsOfCode.concat(updatedProgress.codeUnit),
      currentItemInProgress: {
        timeSpentSoFar: Duration.fromObject({ hours: 0 }),
        timeRequired: Duration.fromObject({ hours: 8 }),
        codeUnit: getUnitOfCode()
      }
    };
  }

  return { ...state, currentItemInProgress: updatedProgress };
}

export function runForDuration(state: SimulationState, duration: Duration): SimulationState {
  while (duration.hours > 0) {
    state = runOneTimeStep(state);
    duration = duration.minus(timeStep);
  }

  return state;
}

export function getInitialState(): SimulationState {
  return {
    completedUnitsOfCode: [],
    currentItemInProgress: getNextItemToDo()
  };
}

function getNextItemToDo(): ItemInProgress {
  return {
    timeSpentSoFar: Duration.fromObject({ hours: 0 }),
    timeRequired: Duration.fromObject({ hours: 8 }),
    codeUnit: getUnitOfCode()
  };
}
