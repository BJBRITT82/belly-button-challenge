// Create url variable
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
// Read samples.json from url
d3.json(url).then(function (data) {
    console.log(data);
});

// orientation: "h";
// let resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
// Initialize charts and data
function init() {
    // Select dropdown menu
    let dropdownMenu = d3.select("#selDataset");
    // Get sample names and populate dropdown
    d3.json(url).then((data) => {
        // Set variable for names
        let names = data.names;
        // Add options to dropdown menue
        names.forEach((id) => {
            // console.log(id);
            dropdownMenu.append("option").text(id).property("value", id);
        });
        // Set first sample in the list 
        let sample_one = names[0];
        // console.log(sample_one);
        // Build initial plot
        MetaData(sample_one);
        BarChart(sample_one);
        BubbleChart(sample_one);
        GaugeChart(sample_one);
    });
};

// Create function to change horizontal chart
function BarChart(sample) {
    // Retrieve all data
    d3.json(url).then((data) =>{
        // Retrieve all sample data
        let sampleData = data.samples;
        // console.log(sampleData);
        // Filter sample data array
        let sampleArray = sampleData.filter(result => result.id == sample);
        // Set first index
        let firstSample = sampleArray[0];
        // Get otu_id, sample_value, and otu_label
        let otu_id = firstSample.otu_ids;
        let sample_value = firstSample.sample_values;
        let otu_label = firstSample.otu_labels;
        // log data
        // console.log(otu_id, sample_value, otu_label);
        // Set top 10 items for bar chart
        let yticks = otu_id.slice(0,10).map(id=>`OTU ${id}`).reverse();
        let xticks = sample_value.slice(0,10).reverse();
        let labels = otu_label.slice(0,10).reverse();

        // Set chart trace
        let trace1 = {
            x: xticks,
            y: yticks,
            text: labels,
            type: "bar",
            orientation: "h"
        };

        // Set layout
        let layout = {
            title: "Top 10 OTUs"
        };

        Plotly.newPlot("bar", [trace1], layout)

    });
};
// Create function to change bubble chart
function BubbleChart(sample) {
    // Retrieve all data
    d3.json(url).then((data) =>{
        // Retrieve all sample data
        let sampleData = data.samples;
        // console.log(sampleData);
        // Filter sample data array
        let sampleArray = sampleData.filter(result => result.id == sample);
        // Set first index
        let firstSample = sampleArray[0];
        // Get otu_id, sample_value, and otu_label
        let otu_id = firstSample.otu_ids;
        let sample_value = firstSample.sample_values;
        let otu_label = firstSample.otu_labels;
        // log data
        // console.log(otu_id, sample_value, otu_label);

        // Set bubble chart trace
        let trace2 = {
            x: otu_id,
            y: sample_value,
            text: otu_label,
            mode: "markers",
            marker: {
                size: sample_value,
                color: otu_id,
                colorscale: "Picnic"
            }
        };

        // Set layout
        let layout = {
            title: "OTU Per Sample",
            hovermode: "closest",
            xaxis: {title: "OTU ID"}
        };

        Plotly.newPlot("bubble", [trace2], layout)

    });
};
// Create function to change MetaData
function MetaData(sample){
    // Retrieve all data
    d3.json(url).then((data) =>{
        // Retrieve all sample data
        let metadata = data.metadata;
        // console.log(metadata);
        // Filter sample data array
        let dataArray = metadata.filter(result => result.id == sample);
        // Set first index
        let firstData = dataArray[0];
        // Clear MetaData
        d3.select("#sample-metadata").html("");
        // Add key/value pairs to panel
        Object.entries(firstData).forEach(([key,value]) => {
            // console.log(key,value);
            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });

        
    });
};
// Create function to change gauge chart
function GaugeChart(sample) {
    // Retrieve all data
    d3.json(url).then((data) =>{
        // Retrieve all sample data
        let metadata = data.metadata;
        // Filter sample data array
        let dataArray = metadata.filter(result => result.id == sample);
        // Set first index
        let firstData = dataArray[0];
        // Set variable for wash frequency (wfreq)
        let washFrequency = Object.values(firstData)[6];

        // Set gauge trace
        let trace3 = {
            domain: { x: [0, 1], y: [0, 1] },
            value: washFrequency,
            title: "Belly Button Washes Per Week",
            type: "indicator",
            mode: "gauge+number",
            gauge: {
                axis: {range: [0,10], tickmode: "linear", tick0: 2, dtick: 2},
                bar: {color: "darkblue"},
                bgcolor: "white",
                borderwidth: 2,
                bordercolor: "gray",
                steps: [
                    {range: [0, 1], color: "rgb(255, 255, 0)"},
                    {range: [1, 2], color: "rgb(255, 217, 0)"},
                    {range: [2, 3], color: "rgb(255, 173, 0)"},
                    {range: [3, 4], color: "rgb(255, 120, 0)"},
                    {range: [4, 5], color: "rgb(255, 33, 60)"},
                    {range: [5, 6], color: "rgb(255, 0, 99)"},
                    {range: [6, 7], color: "rgb(255, 0, 139)"},
                    {range: [7, 8], color: "rgb(253, 0, 182)"},
                    {range: [8, 9], color: "rgb(185, 0, 222)"},
                    {range: [9, 10], color: "rgb(0, 0, 255)"},
                ]
            }
        };

        
          
        let layout = {
            width: 400, 
            height: 400, 
            margin: { t: 0, b: 0 } 
        };

        Plotly.newPlot("gauge", [trace3], layout)

    });
};
// Update all charts when new data is selected
function optionChanged(value) {
    // console.log(value);

    // Call all functions
    MetaData(value);
    BarChart(value);
    BubbleChart(value);
    GaugeChart(value);
}
//
init();