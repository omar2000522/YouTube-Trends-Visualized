function toggleSVG(visNum) {
    var divs = document.getElementsByClassName('visualization');
    for (var i = 0; i < divs.length; i++) {
        divs[i].style.display = 'none';
    }
    document.getElementById('vis' + visNum).style.display = 'block';
}
// toggleSVG(2);





function vis1() {
    var width = 1000;
    var height = 800;
    var margin = 100;

    var svg = d3.select('#vis1')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .style('text-align', 'center')
        // .style('background-color', 'lightgrey');
        .style('border', 'solid')

    var tooltip = d3.select('#vis1')
        .append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0)
        .style('position', 'absolute')
        .style('background-color', 'white')
        .style('border', 'solid')
        .style('border-radius', '5px')
        .style('padding', '10px')
        .style('text-align', 'center');

    d3.csv('data.csv').then(function (data) {
        data = data.filter(function (d) {
            return d.ratings_disabled == 'False';
        });

        
        data = data.map(function (d) {
            return {
                video_id: d.video_id,
                likes: +d.likes,
                dislikes: +d.dislikes,
                title: d.title,
                trending_date: d.trending_date,
                channel_title: d.channel_title,
                thumbnail_link: d.thumbnail_link
            };
        });

        var videoData = d3.group(data, d => d.video_id);
        // console.log(videoData);

        var xScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.likes)])
            .range([margin + 2, width - margin - 2]);

        var yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.dislikes)])
            .range([height - margin - 2, margin + 2]);

        var colorScale = (l, d) => l > d ? 'green' : 'red'; 

        var xAxis = d3.axisBottom(xScale);
        var yAxis = d3.axisLeft(yScale);

        svg.append('g')
            .attr('transform', 'translate(0,' + (height - margin) + ')')
            .call(xAxis);

        svg.append('g')
            .attr('transform', 'translate(' + margin + ',0)')
            .call(yAxis);

        var line = d3.line()
            .x(d => xScale(d.likes))
            .y(d => yScale(d.dislikes));


        var videoIds = Array.from(videoData.keys());
        videoIds.forEach(function (videoId) {
            var video = videoData.get(videoId);
            

            svg.append('path')
                .datum(video)
                .attr('d', line)
                .attr('fill', 'none')
                .attr('stroke', 'black')
                .attr('stroke-width', 1)
                .attr('class', 'vidLine');
        }); 
                
        svg.selectAll('circle')
            .data(data)
            .enter()
            .append('circle')
            .attr('cx', d => xScale(d.likes))
            .attr('cy', d => yScale(d.dislikes))
            .attr('r', 5)
            .attr('stroke', 'black')
            .attr('stroke-width', 1)
            .attr('class', 'vidCircle')
            .attr('fill', d => colorScale(d.likes, d.dislikes))
            .on('mouseover', function (e, d) {
                tooltip
                    .html(
                    '<b>Video:</b> ' + d.title + 
                    '<br>' + '<b>Channel: </b>' + d.channel_title +
                    '<br>' + '<b>Trending Date: </b>' + d.trending_date +
                    '<br>' + '<b>Like Ratio: </b>' + (d.likes / (d.likes + d.dislikes) * 100).toFixed(2) + '%' +
                    '<br><img src="' + d.thumbnail_link + '" alt="thumbnail" height="90">'
                    );


                tooltip
                    .style('left', (e.pageX + 5) + 'px')
                    .style('top', (e.pageY - 30) + 'px');

                tooltip.transition()
                    .duration(200)
                    .style('opacity', 0.9);
            })
            .on('mouseout', function () {
                tooltip.transition()
                    .duration(50)
                    .style('left', 0)
                    .style('top', 0)
                    .style('opacity', 0);
            });
                
            svg.append('text')
                .attr('x', width / 2)
                .attr('y', height - 50)
                .style('font-size', '20px')
                .style('text-anchor', 'middle')
                .text('Likes');

            svg.append('text')
                .attr('transform', 'rotate(-90)')
                .attr('y', 50)
                .attr('x', -(height / 2))
                .style('font-size', '20px')
                .style('text-anchor', 'middle')
                .text('Dislikes');
            
            svg.append('text')
                .attr('x', (width / 2))
                .attr('y', (margin / 2) - 10)
                .attr('text-anchor', 'middle')
                .style('font-size', '25px')
                .text('Likes vs Dislikes');

            svg.append('text')
                .attr('x', (width / 2))
                .attr('y', (margin / 2) + 10)
                .attr('text-anchor', 'middle')
                .style('font-size', '15px')
                .text('(Videos that reappear in the trending page are connected)');

            svg.append('text')
                .attr('x', (width / 2))
                .attr('y', (margin / 2) + 30)
                .attr('text-anchor', 'middle')
                .style('font-size', '15px')
                .text('Hover over a point to see more information about the video!');

        
            var legend = svg.append('g')
                .attr('transform', 'translate(' + (width - 3*margin) + ',' + (2*margin) + ')');

            legend.append('circle')
                .attr('cx', 0)
                .attr('cy', 0)
                .attr('r', 10)
                .attr('fill', 'red')
                .attr('stroke', 'black')
                .attr('stroke-width', 2);

            legend.append('circle')
                .attr('cx', 0)
                .attr('cy', 30)
                .attr('r', 10)
                .attr('fill', 'green')
                .attr('stroke', 'black')
                .attr('stroke-width', 2);

            legend.append('text')
                .attr('x', 20)
                .attr('y', 0)
                .attr('dy', '0.35em')
                .text('More dislikes than likes')
                .style('font-size', '20px');

            legend.append('text')
                .attr('x', 20)
                .attr('y', 30)
                .attr('dy', '0.35em')
                .text('More likes than dislikes')
                .style('font-size', '20px');
                


    });

}   

