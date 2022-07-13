const width = 800;
const height = 400;

var svgContainer = d3
  .select('.visHolder')
  .append('svg')
  .attr('width', width + 100)
  .attr('height', height + 60);

var tooltip = d3
  .select('.visHolder')
  .append('div')
  .attr('id', 'tooltip')
  .style('opacity', 0);

d3.json(
    'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json')
    .then(function (data) {

        svgContainer
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -200)
        .attr('y', 80)
        .text('Gross Domestic Product');
    
        svgContainer
        .append('text')
        .attr('x', width / 2 + 120)
        .attr('y', height + 50)
        .text('More Information: http://www.bea.gov/national/pdf/nipaguid.pdf')
        .attr('class', 'info');

        var dataset = data.data;
        dataset = dataset.map((x) => [new Date(x[0]), x[1]]);
        var xMax = d3.max(dataset, (x) => x[0]);
        xMax.setMonth(xMax.getMonth() + 3);

        const barWidth = width / dataset.length;

        var xScale = d3
        .scaleTime()
        .domain([d3.min(dataset, (x) => x[0]), xMax])
        .range([0, width]);

        var yScale = d3.scaleLinear()
        .domain([0, d3.max(dataset, (x) => x[1])])
        .range([height, 0]);

        var bars = svgContainer.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("x", (d) => xScale(d[0]))
        .attr("y", (d) => yScale(d[1]))
        .attr('width', barWidth)
        .attr('height', (d) => height - yScale(d[1]))
        .attr('transform', 'translate(60, 0)')
        .attr('class', 'bar')
        .style('fill', '#33adff')
        .attr('data-date', (d, i) => data.data[i][0])
        .attr('data-gdp', (d) => d[1])
        .attr('formatted-date', function(d, i) {
            var year = d[0].getYear();
            var month = d[0].getMonth();
            var quarter;
            if (month >= 0 && month <= 3){
                quarter = 1;
            } else if (month >= 4 && month <= 6){
                quarter = 2;
            } else if (month >= 7 && month <= 9){
                quarter = 3;
            } else if (month >= 10 && month <= 12){
                quarter = 4;
            }
            return year + " Q" + quarter;
        })
        .attr('index', (d, i) => i)

        bars.on('mouseover', function (event, d, i) {
            // d or datum is the height of the
            // current rect
            var i = this.getAttribute('index');
    
            tooltip.transition().duration(200).style('opacity', 0.9);
            tooltip
              .html(
                this.getAttribute('formatted-date') + "<br>" +
                d[1]
              )
              .style('left', i * barWidth + 30 + 'px')
              .style('top', height - 100 + 'px')
              .style('transform', 'translateX(60px)')
              .attr('data-date', (d, i) => data.data[i][0])

          })
          .on('mouseout', function () {
            tooltip.transition().duration(200).style('opacity', 0);
          });

        var xAxis = d3.axisBottom().scale(xScale);

        svgContainer
        .append('g')
        .call(xAxis)
        .attr('id', 'x-axis')
        .attr('transform', 'translate(60, 400)')

        var yAxis = d3.axisLeft().scale(yScale);

        svgContainer
        .append('g')
        .call(yAxis)
        .attr('id', 'y-axis')
        .attr('transform', 'translate(60, 0)')

    }).catch(function(error){
        console.log(error);
    })

