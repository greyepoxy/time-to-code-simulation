import * as d3 from 'd3';
import { runForDuration, getInitialState } from './simulation';
import { Duration } from 'luxon';

const dataCollectionTimeStep = Duration.fromObject({ hours: 20 });

let simulationState = getInitialState();
const simulationResults = [];
for (let i = 0; i < 8; i++) {
  simulationResults.push({
    totalFinishedItems: simulationState.completedUnitsOfCode.length,
    totalDuration: dataCollectionTimeStep.hours * i
  });
  simulationState = runForDuration(simulationState, dataCollectionTimeStep);
}

// set the dimensions and margins of the graph
const margin = { top: 20, right: 20, bottom: 80, left: 50 };
const width = 970 - margin.left - margin.right;
const height = 550 - margin.top - margin.bottom;

// set the ranges
const x = d3.scaleLinear().range([0, width]);
const y = d3.scaleLinear().range([height, 0]);

// append the svg object to the body of the page
// append a 'group' element to 'svg'
// moves the 'group' element to the top left margin
const svg = d3
  .select('body')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

// Scale the range of the data in the domains
x.domain([
  0,
  (d3.max(simulationResults, d => d.totalDuration) || 0) + dataCollectionTimeStep.hours
]);
y.domain([0, d3.max(simulationResults, d => d.totalFinishedItems) || 0]);

const xBarWidth = x(simulationResults[1].totalDuration) - x(simulationResults[0].totalDuration) - 4;

// append the rectangles for the bar chart
svg
  .selectAll('.bar')
  .data(simulationResults)
  .enter()
  .append('rect')
  .attr('class', 'bar')
  .attr('y', d => {
    return y(d.totalFinishedItems);
  })
  .attr('height', d => {
    return height - y(d.totalFinishedItems);
  })
  .attr('x', d => {
    return x(d.totalDuration) + 2;
  })
  .attr('width', xBarWidth)
  .attr('fill', 'steelblue');

// add the x Axis
svg
  .append('g')
  .attr('transform', 'translate(0,' + height + ')')
  .call(d3.axisBottom(x));

// text label for the x axis
svg
  .append('text')
  .attr('transform', 'translate(' + width / 2 + ' ,' + (height + margin.top + 20) + ')')
  .style('text-anchor', 'middle')
  .attr('font-weight', 'bold')
  .text('Duration (hours)');

// add the y Axis
svg.append('g').call(d3.axisLeft(y));

// text label for the y axis
svg
  .append('text')
  .attr('transform', 'rotate(-90)')
  .attr('y', 0 - margin.left)
  .attr('x', 0 - height / 2)
  .attr('dy', '1em')
  .style('text-anchor', 'middle')
  .attr('font-weight', 'bold')
  .text('Total Items Completed');
