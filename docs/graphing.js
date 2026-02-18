// Interactive Graphing Component
import * as d3 from 'd3';

export function createGraph(containerId, data) {
    const width = 500;
    const height = 300;

    const svg = d3.select(`#${containerId}`)
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    const xScale = d3.scaleLinear().domain([0, 10]).range([0, width]);
    const yScale = d3.scaleLinear().domain([0, 10]).range([height, 0]);

    const line = d3.line()
        .x(d => xScale(d.x))
        .y(d => yScale(d.y));

    svg.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', 'blue')
        .attr('stroke-width', 2)
        .attr('d', line);
}