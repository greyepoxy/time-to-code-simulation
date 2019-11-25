import { Duration } from 'luxon';
import { CodeChange, getCodeChange } from './codeChange';
import { ProbabilityDistribution } from './probabilityDistribution';

const timeStep = Duration.fromObject({ hours: 1 });
const statisticsCaptureTimeStep = Duration.fromObject({
  hours: 8
});
const throughputCalculationWindow = Duration.fromObject({
  hours: statisticsCaptureTimeStep.hours * 5
});

export interface ItemInProgress {
  timeSpentSoFar: Duration;
  codeChange: CodeChange;
}

export interface Statistics {
  totalCompletedCodeChanges: number;
  totalDuration: Duration;
  completedCodeChangesInLastWeek: number;
}

export interface CurrentState {
  completedCodeChanges: ReadonlyArray<CodeChange>;
  currentItemInProgress: ItemInProgress;
  totalRuntime: Duration;
}

export interface TimeToCompleteCalculationSettings {
  baseTimeToComplete: number;
  probabilityDistribution: ProbabilityDistribution;
}

export interface SimulationInfo {
  timeStep: Duration;
  statsTimeStep: Duration;
  throughputCalculationWindow: Duration;
  timeToCompleteCalculationSettings: TimeToCompleteCalculationSettings;
}

export interface SimulationState {
  current: CurrentState;
  history: ReadonlyArray<Statistics>;
  runInfo: SimulationInfo;
}

export function runOneTimeStep(state: SimulationState): SimulationState {
  const updatedCurrentState = updateCurrentStateForSingleTimeStep(
    state.current,
    state.runInfo.timeToCompleteCalculationSettings
  );
  const previousStatistics = state.history[state.history.length - 1];

  const timeSinceLastHistoryStatistic = updatedCurrentState.totalRuntime.minus(
    previousStatistics.totalDuration
  );
  if (timeSinceLastHistoryStatistic.hours >= statisticsCaptureTimeStep.hours) {
    // calculate statistics and add a history entry
    const currentCodeCompletionCount = updatedCurrentState.completedCodeChanges.length;
    const codeCompletionCountFromStatOfThroughputTimeWindow = findTotalCompletedCodeChangesAtPointInTime(
      state.history,
      updatedCurrentState.totalRuntime.minus(throughputCalculationWindow)
    );

    return {
      ...state,
      current: updatedCurrentState,
      history: state.history.concat({
        totalDuration: updatedCurrentState.totalRuntime,
        totalCompletedCodeChanges: currentCodeCompletionCount,
        completedCodeChangesInLastWeek:
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

export function getInitialState(simulationInfo?: Partial<SimulationInfo>): SimulationState {
  const simulationInfoWithDefaults: SimulationInfo = {
    timeStep,
    statsTimeStep: statisticsCaptureTimeStep,
    throughputCalculationWindow,
    timeToCompleteCalculationSettings: {
      baseTimeToComplete: 8,
      probabilityDistribution: ProbabilityDistribution.getNormal(1.0, 0.25)
    },
    ...simulationInfo
  };

  return {
    current: {
      completedCodeChanges: [],
      currentItemInProgress: getNextItemToDo(
        simulationInfoWithDefaults.timeToCompleteCalculationSettings
      ),
      totalRuntime: Duration.fromObject({ hours: 0 })
    },
    history: [
      {
        totalDuration: Duration.fromObject({ hours: 0 }),
        totalCompletedCodeChanges: 0,
        completedCodeChangesInLastWeek: 0
      }
    ],
    runInfo: simulationInfoWithDefaults
  };
}

function updateCurrentStateForSingleTimeStep(
  state: CurrentState,
  timeToCompleteCalculationSettings: TimeToCompleteCalculationSettings
): CurrentState {
  const updatedProgress = {
    ...state.currentItemInProgress,
    timeSpentSoFar: state.currentItemInProgress.timeSpentSoFar.plus(timeStep)
  };

  const updatedRuntime = state.totalRuntime.plus(Duration.fromObject({ hours: 1 }));

  if (updatedProgress.timeSpentSoFar.equals(updatedProgress.codeChange.timeRequiredToComplete)) {
    return {
      completedCodeChanges: state.completedCodeChanges.concat(updatedProgress.codeChange),
      currentItemInProgress: getNextItemToDo(timeToCompleteCalculationSettings),
      totalRuntime: updatedRuntime
    };
  }

  return {
    ...state,
    totalRuntime: updatedRuntime,
    currentItemInProgress: updatedProgress
  };
}

function getNextItemToDo(settings: TimeToCompleteCalculationSettings): ItemInProgress {
  const hoursToComplete = Math.round(
    settings.baseTimeToComplete * settings.probabilityDistribution.getNext()
  );
  return {
    timeSpentSoFar: Duration.fromObject({ hours: 0 }),
    codeChange: getCodeChange(Duration.fromObject({ hours: hoursToComplete }))
  };
}

function findTotalCompletedCodeChangesAtPointInTime(
  history: ReadonlyArray<Statistics>,
  atTotalRuntime: Duration
): number {
  const matchingHistory = history.find(previousStatistics =>
    previousStatistics.totalDuration.equals(atTotalRuntime)
  );
  return matchingHistory !== undefined ? matchingHistory.totalCompletedCodeChanges : 0;
}
