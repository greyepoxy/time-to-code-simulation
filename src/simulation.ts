import { Duration } from 'luxon';
import { UnitOfCode, getUnitOfCode } from './unitOfCode';

const timeStep = Duration.fromObject({ hours: 1 });
const statisticsCaptureTimeStep = Duration.fromObject({
  hours: 8
});
const throughputCalculationWindow = Duration.fromObject({
  hours: statisticsCaptureTimeStep.hours * 5
});

export interface ItemInProgress {
  timeSpentSoFar: Duration;
  timeRequired: Duration;
  codeUnit: UnitOfCode;
}

export interface Statistics {
  totalCompletedUnitsOfCode: number;
  totalDuration: Duration;
  completedUnitsOfCodeInLastWeek: number;
}

export interface CurrentState {
  completedUnitsOfCode: ReadonlyArray<UnitOfCode>;
  currentItemInProgress: ItemInProgress;
  totalRuntime: Duration;
}

export interface SimulationInfo {
  timeStep: Duration;
  statsTimeStep: Duration;
  throughputCalculationWindow: Duration;
}

export interface SimulationState {
  current: CurrentState;
  history: ReadonlyArray<Statistics>;
  runInfo: SimulationInfo;
}

export function runOneTimeStep(state: SimulationState): SimulationState {
  const updatedCurrentState = updateCurrentStateForSingleTimeStep(state.current);
  const previousStatistics = state.history[state.history.length - 1];

  const timeSinceLastHistoryStatistic = updatedCurrentState.totalRuntime.minus(
    previousStatistics.totalDuration
  );
  if (timeSinceLastHistoryStatistic.hours >= statisticsCaptureTimeStep.hours) {
    // calculate statistics and add a history entry
    const currentCodeCompletionCount = updatedCurrentState.completedUnitsOfCode.length;
    const codeCompletionCountFromStatOfThroughputTimeWindow = findTotalCompletedUnitsOfCodeAtPointInTime(
      state.history,
      updatedCurrentState.totalRuntime.minus(throughputCalculationWindow)
    );

    return {
      ...state,
      current: updatedCurrentState,
      history: state.history.concat({
        totalDuration: updatedCurrentState.totalRuntime,
        totalCompletedUnitsOfCode: currentCodeCompletionCount,
        completedUnitsOfCodeInLastWeek:
          currentCodeCompletionCount - codeCompletionCountFromStatOfThroughputTimeWindow
      })
    };
  }

  return {
    ...state,
    current: updatedCurrentState
  };
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
    current: {
      completedUnitsOfCode: [],
      currentItemInProgress: getNextItemToDo(),
      totalRuntime: Duration.fromObject({ hours: 0 })
    },
    history: [
      {
        totalDuration: Duration.fromObject({ hours: 0 }),
        totalCompletedUnitsOfCode: 0,
        completedUnitsOfCodeInLastWeek: 0
      }
    ],
    runInfo: {
      timeStep,
      statsTimeStep: statisticsCaptureTimeStep,
      throughputCalculationWindow
    }
  };
}

function updateCurrentStateForSingleTimeStep(state: CurrentState): CurrentState {
  const updatedProgress = {
    ...state.currentItemInProgress,
    timeSpentSoFar: state.currentItemInProgress.timeSpentSoFar.plus(timeStep)
  };

  const updatedRuntime = state.totalRuntime.plus(Duration.fromObject({ hours: 1 }));

  if (updatedProgress.timeSpentSoFar.equals(updatedProgress.timeRequired)) {
    return {
      completedUnitsOfCode: state.completedUnitsOfCode.concat(updatedProgress.codeUnit),
      currentItemInProgress: {
        timeSpentSoFar: Duration.fromObject({ hours: 0 }),
        timeRequired: Duration.fromObject({ hours: 8 }),
        codeUnit: getUnitOfCode()
      },
      totalRuntime: updatedRuntime
    };
  }

  return {
    ...state,
    totalRuntime: updatedRuntime,
    currentItemInProgress: updatedProgress
  };
}

function getNextItemToDo(): ItemInProgress {
  return {
    timeSpentSoFar: Duration.fromObject({ hours: 0 }),
    timeRequired: Duration.fromObject({ hours: 8 }),
    codeUnit: getUnitOfCode()
  };
}

function findTotalCompletedUnitsOfCodeAtPointInTime(
  history: ReadonlyArray<Statistics>,
  atTotalRuntime: Duration
): number {
  const matchingHistory = history.find(previousStatistics =>
    previousStatistics.totalDuration.equals(atTotalRuntime)
  );
  return matchingHistory !== undefined ? matchingHistory.totalCompletedUnitsOfCode : 0;
}
