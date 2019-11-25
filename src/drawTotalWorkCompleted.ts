import { Statistics } from './simulation';
import { drawLineGraph } from './drawLineGraph';

export function drawTotalWorkCompleted(
  simulationStatistics: Statistics[],
  baseElementToAppendTo: string
): void {
  const data = simulationStatistics.map(stat => ({
    x: stat.totalDuration.hours / 40,
    y: stat.totalCompletedCodeChanges
  }));
  const xAxisLabel = 'Duration (weeks)';
  const yAxisLabel = 'Total Items Completed';

  drawLineGraph(data, xAxisLabel, yAxisLabel, baseElementToAppendTo);
}
