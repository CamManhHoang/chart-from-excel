/* CREATE SKELETON CHART JS */
let ctx = document.getElementById('my-chart');
let bubbleData = {
  datasets: [],
};
window.options = {
  scales: {
    yAxes: [
      {
        scaleLabel: {
          display: true,
          labelString: 'Yield',
        },
        ticks: {
          max: 6,
          min: 2.8,
          stepSize: 0.2,
        },
      }],
    xAxes: [
      {
        scaleLabel: {
          display: true,
          labelString: 'Year To Mature',
        },
        ticks: {
          max: 8,
          min: 0,
          stepSize: 1,
        },
      },
    ],
  },
  tooltips: {
    backgroundColor: '#ffffff',
    callbacks: {
      label: function(tooltipItem, data) {
        return data.labels[tooltipItem.index];
      },
      labelTextColor: function(tooltipItem, chart) {
        return '#000000';
      },
    },
  },
  legend: {
    display: false,
  },
  pan: {
    enabled: true,
    mode: 'xy',
  },
  zoom: {
    enabled: true,
    mode: 'xy',
  },
  plugins: {
    datalabels: {
      formatter: function() {
        return null;
      },
    },
  },
};

window.myChart = new Chart(ctx, {
  type: 'bubble',
  data: bubbleData,
  options: options,
});

/* UPLOAD EXCEL FILE AND HANDLE IT */
var XLSX = require('xlsx');
var rABS = false; // true: readAsBinaryString ; false: readAsArrayBuffer

function handleFile(e) {
  showLoading();
  var files = e.target.files, f = files[0];
  var reader = new FileReader();
  reader.onload = function(e) {
    var data = e.target.result;
    if (!rABS) data = new Uint8Array(data);

    var arr = new Array();
    for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(
        data[i]);
    var bstr = arr.join('');

    /* Call XLSX */
    var workbook = XLSX.read(bstr, {type: 'binary'});

    /* DO SOMETHING WITH workbook HERE */
    var first_sheet_name = workbook.SheetNames[3];
    /* Get worksheet */
    var worksheet = workbook.Sheets[first_sheet_name];

    var excelData = XLSX.utils.sheet_to_json(worksheet, {raw: true, range: 13});

    var names = [];
    var positions = [];

    excelData.forEach(function(element) {
      names.push(element.Name);
      positions.push({
        x: roundToTwo(element['Yrs to Mat']),
        y: roundToTwo(element['Blended YTM']),
        r: 5,
      });
    });

    /* Un-hidden show-label form */
    document.getElementById('checkbox').style.visibility = 'visible';

    /* Update Chart with new data from excel */
    const newDataset = {
      label: 'Data',
      data: positions,
      backgroundColor: '#03DAC6',
    };
    bubbleData.datasets.push(newDataset);
    bubbleData.labels = names;
    myChart.update();
    hideLoading();
  };
  if (rABS) reader.readAsBinaryString(f); else reader.readAsArrayBuffer(f);
}

document.getElementById('upload').addEventListener('change', handleFile, false);

function roundToTwo(num) {
  return +(Math.round(num + 'e+2') + 'e-2');
}

function resetZoom() {
  window.myChart.resetZoom();
}

function showLabel() {
  if (document.getElementById('show-label').checked) {
    window.options.plugins = {
      datalabels: {
        formatter: function(value, context) {
          return context.chart.data.labels[context.dataIndex];
        },
      },
    };
    myChart.options = options;
    myChart.update();
  } else {
    window.options.plugins = {
      datalabels: {
        formatter: function() {
          return null;
        },
      },
    };
    myChart.options = options;
    myChart.update();
  }
}

function showLoading() {
  document.getElementById('curtain').style.display = 'block';
}

function hideLoading() {
  document.getElementById('curtain').style.display = 'none';
}