import * as d3 from 'd3';

// Update…
const p = d3
  .select('body')
  .selectAll('p')
  .data([4, 8, 15, 16, 23, 42])
  .text(d => {
    return d;
  });

// Enter…
p.enter()
  .append('p')
  .text(d => {
    return d;
  });

// Exit…
p.exit().remove();
