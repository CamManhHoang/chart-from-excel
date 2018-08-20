var url = 'test.xlsm';
var oReq = new XMLHttpRequest();
oReq.open('GET', url, true);
oReq.responseType = 'arraybuffer';

oReq.onload = function(e) {
  var arraybuffer = oReq.response;

  /* convert data to binary string */
  var data = new Uint8Array(arraybuffer);
  var arr = new Array();
  for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
  var bstr = arr.join('');

  /* Call XLSX */
  var workbook = XLSX.read(bstr, {type: 'binary'});

  /* DO SOMETHING WITH workbook HERE */
  var first_sheet_name = workbook.SheetNames[3];
  /* Get worksheet */
  var worksheet = workbook.Sheets[first_sheet_name];
  // console.log(XLSX.utils.sheet_to_json(worksheet, {raw: true}));

  var excelData = XLSX.utils.sheet_to_json(worksheet, {raw: true});

  var names = [];
  var positions = [];

  excelData.forEach(function(element) {
    names.push(element.__EMPTY);
    positions.push({
      x: element['-0.36'],
      y: element.YAS_BOND_YLD,
      r: 5,
    });
  });

  let ctx = document.getElementById('myChart');
  let bubbleData = {
    labels: names,
    datasets: [
      {
        label: 'name', // extract from excel file
        data: positions,
        backgroundColor: '#03DAC6',
        borderWidth: 2,
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
            max: 7,
            min: 0,
            stepSize: 1,
          },
        }],
    },
    tooltips: {
      callbacks: {
        label: function(tooltipItem, data) {
          var label = data.labels[tooltipItem.index];
          return label + ': (' + tooltipItem.xLabel + ', ' + tooltipItem.yLabel + ')';
        }
      }
    }
  };
  let myChart = new Chart(ctx, {
    type: 'bubble',
    data: bubbleData,
    options: options,
  });
};

oReq.send();
