var network;
var networkToPredictAmp;
var networkToPredictCharge;

function prep() {
  let hidden2 = Math.ceil((dataToPredictAmperage[0].input.length + dataToPredictAmperage[0].output.length) / 2);
  networkToPredictAmp = new neataptic.Architect.Perceptron(dataToPredictAmperage[0].input.length, hidden2, dataToPredictAmperage[0].output.length);
  console.log(`Input: ${networkToPredictAmp.input}, Hidden: ${hidden2}, Output: ${networkToPredictAmp.output}`);
  console.log('Training amperage prediction network.');
  networkToPredictAmp.train(dataToPredictAmperage, {
    log: 1000,
    error: 0.01,
    momentum: 0.3,
    iterations: 100000
  });
  networkToPredictAmp.clear();

  data.forEach(row => {
    if (row[5]) return;
    let amp = activate(row[0], row[1], row[2], row[3], row[4], networkToPredictAmp)[0];
    row[5] = normalize(amp, AMP_MAX);
  });
  
  dataToPredictCharge.forEach(row => {
    if (row[5]) return;
    let amp = activate(row[0], row[1], row[2], row[3], row[4], networkToPredictAmp)[0];
    row[5] = normalize(amp, AMP_MAX);
  });
  
  console.log('Prep charge prediction network...');
  
  let hidden3 = Math.ceil((dataToPredictCharge[0].input.length + dataToPredictCharge[0].output.length) / 2);
  networkToPredictCharge = new neataptic.Architect.Perceptron(dataToPredictCharge[0].input.length, hidden3, dataToPredictCharge[0].output.length);
  networkToPredictCharge.clear();
  console.log(`Input: ${networkToPredictCharge.input}, Hidden: ${hidden3}, Output: ${networkToPredictCharge.output}`);
  
  console.log('Prep troubleshooting network...');

  let hidden = Math.ceil((data[0].input.length + data[0].output.length) / 2);
  network = new neataptic.Architect.Perceptron(data[0].input.length, hidden, data[0].output.length);
  network.clear();


  console.log(`Input: ${network.input}, Hidden: ${hidden}, Output: ${network.output}`);
  console.log(`Ready to train.`);
}

function evolve() {
  // network.evolve(data, {
  //   mutation: neataptic.Methods.Mutation.ALL,
  //   mutationRate: 0.4,
  //   clear: true,
  //   cost: neataptic.Methods.Cost.MSE,
  //   error: 0.002,
  //   log: 500,
  //   iterations: 3000
  // });

  console.log('Finished evolving, training...');

  network.train(data, {
    log: 1000,
    error: 0.005,
    momentum: 0.7,
    iterations: 100000
  });

  console.log('Troubleshooting network done.');
  
  networkToPredictCharge.train(dataToPredictCharge, {
    log: 1000,
    error: 0.001,
    momentum: 0.3,
    iterations: 100000
  });
  
  console.log('Charge prediction network done.');
}

var log = '';

if (localStorage) {
  var oldVersion = parseFloat(localStorage.dataVer);
  log += '<span style="color: grey">`localStorage` support found, cached=' + oldVersion + '</span>, <button type="button" onclick="delete localStorage.dataVer;location.reload();">Delete cached network</button><br>';
  
  if (oldVersion != DATA_VER) {
    log += '<span style="color: orange">cache outdated (newVersion=' + DATA_VER + '), training networks live...</span><br>';
    prep();
    evolve();
    
    localStorage.mainNetworkDump = JSON.stringify(network.toJSON());
    localStorage.ampNetworkDump = JSON.stringify(networkToPredictAmp.toJSON());
    localStorage.chargeNetworkDump = JSON.stringify(networkToPredictCharge.toJSON());
    localStorage.dataVer = DATA_VER.toString();
  }
  
  network = neataptic.Network.fromJSON(JSON.parse(localStorage.mainNetworkDump));
  networkToPredictAmp = neataptic.Network.fromJSON(JSON.parse(localStorage.ampNetworkDump));
  networkToPredictCharge = neataptic.Network.fromJSON(JSON.parse(localStorage.chargeNetworkDump));
  log += '<span style="color: green">Loaded.</span><br>';
} else {
  log += '<span style="color: orange">`localStorage` not supported, training networks live...</span><br>';
  prep();
  evolve(); 
}

document.getElementById('console').innerHTML = log;
