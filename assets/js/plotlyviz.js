---
---
var myData = ("https://raw.githubusercontent.com/mgfogerson/plotly_bacteriaChart/main/Code/samples.json");

console.log(myData)

//create function for first chart
function init(){
    // empty objects to store variables for later
    d3.json(myData, function(data) {
        console.log(data);
        dataObject = {
        sampleValues : [],
        otuId : [],
        otuLabel : [],
        age: [],
        bbtype: [],
        ethnicity: [],
        gender: [],
        id: [],
        location: [],
        wfreq: []
       }
        //sample values split between id's. Push to arrays in object for plot.
        for (var x in data.samples) {
            dataObject.sampleValues.push(data.samples[x].sample_values);
            // console.log(sampleValues);
            dataObject.otuId.push(data.samples[x].otu_ids);
            // console.log(otuId);
            dataObject.otuLabel.push(data.samples[x].otu_labels);
            // console.log(sampleValues);
        }
        for (var x in data.metadata){
            dataObject.age.push(data.metadata[x].age);
            dataObject.bbtype.push(data.metadata[x].bbtype);
            dataObject.ethnicity.push(data.metadata[x].ethnicity);
            dataObject.gender.push(data.metadata[x].gender);
            dataObject.id.push(data.metadata[x].id);
            dataObject.location.push(data.metadata[x].location);
            dataObject.wfreq.push(data.metadata[x].wfreq);
        }
        // console.log(dataObject);
        //populate selector
        var N = (dataObject.sampleValues.length)
        options = []
        for (var i = 0; i <= N; i++) {
            options.push(i);
        }
        var select = document.getElementById("selDataset"); 
        for(var i = 0; i < options.length; i++) {
            var opt = options[i];
            var el = document.createElement("option");
            el.textContent = opt;
            el.value = opt;
            select.appendChild(el);
        }
        // bar trace
        var Trace1 = [
            {
                x: dataObject.sampleValues[0].slice(0, 10),
                y: dataObject.otuId[0].slice(0, 10),
                type: 'bar',
                orientation: 'h',
                text: dataObject.otuLabel[0].slice(0, 10)
            }
        ];
        var layout = {
            font: { color: "white", family: "Arial"},
            title: 'Top 10 OTUs For Individual',
            xaxis: {
                title:{
                    text: 'OTU Sample Value'
                }
            },
            yaxis:{
                type: 'category',
                title:{
                    text:'OTU ID Number'
                }
            },
            paper_bgcolor:"rgba(134,134,134,0.5)"
        };
        // bubble trace
        var trace2=[
            {
            x: dataObject.otuId[0].slice(0, 10),
            y: dataObject.sampleValues[0].slice(0, 10),
            text: dataObject.otuLabel[0].slice(0, 10),
            mode: 'markers',
            marker: {
                size: dataObject.sampleValues[0].slice(0, 10),
                color: dataObject.otuId[0].slice(0, 10),
            },
        }
        ];
        var newLayout2 = {
            font: { color: "white", family: "Arial"},
            title: {text: 'Hover to show OTU type'}, 
            xaxis: {
                title:{
                    text: 'OTU ID Numbers'
                }
            },
            yaxis:{
                title:{
                    text:'OTU Sample Value'
                }
            },
            paper_bgcolor:"rgba(134,134,134,0.5)"
        };
        //gauge trace
        var gaugetrace = [
            {
              type: "indicator",
              mode: "gauge+number",
              value: dataObject.wfreq[0],
              title: { text: "Washing Frequency", font: { size: 20, color:"white" } },
              gauge: {
                axis: { range: [null, 9], tickwidth: 1, tickcolor: "darkblue" },
                bar: { color: "white" },
                borderwidth: 3,
                bordercolor: "#003366",
                steps: [
                  { range: [0, 9], color: "#52ab98"}
                ],
              }
            }
          ];

        //   Gauge Layout
          var gaugelayout={
            font: { color: "white", family: "Arial"},

            paper_bgcolor:"rgba(134,134,134,0.5)"
        }; 
        // Config
        var config = {responsive: true}
        // Drawing New Plots
        Plotly.newPlot("gauge", gaugetrace, gaugelayout, config)
        Plotly.newPlot("bubble", trace2, newLayout2, [0, 10],  config);
        Plotly.newPlot('bar', Trace1, layout, [0, 10], config);
        var agestring = dataObject.age[0];
        var locationstring =  dataObject.location[0]
        var bbtypestring = dataObject.bbtype[0]
        var ethnicitystring = dataObject.ethnicity[0]
        var genderstring = dataObject.gender[0]
        var idstring = dataObject.id[0]
        var wfreqstring = dataObject.wfreq[0]
        // document.getElementById('sample-metadata').textContent = ('Age: \n' + agestring  + " Location: " + locationstring + " Bloodtype: " + bbtypestring + " Ethnicity: " + ethnicitystring + " Gender: " + genderstring + " ID: " + idstring + " Washing/Week: " + wfreqstring) 
        document.getElementById('ageinfo').textContent += (' ' + agestring)  
        document.getElementById('locationinfo').textContent += (' ' + locationstring)        
        document.getElementById('bbtypeinfo').textContent += (' ' + bbtypestring)        
        document.getElementById('ethnicityinfo').textContent += (' ' + ethnicitystring)        
        document.getElementById('genderinfo').textContent += (' ' + genderstring)        
        document.getElementById('idinfo').textContent += (' ' + idstring) 
        document.getElementById('wfreqinfo').textContent += (' ' + wfreqstring) 


       
    });
};
const dataPromise = d3.json("https://raw.githubusercontent.com/mgfogerson/plotly_bacteriaChart/main/Code/samples.json");