function vis2() {

    var width = 1000;
    var height = 800;
    var margin = 100;

    var svg = d3.select('#vis2')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .style('text-align', 'center')
        .style('border', 'solid')

    d3.csv('data.csv').then(function (data) {
        var radio = d3.selectAll('input');
        // console.log(radio);


        data = data.filter(d => {
            return d.ratings_disabled == 'False' && d.comments_disabled == 'False';
        });

        data.forEach(function (d) {
            var date = d.trending_date.split('.');
            d.trending_date = date[1] + '/' + date[2] + '/20' + date[0];
        });

        var viewsDaily = d3.group(data, d => d.trending_date);
        var dates = Array.from(viewsDaily.keys());

        var xScale = d3.scaleBand()
            .domain(dates)
            .range([margin, width - margin])
            .padding(0.1);

        var yScale = d3.scaleLinear()
            .domain([0, d3.max(viewsDaily, d => d3.sum(d[1], d => d.views))])
            .range([height - margin, margin]);

        var xAxis = d3.axisBottom(xScale);
        var yAxis = d3.axisLeft(yScale);

        svg.append('g')
            .attr('transform', 'translate(0,' + (height - margin) + ')')
            .attr('class', 'x-axis')
            .call(xAxis)
            .selectAll('text')
            .attr('transform', 'rotate(-30)')
            .attr('text-anchor', 'end')
            .attr('class', 'xtick')
            .attr('font-size', '15px');



        svg.selectAll('.tick')
            .filter(function (d, i) {
                if (d.slice(0, 2) == '01') {
                    return false;
                }
                return true;
            })
            .remove();

        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        svg.selectAll('.xtick')
            .text(function (d) {
                var nd = d.slice(3).split('/');
                return months[nd[0] - 1] + ' ' + nd[1];
            });

            
        svg.append('g')
            .attr('transform', 'translate(' + margin + ',0)')
            .attr('class', 'y-axis')
            .call(yAxis)
            .selectAll('text')
            .attr('font-size', '15px')
            .attr('class', 'ytick');

        svg.selectAll('.ytick')
            .text(function (d) {
                // console.log(d);
                return d / 1000000 + 'M';
            });

        var line = d3.line()
            .x(d => xScale(d[0]))
            .y(d => yScale(d3.sum(d[1], d => d.views)));

        
        
        svg.append('path')
            .datum(viewsDaily)
            .attr('d', line)
            .attr('fill', 'none')
            .attr('stroke', 'black')
            .attr('stroke-width', 2)
            .attr('class', 'line');

        svg.append('text')
            .attr('x', width / 2)
            .attr('y', height - 20)
            .style('font-size', '30px')
            .style('text-anchor', 'middle')
            .text('Date');

        svg.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', 40)
            .attr('x', -(height / 2))
            .attr('class', 'y-title')
            .style('font-size', '30px')
            .style('text-anchor', 'middle')
            .text('Total Views (in millions)');

        svg.append('text')
            .attr('x', width / 2)
            .attr('y', 50)
            .attr('class', 'title')
            .style('font-size', '35px')
            .style('text-anchor', 'middle')
            .text('Total Views of Trending Page Videos Over Time');

            
        
        radio.on('change', function () {
            d3.selectAll('.tick').filter(function (d, i) {
                // filter only y axis ticks
                if (d3.select(this).select('text').attr('class') == 'ytick') {
                    return true;
                }
                return false;
            }).remove();



            var value = this.value;
            var viewsDaily, dates, xScale, yScale;
            // console.log(value);
            if (value == 'views') {
                viewsDaily = d3.group(data, d => d.trending_date);
                dates = Array.from(viewsDaily.keys());

                xScale = d3.scaleBand()
                    .domain(dates)
                    .range([margin, width - margin])
                    .padding(0.1);

                yScale = d3.scaleLinear()
                    .domain([0, d3.max(viewsDaily, d => d3.sum(d[1], d => d.views))])
                    .range([height - margin, margin]);
            } else if (value == 'likes') {
                viewsDaily = d3.group(data, d => d.trending_date);
                dates = Array.from(viewsDaily.keys());

                xScale = d3.scaleBand()
                    .domain(dates)
                    .range([margin, width - margin])
                    .padding(0.1);

                yScale = d3.scaleLinear()
                    .domain([0, d3.max(viewsDaily, d => d3.sum(d[1], d => d.likes))])
                    .range([height - margin, margin]);
            } else if (value == 'comments') {
                viewsDaily = d3.group(data, d => d.trending_date);
                dates = Array.from(viewsDaily.keys());

                xScale = d3.scaleBand()
                    .domain(dates)
                    .range([margin, width - margin])
                    .padding(0.1);

                yScale = d3.scaleLinear()
                    .domain([0, d3.max(viewsDaily, d => d3.sum(d[1], d => d.comment_count))])
                    .range([height - margin, margin]);
            }

                var yAxis = d3.axisLeft(yScale);

                svg.append('g')
                    .attr('transform', 'translate(' + margin + ',0)')
                    .call(yAxis)
                    .selectAll('text')
                    .attr('font-size', '15px')
                    .attr('class', 'ytick');

                svg.selectAll('.ytick')
                    .text(function (d) {
                        // console.log(d);
                        return d / 1000000 + 'M';
                    }
                    );
                var line;
                if (value == 'views') {
                    line = d3.line()
                        .x(d => xScale(d[0]))
                        .y(d => yScale(d3.sum(d[1], d => d.views)));

                    svg.select('.title')
                        .text('Total Views of Trending Page Videos Over Time');
                    svg.select('.y-title')
                        .text('Total Views (in millions)');
                } else if (value == 'likes') {
                    line = d3.line()
                        .x(d => xScale(d[0]))
                        .y(d => yScale(d3.sum(d[1], d => d.likes)));

                    
                    svg.select('.title')
                        .text('Total Likes of Trending Page Videos Over Time');
                    svg.select('.y-title')
                        .text('Total Likes (in millions)');
                } else if (value == 'comments') {
                    line = d3.line()
                        .x(d => xScale(d[0]))
                        .y(d => yScale(d3.sum(d[1], d => d.comment_count)));

                    svg.select('.title')
                        .text('Total Comments of Trending Page Videos Over Time');
                    svg.select('.y-title')
                        .text('Total Comments (in millions)');
                }
                    
                svg.selectAll('.line')
                    .datum(viewsDaily)
                    .transition()
                    .duration(1000)
                    .attr('d', line)
                    .attr('fill', 'none')
                    .attr('stroke', 'black')
                    .attr('stroke-width', 2)
                    .attr('class', 'line');

                
                
    
                    
            });
        var updateChart = function (e) {
            xScale.range([margin, width - margin].map(d => e.transform.applyX(d)));
            yScale.range([height - margin, margin].map(d => e.transform.applyY(d)));

            svg.selectAll('.tick')
                .remove();
            svg.selectAll('.x-axis')
                .remove();
            svg.selectAll('.y-axis')
                .remove();
            


            xAxis.scale(xScale);
            yAxis.scale(yScale);

            svg.append('g')
                .attr('class', 'x-axis')
                .attr('transform', 'translate(0,' + (height - margin) + ')')
                .call(xAxis)
                .selectAll('text')
                .attr('font-size', '15px')
                .attr('transform', 'rotate(-45)')
                .attr('text-anchor', 'end')
                .attr('class', 'xtick');

            

            svg.selectAll('.tick')
            .filter(function (d, i) {
                if (d.slice(0, 2) == '01') {
                    return false;
                }
                return true;
            })
            .remove();
    
            var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            
            svg.selectAll('.xtick')
                .text(function (d) {
                    var nd = d.slice(3).split('/');
                    return months[nd[0] - 1] + ' ' + nd[1];
            });
    

            svg.append('g')
                .attr('class', 'y-axis')
                .attr('transform', 'translate(' + margin + ',0)')
                .call(yAxis)
                .selectAll('text')
                .attr('font-size', '15px')
                .attr('class', 'ytick');

            svg.selectAll('.ytick')
                .text(function (d) {
                    // console.log(d);
                    return d / 1000000 + 'M';
                }
                );

            // crop line to visible area
            svg.selectAll('.line')
                .attr('transform', e.transform)
            

                
        }

        var zoom = d3.zoom()
            .scaleExtent([1, 20])
            .translateExtent([
                [margin, margin],
                [width - margin, height - margin]
            ])
            .extent([
                [margin, margin],
                [width - margin, height - margin]
            ])
            .on('zoom', updateChart);

        svg.call(zoom);
    });
}

