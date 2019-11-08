import * as d3 from 'd3';

export interface DataPoints {
  x: number;
  y: number;
}

export function drawLineGraph(
  data: DataPoints[],
  xAxisLabel: string,
  yAxisLabel: string,
  baseElementToAppendTo: string
): void {
  const margin = { top: 10, right: 30, bottom: 30, left: 60 };
  const width = 460 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  const svg = d3
    .select(`#${baseElementToAppendTo}`)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  const x = d3.scaleLinear().range([0, width]);
  x.domain([0, d3.max(data, d => d.x) || 0]);
  svg
    .append('g')
    .attr('transform', 'translate(0,' + height + ')')
    .call(
      d3.axisBottom(x).tickFormat(e => {
        const valueOfTick = typeof e === 'number' ? e : e.valueOf();
        if (Math.floor(valueOfTick) !== valueOfTick) {
          return '';
        }

        return valueOfTick.toString();
      })
    );
  svg
    .append('text')
    .attr('transform', 'translate(' + width / 2 + ' ,' + (height + margin.top + 20) + ')')
    .style('text-anchor', 'middle')
    .attr('font-weight', 'bold')
    .text(xAxisLabel);

  const y = d3.scaleLinear().range([height, 0]);
  y.domain([0, d3.max(data, d => d.y) || 0]);
  svg.append('g').call(d3.axisLeft(y));
  svg
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 0 - margin.left)
    .attr('x', 0 - height / 2)
    .attr('dy', '1em')
    .style('text-anchor', 'middle')
    .attr('font-weight', 'bold')
    .text(yAxisLabel);

  const lineGenerator = d3
    .line<{ x: number; y: number }>()
    .x(d => x(d.x))
    .y(d => y(d.y))
    .curve(d3.curveMonotoneX);

  svg
    .append('path')
    .attr('fill', 'none')
    .attr('stroke', 'steelblue')
    .attr('stroke-width', 1.5)
    .attr('d', lineGenerator(data) || '');
}
