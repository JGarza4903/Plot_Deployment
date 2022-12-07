function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples & metadata array. 
    var samplesArray = data.samples;
    var metaArray = data.metadata;
    
    // 4. Create a variable that filters the samples for the object with the desired sample number and 
    // holds the first sample in the array.
    var firstSample = samplesArray.filter(sampleObj => sampleObj.id == sample)[0];
    var firstMeta = metaArray.filter(sampleObj => sampleObj.id == sample)[0];
    
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuID = firstSample.otu_ids;
    var otuLabels = firstSample.otu_labels;
    var samplesValue = firstSample.sample_values;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var yticks = otuID.slice(0,10).reverse().map(x=>"OTU "+x +" ");

    ////// BAR CHART ///////////////////

    // 8. Create the trace for the bar chart. 
    var barData = [{
      type: "bar",
      x: samplesValue.slice(0,10).reverse(),
      y: yticks,
      text: otuLabels.slice(0,10).reverse(),
      orientation: "h"
    }];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "<b>Top Ten Bacteria Cultures Found</b>",
      xaxis: samplesValue,
      yaxis: otuLabels
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    /////// BUBBLE CHART ////////////////

     // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otuID,
      y: samplesValue,
      text: otuLabels,
      mode: "markers",
      marker: {
        color: otuID,
        size: samplesValue,
        colorscale: "Earth"}
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {title: "OTU ID"}
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

////////   GAUGE CHART   ////////////////

    //Create a variable that holds the washing frequency.
    var wfreqeuncy = firstMeta.wfreq;

    //create trace for gauge
    var gaugeData = [
      {
        type: "indicator", 
        mode: "gauge+number",
        value: wfreqeuncy,
        title: { text: "<b>Belly Button Washing Frequency</b> <br>Scrubs per Week", color: "black", font: {size: 24}},
        delta: { reference: 10, increasing: { color: "black"}},
        gauge: {
          axis: { range: [null, 10], tickwidth: 1, tickcolor: "black"},
          bar: {color: "black"},
          bgcolor: "black",
          borderwidth: 2,
          bordercolor: "black",
          steps: [
            { range: [0, 2], color: "red"},
            { range: [2, 4], color: "orange"},
            { range: [4, 6], color: "yellow"},
            { range: [6, 8], color: "lightgreen"},
            { range: [8, 10], color: "green"}
          ],
          threshold: {
            line: { color: "red", width: 4},
            thickness: 0.75,
            value: 10
          }
        }
      }
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = {
      width: 600, 
      height: 500, 
      margin: {t: 25, r: 25, l:25, b: 25},
      paper_bgcolor: "white",
      font: {color: "black", family: "Arial"}
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);
  });
}
