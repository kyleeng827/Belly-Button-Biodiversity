function buildMetadata(sample) {


  // @TODO: Complete the following function that builds the metadata panel
  // Use `d3.json` to fetch the metadata for a sample
  d3.json(`/metadata/${sample}`).then(data => {
    // Use d3 to select the panel with id of `#sample-metadata`
    metadata = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    metadata.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    Object.entries(data).forEach(([key,value]) => {
      metadata.append('h6').text(`${key}: ${value}`);
    });
  });
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
};

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then(data => {
    // Create variables for data to be plotted
    const sample_values = data.sample_values;
    const otu_ids = data.otu_ids;
    const otu_labels = data.otu_labels;

    // Create trace for pie chart
    var pietrace = {
      values: sample_values.slice(0,10),
      labels: otu_labels.slice(0,10),
      type: "pie",
      hovertext: otu_labels.slice(0,10),
      hoverinfo: "hovertext"
    };

    // Format pie chart
    var pielayout = {
      margin:{t:0}
    };

    // Set data to trace
    var piedata = [pietrace];

    // Plot
    Plotly.newPlot("pie", piedata, pielayout);

    // Same steps as above, except for bubble chart
    var bubbletrace = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        size: sample_values,
        color: otu_ids,
      }
    };
    var bubblelayout = {
      margin: {t: 0},
      xaxis: {title: "OTU ID"}
    };

    var bubbledata = [bubbletrace];
    Plotly.newPlot("bubble", bubbledata, bubblelayout); 
  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