function vis3() {
    var width = 1000;
    var height = 800;
    var margin = 100;

    var svg = d3.select('#vis3')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .style('text-align', 'center')
        .style('border', 'solid')

    d3.json('US_category_id.json').then(function (categoryNames) {
        d3.csv('data.csv').then(function (data) {
            categoryNames = categoryNames.items;
            data = data.map(function (d) {
                var obj = d;
                obj.category = categoryNames.find(c => c.id == d.category_id).snippet.title;
                return obj;
            });

            var viewsByCategory = d3.group(data, d => d.trending_date);
            
            var viewsByCategoryDate = Array.from(viewsByCategory, function (d) {
                var obj = {};
                obj.date = d[0];
                var views = d3.group(d[1], d => d.category);
                views = Array.from(views, function (d) {
                    return [d[0], d3.sum(d[1], d => d.views)];
                });
                views.forEach(function (d) {
                    obj[d[0]] = d[1];
                });
                categoryNames.forEach(function (d) {
                    if (!obj.hasOwnProperty(d.snippet.title)) {
                        obj[d.snippet.title] = 0;
                    }
                });
                return obj;
            });
            var orderedCategories = d3.rollup(data, v => d3.sum(v, d => d.views), d => d.category);
            orderedCategories = d3.sort(orderedCategories, d => d[1]).map(d => d[0]);
            // console.log(orderedCategories);

            // create stacked stream graph
            var stack = d3.stack()
                .keys(orderedCategories)

                
            var stackedData = stack(viewsByCategoryDate);

            var xScale = d3.scaleBand()
                .domain(Array.from(data, d => d.trending_date))
                .range([margin, width - margin])
                .padding(0.1);
            // console.log(viewsByCategoryDate)
            // console.log(stackedData);

            var yScale = d3.scaleLinear()
                .domain([0, d3.max(stackedData, d => d3.max(d, d => d[1]))])
                .range([height - margin, margin]);

            // create color scale
            var colorScale = d3.scaleOrdinal()
                .domain(Array.from(new Set(data.map(d => d.category))))
                .range(d3.schemePaired);

            var area = d3.area()
                .x(d => xScale(d.data.date)) // +console.log(d)
                .y0(d => yScale(d[0]))
                .y1(d => yScale(d[1]))


            var xAxis = d3.axisBottom(xScale);
            var yAxis = d3.axisLeft(yScale);

            svg.append('g')
                .attr('transform', 'translate(0,' + (height - margin) + ')')
                .call(xAxis)
                .selectAll('text')
                .attr('transform', 'rotate(-30)')
                .attr('text-anchor', 'end')
                .attr('class', 'xtick')
                .attr('font-size', '15px')

            var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            svg.selectAll('.tick')
                .filter(function (d, i) {
                    // console.log(d.slice(4, 6));
                    return d.slice(3, 5) != '01';
                })
                .remove();
            svg.selectAll('.xtick')
                .text(function (d) {
                    var nd = d.slice(6);
                    return months[nd - 1] + ' 20' + d.slice(0, 2);
                })

            svg.append('g')
                .attr('transform', 'translate(' + margin + ',0)')
                .call(yAxis)
                .selectAll('text')
                .attr('class', 'ytick')
                .attr('font-size', '15px')

            svg.selectAll('.ytick')
                .text(function (d) {
                    return d / 1000000 + 'M';
                })

            svg.append('text')
                
                .attr('x', width / 2)
                .attr('y', height - 20)
                .style('font-size', '30px')
                .style('text-anchor', 'middle')
                .text('Date');

            svg.append('text')
                .attr('transform', 'rotate(-90)')
                .attr('y', 40)
                .attr('x', -(height / 2))
                .style('font-size', '30px')
                .style('text-anchor', 'middle')
                .text('Total Views (in millions)');

            svg.append('text')
                .attr('x', width / 2)
                .attr('y', 50)
                .style('font-size', '35px')
                .style('text-anchor', 'middle')
                .text('Total Views of Categories in Trending Page Videos Over Time');

            var legend = svg.selectAll('.legend')
                .data(orderedCategories.reverse())
                .enter()
                .append('g')
                .attr('class', 'legend');

            svg.selectAll('.legend')
            .style('background-color', 'white')
                .style('opacity', 0.8)
                .style('border', 'solid')
                .style('border-radius', '5px')

            legend.append('rect')
                .attr('x', 150)
                .attr('y', function (d, i) {
                    return 100 + i * 15;
                })
                .attr('width', 10)
                .attr('height', 10)
                .style('fill', function (d) {
                    return colorScale(d);
                })

            legend.append('text')
                .attr('x', 170)
                .attr('y', function (d, i) {
                    return 100 + i * 15 + 10;
                }
                )
                .text(function (d) {
                    return d;
                }
                )
                
                svg.selectAll('path')
                .data(stackedData)
                .enter()
                .append('path')
                .attr('d', area)
                .attr('fill', d => colorScale(d.key))
                .attr('class', 'area')





        });
    });
    
        
}

