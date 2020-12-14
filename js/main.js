(() => {
  window.addEventListener('DOMContentLoaded', async () => {
    // Constants
    const URL =
      'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json';
    const WIDTH = 1500;
    const HEIGHT = 560;
    const PADDING = 120;

    // DOM queries
    const temperature = document.getElementById('base-temperature');

    // Init
    const data = await fetchData();
    const processed = await processData(data);
    temperature.textContent = `${processed.baseTemperature}°C`;
    renderData(processed);

    // funciton declarations
    async function fetchData() {
      try {
        const response = await fetch(URL);
        const data = await response.json();
        return data;
      } catch (err) {
        return {};
      }
    }

    function processData(rawData) {
      const { baseTemperature, monthlyVariance } = rawData;

      function _roundToTwo(n) {
        return +(Math.round(n + 'e+2') + 'e-2');
      }

      const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];

      const tempData = [2.8, 3.9, 5.0, 6.1, 7.2, 8.3, 9.5, 10.6, 11.7, 12.8];

      const newMonthlyVariance = [];
      for (let data of monthlyVariance) {
        const variance = _roundToTwo(data.variance);
        const temperature = _roundToTwo(baseTemperature + variance);
        const month = monthNames[data.month - 1];
        const monthN = data.month - 1;
        const year = data.year;

        newMonthlyVariance.push({ year, variance, temperature, month, monthN });
      }

      return {
        baseTemperature,
        monthlyVariance: newMonthlyVariance,
        monthNames,
        tempData,
      };
    }

    function renderData(dataset) {
      // Private Functions
      function _getTemperatureColor(temperature) {
        switch (true) {
          case temperature >= 12.8:
            return '#ff0010';
          case temperature >= 11.7:
            return '#ff2900';
          case temperature >= 10.6:
            return '#ff5300';
          case temperature >= 9.5:
            return '#ff7e00';
          case temperature >= 8.3:
            return '#ffa345';
          case temperature >= 7.2:
            return '#ffc486';
          case temperature >= 6.1:
            return '#ffd7ae';
          case temperature >= 5.0:
            return '#dbe5ff';
          case temperature >= 3.9:
            return '#bed2ff';
          case temperature >= 2.8:
            return '#a1bfff';
          default:
            return '#2020dd';
        }
      }

      const _tooltipHTML = (d) => `
     ${d.year} - ${d.month}
       <br>
       Temperature: ${d.temperature} °C
       <br> 
       Difference: ${d.variance} °C
     `;

      //  Data
      const {
        baseTemperature,
        monthlyVariance,
        monthNames,
        tempData,
      } = dataset;

      // Scales
      const minYear = new Date(String(d3.min(monthlyVariance, (d) => d.year)));
      const maxYear = new Date(
        String(Number(d3.max(monthlyVariance, (d) => d.year)) + 1)
      );

      const x = d3
        .scaleTime()
        .domain([minYear, maxYear])
        .range([PADDING, WIDTH - 15]);

      const y = d3
        .scaleBand()
        .domain(monthNames)
        .range([10, HEIGHT - PADDING]);

      // Axis bars
      const xAxis = d3.axisBottom(x).ticks(20);
      const yAxis = d3.axisLeft(y);

      // Tooltip
      const tooltip = d3
        .select('article')
        .append('div')
        .attr('id', 'tooltip')
        .style('visibility', 'hidden');

      // Main SVG
      const svg = d3
        .select('article')
        .append('svg')
        .attr('id', 'title')
        .attr('width', WIDTH)
        .attr('height', HEIGHT)
        .attr('viewBox', `0 0 ${WIDTH} ${HEIGHT}`);

      svg
        .selectAll('rect')
        .data(monthlyVariance)
        .enter()
        .append('rect')
        .attr('class', 'cell')
        .attr('x', (d) => x(new Date(String(d.year))))
        .attr('y', (d) => y(d.month))
        .attr('fill', (d) => _getTemperatureColor(d.temperature))
        .attr('width', `${Math.ceil(WIDTH / monthlyVariance.length) + 5}px`)
        .attr('height', `${Math.ceil(HEIGHT / monthNames.length) - 10}px`)
        .attr('data-month', (d) => d.monthN)
        .attr('data-year', (d) => d.year)
        .attr('data-temp', (d) => d.variance);

      // Tooltip animation
      svg
        .selectAll('.cell')
        .on('mouseover', function (d, i) {
          d3.select(this).order().raise().style('stroke', 'black');
          tooltip

            .html(`${_tooltipHTML(d)}`)
            .attr('data-year', `${d.year}`)
            .style('visibility', 'visible')
            .style('top', `${y(d.month) - 65}px`)
            .style('left', `${x(new Date(String(d.year)))}px`);
        })
        .on('mouseout', function () {
          d3.select(this).order().lower().style('stroke', 'none');
          tooltip.style('visibility', 'hidden');
        });

      // Render Axiis bars
      svg
        .append('g')
        .attr('id', 'x-axis')
        .attr('transform', `translate(0,${HEIGHT - PADDING})`)
        .style('font', '14px arial')
        .call(xAxis);

      svg
        .append('g')
        .attr('id', 'y-axis')
        .attr('transform', `translate(${PADDING}, 0)`)
        .style('font', '14px arial')
        .call(yAxis);

      svg
        .append('text')
        .attr('x', WIDTH / 2 - 30)
        .attr('y', HEIGHT - 60)
        .style('font', '20px arial')
        .text('Years');

      svg
        .append('text')
        .attr('x', -HEIGHT / 2 + 20)
        .attr('y', 25)
        .attr('transform', `rotate(-90)`)
        .style('font', '20px arial')
        .text('Months');

      // Legend
      const legendX = d3.scaleBand().domain(tempData).range([0, 380]);

      const legendXAxis = d3.axisBottom(legendX).ticks(11);

      const legend = svg
        .append('g')
        .attr('id', 'legend')
        .attr('transform', `translate(${140}, ${HEIGHT - 40})`);

      legend
        .selectAll('rect')
        .data(tempData)
        .enter()
        .append('rect')
        .attr('x', (d) => legendX(d) + 19)
        .attr('y', (d) => -20)
        .attr('width', `${(500 - PADDING) / tempData.length}px`)
        .attr('height', `20px`)
        .attr('fill', (d) => (d < 12 ? _getTemperatureColor(d) : 'transparent'))
        .style('stroke', (d) => (d < 12 ? '#333' : 'transparent'));

      legend.append('g').attr('id', 'legend-x-axis').call(legendXAxis);

      legend
        .append('text')
        .text('°Celsius to Color Sample')
        .attr('x', 130)
        .attr('y', 35);
    }
  });
})();
