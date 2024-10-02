function init() {
    const s_width = 700;
    const s_height = 500;
    const svgPadding = 100;
    //for alc cons' hidden text:
    const hiddenACPill = document.getElementById("a-c-h")
    const hiddenACCountry = document.getElementById("a-c-h-country")
    const hiddenACRate = document.getElementById("a-c-h-rate")
    const hiddenCVPill = document.getElementById("c-v-c-h")
    const hiddenCVCountry = document.getElementById("c-v-c-h-country")
    const hiddenCVDis = document.getElementById("c-v-c-h-dis")
    const hiddenCVPerc = document.getElementById("c-v-c-h-perc")
    
    hiddenACPill.style.opacity = 0;
    hiddenCVPill.style.opacity = 0;

    //SVGS
    const svg1 = d3.select("#child-vac-rates-svg")
        .attr("height", s_height + svgPadding)
        .attr("width", s_width + svgPadding)
    //svg for alc-cons-svg
    const svg2 = d3.select("#alc-cons-svg")
        .attr("height", s_height + svgPadding)
        .attr("width", s_width + svgPadding)


    function getScaleX (data) {
        return d3.scaleBand()
            .domain(data.map(d => d.country))
            .range([0, s_width])
            .paddingInner(0.40);
    }
    function getScaleY(data) {
        const maxValue = d3.max(data, d => d.rate);
        return d3.scaleLinear()
            .domain([0, maxValue * 1.1]) // Add 10% padding above the maximum value
            .range([s_height, 0]);
    }

    function generateSvgDataAlc(data) {
        // Update the scales and their domains with the data
        const scaleX = getScaleX(data)
        const scaleY = getScaleY(data)

        //Remove any existing axis if data changed
        svg2.selectAll('.x-axis').remove();
        svg2.selectAll('.y-axis').remove();

        //X and Y axis
        const xAxis = d3.axisBottom(scaleX).tickSize(15);
        const yAxis = d3.axisLeft(scaleY).tickSize(15);

        //Hover line for bar
        const hoverLine = svg2.append("line")
            .attr("class", "highlight")
            .attr("x1", 0)
            .attr("x2", s_width)
            .attr("y1", s_height)
            .attr("y2", s_height)
            .style("opacity", 0);

        //Group for X axis text - in mouseover
        const borderGroup = svg2.append('g')
            .attr('class', 'border-group');

        //Bar code
        const bars = svg2.selectAll("rect")
            .data(data)

        bars.enter()
            .append("rect")
            .merge(bars)
            .attr("class", "rect-a")
            .attr("stroke", "black")
            .attr("stroke-width", "2px")
            .attr("fill", "black")
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
                //hide borders if text is skewed:
                if (data.length > 9) {
                    borderGroup.select('.border')
                        .attr('opacity', '0')
                }
                hiddenACPill.style.opacity = 1;
                hiddenACCountry.innerText = event.country;
                hiddenACRate.innerText = event.rate;

            })
            .on("mouseout", function (event, d) {
                hoverLine.style("opacity", 0);
                borderGroup.selectAll('.border').remove();
                hiddenACPill.style.opacity = 0;
            })
            //transition
            .attr("y", s_height)
            .attr("height", 0)
            .transition()
            .duration(1000)
            .attr("fill", "#9e9ac8")
            .ease(d3.easeCircleOut)
            .attr("y", d => scaleY(d.rate))
            .attr("height", d => s_height - scaleY(d.rate))

        //Remove old bars
        bars.exit().remove()

        //X and Y Axis called
        const gx = svg2.append("g")
            .call(xAxis)
            .attr("class", "axis x-axis")
            .attr("transform", `translate(${svgPadding}, ${s_height})`).style("font-size", "14px")
            if(data.length > 9) {
                gx
                    .selectAll("text")
                    .style("text-anchor", "end")
                    .transition()
                    .duration(1000)
                    .ease(d3.easeCircleOut)
                    .attr("transform", "translate(-10,0)rotate(-45)")
                    .style("text-anchor", "end");
            }

        const gy = svg2.append("g")
            .call(yAxis)
            .attr("class", "axis y-axis")
            .attr("transform", `translate(${svgPadding},  0)`).style("font-size", "14px");

    }


    function generateSvgDataChld(data) {
        //updated x and y for dynamic scaling:
        var scaleX = d3.scalePoint() 
            .domain(data.map(function(d){return d.Category;}))
            .range([svgPadding+10, s_width]);
        var scaleY = d3.scaleLinear()
            .domain([0, 110])
            .range([s_height, 0]);

        //Add ticks and adjust sizing
        const xAxis = d3.axisBottom(scaleX).tickSize(0);
        const yAxis = d3.axisLeft(scaleY).ticks(10).tickSize(15);

        //Horizontal ine for when a bar is hovered over
        const hoverLine1 = svg1.append("line")
            .attr("id", "CVhighlight1")
            .attr("class", "highlight")
            .attr("x1", 0)
            .attr("x2", s_width)
            .attr("y1", s_height)
            .attr("y2", s_height)
            .style("opacity", 0);

        const hoverLine2 = svg1.append("line")
            .attr("id", "CVhighlight2")
            .attr("class", "highlight")
            .attr("x1", 0)
            .attr("x2", s_width)
            .attr("y1", s_height)
            .attr("y2", s_height)
            .style("opacity", 0);

            //lines connecting country data points
        const vertline1 = svg1.selectAll(".vertline").data(data).enter()
                        .append("line")
                        .attr("class", "vertline")
                        .attr("visibility", function(d){if (d.Measles&&d.dtp) return "visibile"; else return "hidden";})
                        .attr("x1", function(d){return scaleX(d.Category);})
                        .attr("x2", function(d){return scaleX(d.Category);})
                        .attr("y1", function(d){if (d.dtp) return scaleY(d.dtp); else return 0;})
                        .attr("y2", function(d){if (d.Measles) return scaleY(d.Measles); else return 0;})
                        .attr("fill", "#758bfd")
                        .attr("stroke", "#758bfd");

        const vertline2 = svg1.append("line")
                        .attr("id", "vertline2")
                        .attr("x1", 0)
                        .attr("x2", 0)
                        .attr("y1", s_height)
                        .attr("y2", 0)
                        .attr("fill", "#758bfd")
                        .attr("stroke", "#758bfd")
                        .attr("stroke-width", 5)
                        .style("opacity", 0);

        //vacc-rate-svg dtp dots
        let circ1 = svg1.selectAll("dtp").data(data).enter()
            .append("svg:image")
            .attr("class", "dtp")
            .attr("visibility", function(d){if (d.dtp) return "visible"; else return "hidden";}) //hide dot if value doesn't exist
            .attr("xlink:href", '../assign3/assets/figma-svgs/diptheria.svg')
            .attr("width", 10)
            .attr("height", 10)
            .attr("x", function(d){return scaleX(d.Category)-5;})
            .attr("y", function(d){return scaleY(d.dtp)-5;})
            //mouseover effects for line
            .on("mouseover", function(event, d) {
                var cirY = scaleY(event.dtp);
                var cirX = scaleX(event.Category);
                var opacity = 0;
                if (event.dtp)
                    opacity = 0.5;
                else
                    opacity = 0;
                //specify dimensions of horizontal line and make visible
                hoverLine1
                    .attr("x1", svgPadding) // Start position moved left
                    .attr("x2", s_width + svgPadding)
                    .attr("y1", cirY)
                    .attr("y2", cirY)
                    .style("opacity", opacity);
                cirY = scaleY(event.Measles);
                if (event.Measles)
                    opacity = 0.5;
                else
                    opacity = 0;
                hoverLine2
                    .attr("x1", svgPadding) // Start position moved left
                    .attr("x2", s_width + svgPadding)
                    .attr("y1", cirY)
                    .attr("y2", cirY)
                    .style("opacity", opacity);

                if (event.dtp&&event.Measles){if (event.dtp<event.Measles)cirY = scaleY(event.dtp); else cirY = scaleY(event.Measles);} 
                else {if (event.dtp) cirY = scaleY(event.dtp); else cirY = scaleY(event.Measles);}

                vertline2
                    .attr("x1", cirX)
                    .attr("x2", cirX)
                    .attr("y1", cirY)
                    .attr("y2", s_height)
                    .style("opacity", 0.5);

                hiddenCVPill.style.opacity = 1;
                hiddenCVCountry.innerText = event.Category;
                hiddenCVDis.innerText = "Diptheria, Tetanus, and Pertussis";
                hiddenCVPerc.innerText = event.dtp;
            })
            .on("mouseout", function (event, d) {
                hoverLine1.style("opacity", 0);
                hoverLine2.style("opacity", 0);
                vertline2.style("opacity", 0);
                hiddenCVPill.style.opacity = 0;
            });
        
            //vacc-rate-measles-dots
        let circ2 = svg1.selectAll("measles").data(data).enter()
            .append("svg:image")
            .attr("class", "measles")
            .attr("visibility", function(d){if (d.Measles) return "visible"; else return "hidden";}) //hide dot if value doesn't exist
            .attr("xlink:href", '../assign3/assets/figma-svgs/measles.svg')
            .attr("width", 10)
            .attr("height", 10)
            .attr("x", function(d){return scaleX(d.Category)-5;})
            .attr("y", function(d){if(d.Measles) return scaleY(d.Measles)-5; else return s_height})
            //mouseover effects for line
            .on("mouseover", function(event, d) {
                var cirY = scaleY(event.dtp);
                var cirX = scaleX(event.Category);
                var opacity = 0;
                if (event.dtp)
                    opacity = 0.5;
                else
                    opacity = 0;
                //specify dimensions of horizontal line and make visible
                hoverLine1
                    .attr("x1", svgPadding) // Start position moved left
                    .attr("x2", s_width + svgPadding)
                    .attr("y1", cirY)
                    .attr("y2", cirY)
                    .style("opacity", opacity);
                cirY = scaleY(event.Measles);
                if (event.Measles)
                    opacity = 0.5;
                else
                    opacity = 0;
                hoverLine2
                    .attr("x1", svgPadding) // Start position moved left
                    .attr("x2", s_width + svgPadding)
                    .attr("y1", cirY)
                    .attr("y2", cirY)
                    .style("opacity", opacity);
                    
                if (event.dtp&&event.Measles){if (event.dtp<event.Measles)cirY = scaleY(event.dtp); else cirY = scaleY(event.Measles);} 
                else {if (event.dtp) cirY = scaleY(event.dtp); else cirY = scaleY(event.Measles);}

                vertline2
                    .attr("x1", cirX)
                    .attr("x2", cirX)
                    .attr("y1", cirY)
                    .attr("y2", s_height)
                    .style("opacity", 0.5);
                
                hiddenCVPill.style.opacity = 1;
                hiddenCVCountry.innerText = event.Category;
                hiddenCVDis.innerText = "Measles"
                hiddenCVPerc.innerText = event.Measles;
            })
            .on("mouseout", function (event, d) {
                hoverLine1.style("opacity", 0);
                hoverLine2.style("opacity", 0);
                vertline2.style("opacity", 0);
                hiddenCVPill.style.opacity = 0;
            });


        //axis lines
        svg1.append("g")
            .attr("class", "cv-x-axis")
            .attr("transform", `translate(-10, ${s_height+2})`).style("font-size", "14px")
            .call(xAxis)
                .selectAll("text")
                .style("text-anchor", "end")
                .attr("transform", "rotate(-65)");


        svg1.append("g")
            .call(yAxis)
            .attr("class", "axis y-axis")
            .attr("transform", `translate(${svgPadding},  0)`).style("font-size", "14px");

        svg1.append("line")
            .attr("x1", svgPadding)
            .attr("x2", s_width)
            .attr("y1", s_height)
            .attr("y2", s_height)
            .attr("stroke", "#000000")
            .attr("stroke-width", 7.5);
    }

    function generateSvgDataChld2(data){
        //svg update after filtering

        let hoverLine1 = svg1.select("#CVhighlight1")
            .attr("x1", 0)
            .attr("x2", s_width)
            .attr("y1", s_height)
            .attr("y2", s_height)
            .style("opacity", 0);

        let hoverLine2 = svg1.select("#CVhighlight2")
            .attr("x1", 0)
            .attr("x2", s_width)
            .attr("y1", s_height)
            .attr("y2", s_height)
            .style("opacity", 0);

        let vertline2 = svg1.select("#vertline2")
            .attr("x1", 0)
            .attr("x2", 0)
            .attr("y1", s_height)
            .attr("y2", 0)
            .style("opacity", 0);

        var scaleX = d3.scalePoint() 
            .domain(data.map(function(d){return d.Category;}))
            .range([svgPadding+10, s_width]);
        var scaleY = d3.scaleLinear()
            .domain([0, 110])
            .range([s_height, 0]);

        var lines = svg1.selectAll(".vertline")
            .data(data)
            .attr("visibility", function(d){if (d.Measles&&d.dtp) return "visible"; else return "hidden";});
        lines.exit()
            .transition()
            .duration(500)
            .ease(d3.easeCircleOut)
            .attr("y1", s_height)
            .attr("y2", s_height)
            .remove()
        lines.enter()
            .append("line")
            .attr("class", "vertline")
            .attr("visibility", function(d){if (d.Measles&&d.dtp) return "visibile"; else return "hidden";})
            .attr("x1", function(d){return scaleX(d.Category);})
            .attr("x2", function(d){return scaleX(d.Category);})
            .attr("y1", s_height)
            .attr("y2", s_height)
            .attr("fill", "#758bfd")
            .attr("stroke", "#758bfd")
            .merge(lines)
            .transition()
            .duration(500)
            .ease(d3.easeCircleOut)
            .attr("y1", function(d){if (d.dtp) return scaleY(d.dtp); else return 0;})
            .attr("y2", function(d){if (d.Measles) return scaleY(d.Measles); else return 0;})
            .attr("x1", function(d){return scaleX(d.Category);})
            .attr("x2", function(d){return scaleX(d.Category);});

        var dtp = svg1.selectAll(".dtp")
                        .data(data)
                        .attr("visibility", function(d){if (d.dtp) return "visible"; else return "hidden";});
        dtp.exit() //removing element
            .transition() //transition new and old data
            .duration(500) 
            .ease(d3.easeCircleOut)
            .attr("y", s_height)
            .remove()

        dtp.enter()
            .append("svg:image")
            .attr("class", "dtp")
            .attr("visibility", function(d){if (d.dtp) return "visible"; else return "hidden";}) //hide dot if value doesn't exist
            .attr("xlink:href", '../assign3/assets/figma-svgs/diptheria.svg')
            .attr("width", 10)
            .attr("height", 10)
            .attr("x", function(d){return scaleX(d.Category)-5;})
            .attr("y", s_height)
            .merge(dtp)
            .transition()
            .duration(500)
            .ease(d3.easeCircleOut)
            .attr("y", function(d){return scaleY(d.dtp)-5;})
            .attr("x", function(d){return scaleX(d.Category)-5;});

        dtp = svg1.selectAll(".dtp");

        dtp.on("mouseover", function(event, d) {
            var cirY = scaleY(event.dtp);
            var cirX = scaleX(event.Category);
            var opacity = 0;
            if (event.dtp)
                opacity = 0.5;
            else
                opacity = 0;
            //specify dimensions of horizontal line and make visible
            hoverLine1
                .attr("x1", svgPadding) // Start position moved left
                .attr("x2", s_width + svgPadding)
                .attr("y1", cirY)
                .attr("y2", cirY)
                .style("opacity", opacity);
            cirY = scaleY(event.Measles);
            if (event.Measles)
                opacity = 0.5;
            else
                opacity = 0;
            hoverLine2
                .attr("x1", svgPadding) // Start position moved left
                .attr("x2", s_width + svgPadding)
                .attr("y1", cirY)
                .attr("y2", cirY)
                .style("opacity", opacity);

            if (event.dtp&&event.Measles){if (event.dtp<event.Measles)cirY = scaleY(event.dtp); else cirY = scaleY(event.Measles);} 
            else {if (event.dtp) cirY = scaleY(event.dtp); else cirY = scaleY(event.Measles);}

            vertline2
                .attr("x1", cirX)
                .attr("x2", cirX)
                .attr("y1", cirY)
                .attr("y2", s_height)
                .style("opacity", 0.5);

            hiddenCVPill.style.opacity = 1;
            hiddenCVCountry.innerText = event.Category;
            hiddenCVDis.innerText = "Diptheria, Tetanus, and Pertussis";
            hiddenCVPerc.innerText = event.dtp;
        })
        .on("mouseout", function (event, d) {
                hoverLine1.style("opacity", 0);
                hoverLine2.style("opacity", 0);
                vertline2.style("opacity", 0);
                hiddenCVPill.style.opacity = 0;
        });

        var measles = svg1.selectAll(".measles")
                        .data(data)
                        .attr("visibility", function(d){if (d.Measles) return "visible"; else return "hidden";});
                        
        measles.exit() //removing element
            .transition() //transition new and old data
            .duration(500) 
            .ease(d3.easeCircleOut)
            .attr("y", s_height)
            .remove();

        measles.enter()
            .append("svg:image")
            .attr("class", "measles")
            .attr("visibility", function(d){if (d.Measles) return "visible"; else return "hidden";}) //hide dot if value doesn't exist
            .attr("xlink:href", '../assign3/assets/figma-svgs/measles.svg')
            .attr("width", 10)
            .attr("height", 10)
            .attr("x", function(d){return scaleX(d.Category)-5;})
            .attr("y", s_height)
            .merge(measles)
            .transition()
            .duration(500)
            .ease(d3.easeCircleOut)
            .attr("y", function(d){if (d.Measles) return scaleY(d.Measles)-5; else return s_height;})
            .attr("x", function(d){return scaleX(d.Category)-5;});

        measles = svg1.selectAll(".measles");

        measles.on("mouseover", function(event, d) {
            var cirY = scaleY(event.dtp);
            var cirX = scaleX(event.Category);
            var opacity = 0;
            if (event.dtp)
                opacity = 0.5;
            else
                opacity = 0;
            //specify dimensions of horizontal line and make visible
            hoverLine1
                .attr("x1", svgPadding) // Start position moved left
                .attr("x2", s_width + svgPadding)
                .attr("y1", cirY)
                .attr("y2", cirY)
                .style("opacity", opacity);
            cirY = scaleY(event.Measles);
            if (event.Measles)
                opacity = 0.5;
            else
                opacity = 0;
            hoverLine2
                .attr("x1", svgPadding) // Start position moved left
                .attr("x2", s_width + svgPadding)
                .attr("y1", cirY)
                .attr("y2", cirY)
                .style("opacity", opacity);

            if (event.dtp&&event.Measles){if (event.dtp<event.Measles)cirY = scaleY(event.dtp); else cirY = scaleY(event.Measles);} 
            else {if (event.dtp) cirY = scaleY(event.dtp); else cirY = scaleY(event.Measles);}

            vertline2
                .attr("x1", cirX)
                .attr("x2", cirX)
                .attr("y1", cirY)
                .attr("y2", s_height)
                .style("opacity", 0.5);

            hiddenCVPill.style.opacity = 1;
            hiddenCVCountry.innerText = event.Category;
            hiddenCVDis.innerText = "Measles";
            hiddenCVPerc.innerText = event.Measles;
        })
        .on("mouseout", function (event, d) {
            hoverLine1.style("opacity", 0);
            hoverLine2.style("opacity", 0);
            vertline2.style("opacity", 0);
            hiddenCVPill.style.opacity = 0;
        });

        
        var gx = svg1.select(".cv-x-axis")
        gx.transition()
            .duration(500)
            .ease(d3.easeCircleOut)
            .call(d3.axisBottom(scaleX).tickSize(0))
            .selectAll("text")
                .style("text-anchor", "end")
                .attr("transform", "rotate(-65)");

    }


    function getSelectedCountries(id) {
        let selectedCountries = [];
        const countryOptions = Array.from(getFieldOptions(id))
        for (let opt in countryOptions) {
            if (countryOptions[opt].selected === true) {
                selectedCountries.push(countryOptions[opt].value);
            }
        }
        return selectedCountries;
    }

    d3.select("#a-c-year").on("change", function() {
        const yearSelected = this.value;
        if (yearSelected !== "") {
            //update available country options per year change via csv file options:
            let countryOptions = [];
            d3.csv(`../assign3/DV_CSVs/Alcohol Consumption/AC_${this.value}.csv`).then(data => {
                return data.map((d) => d.country);
            }).then((d) => {
                countryOptions = [...d];
                //Change available country options and reset any selected
                changeAvailAlcCountryOptions(countryOptions);
            }).then(() => {
                //Set default country options selected to first couple
                setAlcCountryOptions();
            }).then(() => {
                //Change data visualisation with new selected values / filtered data
                //get selected country values
                const selectedCountries = getSelectedCountries("a-c-countries");
                filterData(selectedCountries, yearSelected).then((data) => {
                    generateSvgDataAlc(data)
                })
            })
        }
    });

    function filterData(countries, year) {
        //get data from csv file which matches year and country filters.
        //this could be refactored for other visualisations
        // Apply year filter then further filter data for selected countries:
        //todo: replace when in mercury
        //    d3.csv(`../assign3/DV_CSVs/Alcohol Consumption/AC_2023.csv`).then(data => {
        return d3.csv(`../assign3/DV_CSVs/Alcohol Consumption/AC_${year}.csv`).then(data => {
            // Apply country filters: only keep data that has the selected countries
            return data.filter(dp => [...countries].includes(dp.country)); // Return the filtered data
        });
    }

    //this could be refactored to work for the other visualisation if needed
    function changeAvailAlcCountryOptions(countryOptions) {
        if (countryOptions) {
            let select = document.querySelector('#a-c-countries');
            select.innerHTML = '';
            select.value = '';
            countryOptions.forEach((opt) => {
                const newOpt = document.createElement('option');
                newOpt.text = opt;
                newOpt.value = opt;
                select.appendChild(newOpt)
            })
        }
    }
    function setAlcCountryOptions() {
        //Get first 5 data items from country options to use
        let fieldOptions = getFieldOptions("a-c-countries")
        for (let i=0, l= fieldOptions.length; i<l; i++) {
            //This will set default selected values for new options. It will use the first couple
            fieldOptions[i].selected = i < 5;
        }
    }

    function getFieldOptions(id) {
        const field = document.getElementById(id)
        return field ? field.options : null;
    }


    d3.select("#a-c-countries").on("change", function() {
        //get selected country values
        const selectedCountries = getSelectedCountries("a-c-countries");
        //when options are changed update dv:
        if (selectedCountries) {
            //update dv with filtered data
            //get selected year - will always be one value
            const selectedYear = document.getElementById("a-c-year").value
            filterData(selectedCountries, selectedYear).then((data) => {
                generateSvgDataAlc(data)
            })
        }
    });

    function filterDataVacc(countries, year) {
        //get data from csv file which matches year and country filters.
        //this could be refactored for other visualisations
        // Apply year filter then further filter data for selected countries:
        //todo: replace when in mercury
        //    d3.csv(`../assign3/DV_CSVs/Alcohol Consumption/AC_2023.csv`).then(data => {
        // let sdata = [];
        return d3.csv(`../assign3/DV_CSVs/Child Vaccination/CV_${year}.csv`).then(data => {
            // Apply country filters: only keep data that has the selected countries
            return data.filter(dp => [...countries].includes(dp.Category)); // Return the filtered data
        });
    }

    d3.select("#c-v-c-year").on("change", function() {
        const yearSelected = this.value;
        if (yearSelected != "") {
            //update available country options per year change via csv file options:
            let countryOptions = [];
            d3.csv(`../assign3/DV_CSVs/Child Vaccination/CV_${this.value}.csv`).then(data => {
                return data.map((d) => d.Category);
            }).then((d) => {
                countryOptions = [...d];
                //Change available country options and reset any selected
                changeAvailVaccCountryOptions(countryOptions);
            }).then(() => {
                //Set default country options selected to first couple
                setVaccCountryOptions();
            }).then(() => {
                //Change data visualisation with new selected values / filtered data
                //get selected country values
                const selectedCountries = getSelectedCountries("c-v-c-countries");
                filterDataVacc(selectedCountries, yearSelected).then((data) => {
                    generateSvgDataChld2(data)
                })
            })
        }
    });

    //this could be refactored to work for the other visualisation if needed
    function changeAvailVaccCountryOptions(countryOptions) {
        if (countryOptions) {
            let select = document.querySelector('#c-v-c-countries');
            select.innerHTML = '';
            select.value = '';
            countryOptions.forEach((opt) => {
                const newOpt = document.createElement('option');
                newOpt.text = opt;
                newOpt.value = opt;
                select.appendChild(newOpt)
            })
        }
    }
    function setVaccCountryOptions() {
        //Get first 5 data items from country options to use
        let fieldOptions = getFieldOptions("c-v-c-countries")
        for (let i=0, l= fieldOptions.length; i<l; i++) {
            //This will set default selected values for new options. It will use the first couple
            fieldOptions[i].selected = i < 5;
        }
    }

    d3.select("#c-v-c-countries").on("change", function() {
        //get selected country values
        const selectedCountries = getSelectedCountries("c-v-c-countries");
        //when options are changed update dv:
        if (selectedCountries) {
            //update dv with filtered data
            //get selected year - will always be one value
            const selectedYear = document.getElementById("c-v-c-year").value
            filterDataVacc(selectedCountries, selectedYear).then((data) => {
                generateSvgDataChld2(data)
            })
        }
    });



    //default value used here - todo: change paths
    //    d3.csv(`../assign3/DV_CSVs/Alcohol Consumption/AC_2023.csv`).then(data => {
    d3.csv(`../assign3/DV_CSVs/Alcohol Consumption/AC_2023.csv`).then(data => {
        generateSvgDataAlc(data)
    });

    //    d3.csv(`../assign3/DV_CSVs/Child Vaccination/CV_2022.csv`).then(data => {
    d3.csv('../assign3/DV_CSVs/Child Vaccination/CV_2023.csv').then(function(data){
        let countries = data.map(function(d){return d.Category});
        let countryOptions = [...countries];
        changeAvailVaccCountryOptions(countryOptions);
        generateSvgDataChld(data)
    })

}


window.onload = init;