console.log("Data Promise: ", dataPromise);
// On change to the DOM, call getData()
d3.selectAll("#selDataset").on("change", getData);
// Function called by DOM changes
function getData() {
    var dropdownMenu = d3.select("#selDataset");
    // Assign the value of the dropdown menu option to a variable
    var dataset = dropdownMenu.property("value");
    // Initialize an empty object for the data being selected
    var datasetObject = {
        sampleValues : [],
        otuId : [],
        otuLabel : [],
        age: [],
        bbtype: [],
        ethnicity: [],
        gender: [],
        id: [],
        location: [],
        wfreq: []
        }
        d3.json(myData, function(data) {
            for (var x in data.samples){
                if (dataset == x){
                    // console.log("did it")
                    datasetObject.sampleValues.push(data.samples[x].sample_values.slice(0, 10));
                    datasetObject.otuId.push(data.samples[x].otu_ids.slice(0, 10));
                    datasetObject.otuLabel.push(data.samples[x].otu_labels.slice(0, 10));
                    datasetObject.age.push(data.metadata[x].age);
                    datasetObject.bbtype.push(data.metadata[x].bbtype);
                    datasetObject.ethnicity.push(data.metadata[x].ethnicity);
                    datasetObject.gender.push(data.metadata[x].gender);
                    datasetObject.id.push(data.metadata[x].id);
                    datasetObject.location.push(data.metadata[x].location);
                    datasetObject.wfreq.push(data.metadata[x].wfreq);


                    // console.log(datasetObject)
                    var newTrace = [
                        {
                            x: datasetObject.sampleValues[0].slice(0, 10),
                            y: datasetObject.otuId[0].slice(0, 10),
                            type: 'bar',
                            orientation: 'h',
                            text: datasetObject.otuLabel[0].slice(0, 10)
                        }
                    ];
                    newTrace2=[
                        {
                        x: datasetObject.otuId[0].slice(0, 10),
                        y: datasetObject.sampleValues[0].slice(0, 10),
                        text: datasetObject.otuLabel[0].slice(0, 10),
                        mode: 'markers',
                        marker: {
                            size: datasetObject.sampleValues[0].slice(0, 10),
                            color: datasetObject.otuId[0].slice(0, 10),
                        }
                        }];
                    var newLayout = {
                        font: { color: "white", family: "Arial"},
                        paper_bgcolor:"rgba(134,134,134,0.5)",

                        title: 'Top 10 OTUs For Individual',
                        xaxis: {
                            title:{
                                text: 'OTU Sample Value'
                            }
                        },
                        yaxis:{
                            type: 'category',
                            title:{
                                text:'OTU ID Number'
                            }
                        }
                    };
                    var newLayout2 = {
                        font: { color: "white", family: "Arial"},
                        title: 'Hover to show OTU type',
                        xaxis: {
                            title:{
                                text: 'OTU ID Numbers',
                                size:25
                            }
                        },
                        yaxis:{
                            title:{
                                text:'OTU Sample Value'
                            }
                        },
                        paper_bgcolor:"rgba(134,134,134,0.5)"
                    };
                    var newgaugetrace = [
                        {
                        font: { color: "white", family: "Arial"},
                          type: "indicator",
                          mode: "gauge+number+delta",
                          value: dataObject.wfreq[x],
                          title: { text: "Washing Frequency", font: { size: 24 } },
                          gauge: {
                            axis: { range: [null, 9], tickwidth: 1, tickcolor: "darkblue" },
                            bar: { color: "white" },
                            borderwidth: 3,
                            bordercolor: "#003366",
                            steps: [
                              { range: [0, 9], color: "#52ab98"}
                            ],
                          }
                        }
                      ];
                    var gaugelayout = { 
                        font: { color: "white", family: "Arial"},
                        paper_bgcolor:"rgba(134,134,134,0.5)"
                    }         

                      var config = {responsive: true}
                    Plotly.newPlot("gauge", newgaugetrace, gaugelayout, config)
                    Plotly.newPlot('bar', newTrace, newLayout, config);
                    Plotly.newPlot('bubble', newTrace2, newLayout2, config);
                    var agestring = dataObject.age[x];
                    var locationstring =  dataObject.location[x]
                    var bbtypestring = dataObject.bbtype[x]
                    var ethnicitystring = dataObject.ethnicity[x]
                    var genderstring = dataObject.gender[x]
                    var idstring = dataObject.id[x]
                    var wfreqstring = dataObject.wfreq[x]
                    // document.getElementById('sample-metadata').textContent = ('Age: ' + agestring + "\nLocation: " + locationstring + " Bloodtype: " + bbtypestring + " Ethnicity: " + ethnicitystring + " Gender: " + genderstring + " ID: " + idstring + " Washing/Week: " + wfreqstring)
                    document.getElementById('ageinfo').textContent = ('Age: ' + agestring)  
                    document.getElementById('locationinfo').textContent = ('Location: ' + locationstring)        
                    document.getElementById('bbtypeinfo').textContent = ('Blood Type: ' + bbtypestring)        
                    document.getElementById('ethnicityinfo').textContent = ('Ethnicity: ' + ethnicitystring)        
                    document.getElementById('genderinfo').textContent = ('Gender: ' + genderstring)        
                    document.getElementById('idinfo').textContent = ('ID: ' + idstring) 
                    document.getElementById('wfreqinfo').textContent = ('Washing Frequency: ' + wfreqstring)
                }
                }
        });
};
    
