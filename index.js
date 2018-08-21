var XLSX = require('xlsx');
var rABS = false; // true: readAsBinaryString ; false: readAsArrayBuffer

function handleFile(e) {
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

    let ctx = document.getElementById('my-chart');
    let bubbleData = {
      labels: names,
      datasets: [
        {
          label: 'Data',
          data: positions,
          backgroundColor: '#03DAC6',
        }],
    };
    let options = {
      scales: {
        yAxes: [
          {
            ticks: {
              max: 6,
              min: 2.8,
              stepSize: 0.2,
            },
          }],
        xAxes: [
          {
            ticks: {
              max: 8,
              min: 0,
              stepSize: 1,
            },
          }],
      },
      tooltips: {
        callbacks: {
          label: function(tooltipItem, data) {
            var label = data.labels[tooltipItem.index];
            return label + ': (' + tooltipItem.xLabel + ', ' +
                tooltipItem.yLabel + ')';
          },
        },
      },
    };
    let myChart = new Chart(ctx, {
      type: 'bubble',
      data: bubbleData,
      options: options,
    });
  };
  if (rABS) reader.readAsBinaryString(f); else reader.readAsArrayBuffer(f);
}

document.getElementById('upload').addEventListener('change', handleFile, false);

function roundToTwo(num) {
  return +(Math.round(num + 'e+2') + 'e-2');
}
