function init() {
    const s_width = 700;
    const s_height = 500;
    const svgPadding = 40;

    //PUT SVGS HERE
    const svg1 = d3.select("#child-vac-rates-svg")
        .attr("height", s_height + svgPadding)
        .attr("width", s_width + svgPadding)
    //svg for alc-cons-svg
    const svg2 = d3.select("#alc-cons-svg")
        .attr("height", s_height + svgPadding)
        .attr("width", s_width + svgPadding)


    function generateSvgDataAlc(data) {
        //updated x and y for dynamic scaling:
        const scaleX = d3.scaleBand()
            .domain(data.map(d => d.country))
            .range([0, s_width])
            .paddingInner(0.40);
        const scaleY = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.rate)])
            .range([s_height, 0]);

        //Add ticks and adjust sizing
        const xAxis = d3.axisBottom(scaleX).tickSize(15);
        const yAxis = d3.axisLeft(scaleY).ticks(10).tickSize(15);

        //Horizontal ine for when a bar is hovered over
        const hoverLine = svg2.append("line")
            .attr("class", "highlight")
            .attr("x1", 0)
            .attr("x2", s_width)
            .attr("y1", s_height)
            .attr("y2", s_height)
            .style("opacity", 0);

        //for adding border around x-axis text in mouseover
        const borderGroup = svg2.append('g')
            .attr('class', 'border-group');


        //alc-con-svg bars
        let rects = svg2.selectAll("rect").data(data).enter()
            .append("rect")
            .attr("class", "rect-a")
            .attr("stroke", "black")
            .attr("stroke-width", "2px")
            .attr("fill", "#9e9ac8")
            .attr("x", d => scaleX(d.country) + svgPadding)
            .attr("width", scaleX.bandwidth())
            //mouseover effects for line and text border
            .on("mouseover", function(event, d) {
                const barY = scaleY(event.rate);
                //specify dimensions of horizontal line and make visible
                hoverLine
                    .attr("x1", svgPadding) // Start position moved left
                    .attr("x2", s_width + svgPadding)
                    .attr("y1", barY)
                    .attr("y2", barY)
                    .attr("id", "line-bar")
                    .style("opacity", 0.5);
                //specify border around x-axis text
                borderGroup
                    .selectAll('.border')
                    .data([1])
                    .join('rect')
                    .attr('class', 'border')
                    .attr('fill', 'none')
                    .attr('x', scaleX(event.country) + svgPadding)
                    .attr('y', s_height + 15) // Adjust for padding
                    .attr('width', scaleX.bandwidth())
                    .attr('height', 20)
                    .attr('stroke', 'black')
                    .attr('stroke-width', 3);
            })
            .on("mouseout", function (event, d) {
                hoverLine.style("opacity", 0);
                borderGroup.selectAll('.border').remove();
            })
            //transition
            .attr("y", s_height)
            .attr("height", 0)
            .transition()
            .duration(1000)
            .ease(d3.easeCircleOut)
            .attr("y", d => scaleY(d.rate))
            .attr("height", d => s_height - scaleY(d.rate))

        //axis lines
        svg2.append("g")
            .call(xAxis)
            .attr("class", "axis x-axis")
            .attr("transform", `translate(${svgPadding}, ${s_height})`).style("font-size", "14px");

        svg2.append("g")
            .call(yAxis)
            .attr("class", "axis y-axis")
            .attr("transform", `translate(${svgPadding},  0)`).style("font-size", "14px");
    }

    function generateSvgDataChld(data) {
        //updated x and y for dynamic scaling:
        const scaleX = d3.scaleLinear() //scale linear as non-bar chart graph
            .domain([1, data.length])
            .range([svgPadding, s_width])
        const scaleY = d3.scaleLinear()
            .domain([0, 110])
            .range([s_height, 0]);

        //Add ticks and adjust sizing
        const xAxis = d3.axisBottom(scaleX).tickSize(15);
        const yAxis = d3.axisLeft(scaleY).ticks(10).tickSize(15);

        //Horizontal ine for when a bar is hovered over
        const hoverLine = svg1.append("line")
            .attr("class", "highlight")
            .attr("x1", 0)
            .attr("x2", s_width)
            .attr("y1", s_height)
            .attr("y2", s_height)
            .style("opacity", 0);


        //vacc-rate-svg dtp dots
        let circ1 = svg1.selectAll("circle").data(data).enter()
            .append("circle")
            .attr("visibility", function(d){if (d.dtp) return "visible"; else return "hidden";}) //hide dot if value doesn't exist
            .attr("class", "circ-c")
            .attr("stroke", "black")
            .attr("stroke-width", "2px")
            .attr("fill", "#9e9ac8")
            .attr("cx", function(d, i){return (scaleX(i+1));})
            .attr("cy", function(d){return scaleY(d.dtp);})
            .attr("r", 3)
            //mouseover effects for line
            .on("mouseover", function(event, d) {
                const cirY = scaleY(event.dtp);
                //specify dimensions of horizontal line and make visible
                hoverLine
                    .attr("x1", svgPadding) // Start position moved left
                    .attr("x2", s_width + svgPadding)
                    .attr("y1", cirY)
                    .attr("y2", cirY)
                    .attr("id", "line-bar")
                    .style("opacity", 0.5);
            })
            .on("mouseout", function (event, d) {
                hoverLine.style("opacity", 0);
            })
        
            //vacc-rate-measles-dots
        let circ2 = svg1.selectAll("circle").data(data).enter()
            .append("circle")
            .attr("visibility", function(d){if (d.Measles) return "visible"; else return "hidden";}) //hide dot if value doesn't exist
            .attr("class", "circ-c")
            .attr("stroke", "black")
            .attr("stroke-width", "2px")
            .attr("fill", "#e61017")
            .attr("cx", function(d, i){return (scaleX(i+1));})
            .attr("cy", function(d){return scaleY(d.Measles);})
            .attr("r", 3)
            //mouseover effects for line
            .on("mouseover", function(event, d) {
                const cirY = scaleY(event.Measles);
                //specify dimensions of horizontal line and make visible
                hoverLine
                    .attr("x1", svgPadding) // Start position moved left
                    .attr("x2", s_width + svgPadding)
                    .attr("y1", cirY)
                    .attr("y2", cirY)
                    .attr("id", "line-bar")
                    .style("opacity", 0.5);
            })
            .on("mouseout", function (event, d) {
                hoverLine.style("opacity", 0);
            })

        //axis lines
        svg1.append("g")
            .call(xAxis)
            .attr("class", "axis x-axis")
            .attr("transform", `translate(0, ${s_height})`).style("font-size", "14px");

        svg1.append("g")
            .call(yAxis)
            .attr("class", "axis y-axis")
            .attr("transform", `translate(${svgPadding},  0)`).style("font-size", "14px");
    }


    //todo: work on filters in other branch
    d3.select("#a-c-year").on("change", function() {
        console.log(this.value, "changed year for a")
    });
    d3.select("#a-c-countries").on("change", function() {
        console.log(this.value, "changed country for a")
    });

    //default value used here
    d3.csv(`../assign3/DV_CSVs/Alcohol Consumption/AC_2023.csv`).then(data => {
        generateSvgDataAlc(data)
    });

    d3.csv('../assign3/DV_CSVs/Child Vaccination/CV_2022.csv').then(function(data){
        generateSvgDataChld(data)
    })

}


window.onload = init;