function vis4() {
    var width = 1000;
    var height = 600;
    var margin = 100;

    var svg = d3.select('#vis4')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .style('border', 'solid');

        // I had to make another data file for the world data because the whole
        // dataset is too large to load in the browser and also submit
        // I used the following python code to make the world_data.csv file:
        // regions = ['US', 'GB', 'CA', 'DE', 'FR', 'IN', 'JP', 'KR', 'MX', 'RU']
        // data = []
        // for r in regions:
        //     tdf = pd.read_csv(fp(r + 'videos.csv'), encoding='latin-1')
        //     data.append([r, tdf['views'].mean()])
        // vws = pd.DataFrame(data, columns=['Region', 'Views']).to_csv('world_data.csv')

        var regions = ['US', 'GB', 'CA', 'DE', 'FR', 'IN', 'JP', 'KR', 'MX', 'RU'];
        var regionIds = {'US': 'USA', 'GB': 'GBR', 'CA': 'CAN', 'DE': 'DEU', 'FR': 'FRA', 'IN': 'IND', 'JP': 'JPN', 'KR': 'KOR', 'MX': 'MEX', 'RU': 'RUS'}
        d3.csv('world_data.csv', function (d) {
            return {
                region: d.Region,
                views: Math.sqrt(+d.Views)
            }
        }).then(function (data) {
            // console.log(data);

            
            d3.json('world.json').then(function (world) {
                var projection = d3.geoNaturalEarth1()
                    .scale(200)
                    .translate([width / 2, height / 2]);
    
                var path = d3.geoPath()
                    .projection(projection);

                var colorScale = d3.scaleSequential(d3.interpolateGreens)
                    .domain([0, d3.max(data, d => d.views)]);


                svg.selectAll('path')
                    .data(world.features)
                    .enter()
                    .append('path')
                    .attr('d', path)
                    .attr('fill', function (d) {
                        var region = data.filter(function (f) {
                            // console.log(f, d);
                            return d.id == regionIds[f.region];
                        })[0];
                        if (region) {
                            return colorScale(region.views);
                        } else {
                            return 'white';
                        }
                    })
                    .attr('stroke', 'black')
                    .attr('stroke-width', 0.5)
                    .attr('class', 'country')
                    .style('opacity', 0.5)

                
                svg.selectAll('.country')
                    .style('opacity', d => {
                        var region = data.filter(function (f) {

                            return d.id == regionIds[f.region];
                        })[0];
                        if (region) {
                            return 1;
                        } else {
                            return 0.3;
                        }
                    })

                // remove Antarctica
                svg.selectAll('.country')
                    .filter(function (d) {
                        return d.id == 'ATA';
                    })
                    .remove();

                var heat = colorScale.ticks(10).slice(3).reverse()
                


                var legend = svg.selectAll('.legend')
                    .data(heat)
                    .enter()
                    .append('g')
                    .attr('class', 'legend')
                    .attr('transform', function (d, i) {
                        return 'translate(0,' + (i * 20 + 3*margin) + ')';
                    });


                legend.append('rect')
                    .attr('x', margin + 10)
                    .attr('width', 20)
                    .attr('height', 20)
                    .style('fill', colorScale);

                legend.append('text')
                    .attr('x', margin)
                    .attr('y', 10)
                    .attr('dy', '.35em')
                    .style('text-anchor', 'end')
                    .style('font-size', '15px')
                    .text(function (d) {
                        return (d * d) / 1000 + 'K';
                    });

                svg.append('text')
                    .attr('x', margin + 20)
                    .attr('y', 3*margin - 10)
                    .style('font-size', '15px')
                    .style('text-anchor', 'middle')
                    .text('Average Video Views');

                svg.append('text')
                    .attr('x', width / 2)
                    .attr('y', height - 50)
                    .style('font-size', '35px')
                    .style('text-anchor', 'middle')
                    .text('Average Views of Trending Videos by Region');

                    


            })
        })

}

