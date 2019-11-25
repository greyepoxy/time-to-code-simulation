import { Statistics } from './simulation';
import { drawLineGraph } from './drawLineGraph';

export function drawThroughput(
  simulationStatistics: Statistics[],
  baseElementToAppendTo: string
): void {
  const data = simulationStatistics.map(stat => ({
    x: stat.totalDuration.hours / 40,
    y: stat.completedCodeChangesInLastWeek
  }));
  const xAxisLabel = 'Duration (weeks)';
  const yAxisLabel = 'Items Completed in last week';

  drawLineGraph(data, xAxisLabel, yAxisLabel, baseElementToAppendTo);
}
