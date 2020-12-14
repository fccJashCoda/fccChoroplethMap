(() => {
  window.addEventListener('DOMContentLoaded', async () => {
    // Constants
    const WIDTH = 1500;
    const HEIGHT = 560;
    const PADDING = 120;

    // DOM queries

    // Init
    const countyData = await fetchData('http://localhost:5555/api/countyData');
    const educationData = await fetchData(
      'http://localhost:5555/api/educationData'
    );
    renderData(countyData, educationData);

    // funciton declarations
    async function fetchData(url) {
      try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
      } catch (err) {
        return {};
      }
    }

    function renderData(countyData, educationData) {
      // Private Functions

      const _tooltipHTML = (d) => `
     ${d.year} - ${d.month}
       <br>
       Temperature: ${d.temperature} °C
       <br> 
       Difference: ${d.variance} °C
     `;

      //  Data
      console.log(educationData);
      // countyData.data.objects.counties.geometries = countyData.data.objects.counties.geometries.map(
      //   (county, i) => {
      //     return Object.assign(county, educationData.data[i]);
      //   }
      // );

      const us = countyData.data;
      console.log(us);
      console.log(topojson);

      const path = d3.geoPath();

      // Axis bars

      // Tooltip
      // const tooltip = d3
      //   .select('article')
      //   .append('div')
      //   .attr('id', 'tooltip')
      //   .style('visibility', 'hidden');

      // Main SVG
      const svg = d3
        .select('article')
        .append('svg')
        .attr('id', 'title')
        // .attr('width', WIDTH)
        // .attr('height', HEIGHT)
        .attr('viewBox', `0 0 ${WIDTH} ${HEIGHT}`);

      svg
        .append('g')
        .selectAll('path')
        .data(topojson.feature(us, us.objects.counties).features)
        .join('path')
        .attr('fill', 'steelblue')
        .attr('d', path);
      // .selectAll('rect')
      // .data(monthlyVariance)
      // .enter()
      // .append('rect')
      // .attr('class', 'cell')
      // .attr('x', (d) => x(new Date(String(d.year))))
      // .attr('y', (d) => y(d.month))
      // .attr('fill', (d) => _getTemperatureColor(d.temperature))
      // .attr('width', `${Math.ceil(WIDTH / monthlyVariance.length) + 5}px`)
      // .attr('height', `${Math.ceil(HEIGHT / monthNames.length) - 10}px`)
      // .attr('data-month', (d) => d.monthN)
      // .attr('data-year', (d) => d.year)
      // .attr('data-temp', (d) => d.variance);

      // Tooltip animation
      svg;
      // .selectAll('.cell')
      // .on('mouseover', function (d, i) {
      //   d3.select(this).order().raise().style('stroke', 'black');
      //   tooltip

      //     .html(`${_tooltipHTML(d)}`)
      //     .attr('data-year', `${d.year}`)
      //     .style('visibility', 'visible')
      //     .style('top', `${y(d.month) - 65}px`)
      //     .style('left', `${x(new Date(String(d.year)))}px`);
      // })
      // .on('mouseout', function () {
      //   d3.select(this).order().lower().style('stroke', 'none');
      //   tooltip.style('visibility', 'hidden');
      // });

      // Render Axiis bars

      // Legend
      // const legendX = d3.scaleBand().domain(tempData).range([0, 380]);

      // const legendXAxis = d3.axisBottom(legendX).ticks(11);

      // const legend = svg
      //   .append('g')
      //   .attr('id', 'legend')
      //   .attr('transform', `translate(${140}, ${HEIGHT - 40})`);

      // legend
      //   .selectAll('rect')
      //   .data(tempData)
      //   .enter()
      //   .append('rect')
      //   .attr('x', (d) => legendX(d) + 19)
      //   .attr('y', (d) => -20)
      //   .attr('width', `${(500 - PADDING) / tempData.length}px`)
      //   .attr('height', `20px`)
      //   .attr('fill', (d) => (d < 12 ? _getTemperatureColor(d) : 'transparent'))
      //   .style('stroke', (d) => (d < 12 ? '#333' : 'transparent'));

      // legend.append('g').attr('id', 'legend-x-axis').call(legendXAxis);

      // legend
      //   .append('text')
      //   .text('°Celsius to Color Sample')
      //   .attr('x', 130)
      //   .attr('y', 35);
    }
  });
})();