function vis5() {
    var width = 1000;
    var height = 1000;
    var margin = 100;

    var svg = d3.select('#vis5')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .style('border', 'solid');

    d3.csv('data.csv').then(function (data) {
        data = data.filter(function (d) {
            return d.comments_disabled == 'False';
        })

        d3.json('US_category_id.json').then(function (categories) {
            data = data.map(function (d) {
                var category = categories.items.filter(function (f) {
                    return f.id == d.category_id;
                })[0];
                d.category = category.snippet.title;
                return d;
            })
            // console.log(data);

            var categories = d3.rollup(data, v => {
                var coms = v.map(d => d.comment_count);
                
                return {
                    median: d3.median(v, d => d.comment_count),
                    iqr: d3.quantile(coms, 0.75) - d3.quantile(coms, 0.25),
                    q1: d3.quantile(coms, 0.25),
                    q3: d3.quantile(coms, 0.75),
                    min: d3.min(coms),
                    max: d3.max(coms)
                }
            }, d => d.category);
            categories = Array.from(categories, ([category, comment_count]) => ({category, comment_count}));
            // console.log(categories);

            var xScale = d3.scaleBand()
                .domain(categories.map(d => d.category))
                .range([margin, width - margin])
                .padding(0.1);

            var yScale = d3.scaleLinear()
                .domain([0, d3.max(categories, d => d.comment_count.q3)])
                .range([height - margin, margin]);

            var xAxis = d3.axisBottom(xScale);
            var yAxis = d3.axisLeft(yScale);

            svg.append('g')
                .attr('transform', 'translate(0,' + (height - margin) + ')')
                .call(xAxis)
                .selectAll('text')
                .attr('transform', 'rotate(-20)')
                .attr('text-anchor', 'end')
                .attr('font-size', '12px');


            svg.append('g')
                .attr('transform', 'translate(' + margin + ',0)')
                .call(yAxis);

            svg.selectAll('rect')
                .data(categories)
                .enter()
                .append('rect')
                .attr('x', d => xScale(d.category))
                .attr('y', d => yScale(d.comment_count.q3))
                .attr('width', xScale.bandwidth())
                .attr('height', d => yScale(d.comment_count.q1) - yScale(d.comment_count.q3))
                .attr('fill', 'steelblue')
                .attr('stroke', 'black')
                .attr('stroke-width', 1);

            svg.selectAll('midrect')
                .data(categories)
                .enter()
                .append('rect')
                .attr('x', d => xScale(d.category))
                .attr('y', d => yScale(d.comment_count.median))
                .attr('width', xScale.bandwidth())
                .attr('height', 5)
                .attr('fill', 'red')

            svg.selectAll('whisker')
                .data(categories)
                .enter()
                .append('line')
                .attr('x1', d => xScale(d.category) + xScale.bandwidth() / 2)
                .attr('x2', d => xScale(d.category) + xScale.bandwidth() / 2)
                .attr('y1', d => Math.max(yScale(d.comment_count.q3 + 1.5*d.comment_count.iqr), margin))
                .attr('y2', d => Math.min(yScale(d.comment_count.q1 - 1.5*d.comment_count.iqr), yScale(0)))
                .attr('stroke', 'black')
                .attr('stroke-width', 1);

            svg.selectAll('whisker')
                .data(categories)
                .enter()
                .append('line')
                .attr('x1', d => xScale(d.category))
                .attr('x2', d => xScale(d.category) + xScale.bandwidth())
                .attr('y1', d => Math.max(yScale(d.comment_count.q3 + 1.5*d.comment_count.iqr), margin))
                .attr('y2', d => Math.max(yScale(d.comment_count.q3 + 1.5*d.comment_count.iqr), margin))
                .attr('stroke', 'black')
                .attr('stroke-width', 1);

            svg.selectAll('whisker')
                .data(categories)
                .enter()
                .append('line')
                .attr('x1', d => xScale(d.category))
                .attr('x2', d => xScale(d.category) + xScale.bandwidth())
                .attr('y1', d => Math.min(yScale(d.comment_count.q1 - 1.5*d.comment_count.iqr), yScale(0)))
                .attr('y2', d => Math.min(yScale(d.comment_count.q1 - 1.5*d.comment_count.iqr), yScale(0)))
                .attr('stroke', 'black')
                .attr('stroke-width', 1);


            svg.append('text')
                .attr('x', width / 2)
                .attr('y', height - 30)
                .attr('text-anchor', 'middle')
                .attr('font-size', '25px')
                .text('Category');

            svg.append('text')
                .attr('x', -(height / 2))
                .attr('y', 40)
                .attr('text-anchor', 'middle')
                .attr('font-size', '25px')
                .attr('transform', 'rotate(-90)')
                .text('Comment Count');

            svg.append('text')
                .attr('x', width / 2)
                .attr('y', 50)
                .attr('text-anchor', 'middle')
                .attr('font-size', '35px')
                .text('Comment Count by Category');
                
        })
    });
}

vis1();
vis2();
vis3();
vis4();
vis5();
