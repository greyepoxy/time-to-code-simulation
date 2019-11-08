import * as d3 from 'd3';
import { runForDuration, getInitialState } from './simulation';
import { Duration } from 'luxon';
import { drawThroughput } from './drawThroughput';
import { drawTotalWorkCompleted } from './drawTotalWorkCompleted';

const simulationRuntime = Duration.fromObject({ hours: 200 });

const simulationResults = runForDuration(getInitialState(), simulationRuntime);
const simulationStatistics = simulationResults.history.slice();

const throughputDivId = 'throughput';
d3.select('body')
  .append('div')
  .attr('id', throughputDivId);
drawThroughput(simulationStatistics, throughputDivId);

const totalItemsId = 'totalWorkCompleted';
d3.select('body')
  .append('div')
  .attr('id', totalItemsId);
drawTotalWorkCompleted(simulationStatistics, totalItemsId);
