(() => {
  window.addEventListener('DOMContentLoaded', async () => {
    // Constants
    const WIDTH = 975;
    const HEIGHT = 610;
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

      const _tooltipHTML = (d) => {
        return `
          ${d.area_name}, ${d.state}
            <br>
            Bachelor or higher: ${d.bachelorsOrHigher}%
          `;
      };

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

      const color = d3.scaleQuantize([1, 100], d3.schemeBlues[9]);

      // Axis bars

      //Tooltip
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
        .append('g')
        .selectAll('path')
        .data(topojson.feature(us, us.objects.counties).features)
        .join('path')
        .attr('class', 'county')
        .attr('d', path)
        .attr('fill', (d) => {
          const [edx] = educationData.data.filter(
            (county) => county.fips === d.id
          );
          return color(edx.bachelorsOrHigher);
        })
        .attr('data-fips', (d, i) => d.id)
        .attr('data-education', (d, i) => {
          const [edx] = educationData.data.filter(
            (county) => county.fips === d.id
          );
          return edx.bachelorsOrHigher;
        });

      // Tooltip animation
      svg
        .append('path')
        .datum(topojson.mesh(us, us.objects.states, (a, b) => a !== b))
        .attr('fill', 'none')
        .attr('stroke', 'white')
        .attr('stroke-linejoin', 'round')
        .attr('d', path);

      svg
        .selectAll('.county')
        .on('mouseover', function (d) {
          d3.select(this).order().raise().style('stroke', 'black');
          const [edx] = educationData.data.filter(
            (county) => county.fips === d.id
          );
          tooltip

            .html(`${_tooltipHTML(edx)}`)
            .attr('data-year', `${d.year}`)
            .style('visibility', 'visible')
            .style('top', `${y(d.month) - 65}px`)
            .style('left', `${x(new Date(String(d.year)))}px`);
        })
        .on('mouseout', function () {
          d3.select(this).order().lower().style('stroke', 'none');
          tooltip.style('visibility', 'hidden');
        });
    }
  });
})();
