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
    error: 0.001,
    momentum: 0.3,
    iterations: 250000
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
    error: 0.0001,
    momentum: 0.7,
    iterations: 1000000
  });

  console.log('Troubleshooting network done.');
  
  networkToPredictCharge.train(dataToPredictCharge, {
    log: 1000,
    error: 0.0001,
    momentum: 0.4,
    iterations: 1000000
  });
  
  console.log('Charge prediction network done.');
}

var log = '';

localStorage = {
};

localStorage.mainNetworkDump = '{"nodes":[{"bias":0,"type":"input","squash":"LOGISTIC","mask":1,"index":"0"},{"bias":0,"type":"input","squash":"LOGISTIC","mask":1,"index":"1"},{"bias":0,"type":"input","squash":"LOGISTIC","mask":1,"index":"2"},{"bias":0,"type":"input","squash":"LOGISTIC","mask":1,"index":"3"},{"bias":0,"type":"input","squash":"LOGISTIC","mask":1,"index":"4"},{"bias":0,"type":"input","squash":"LOGISTIC","mask":1,"index":"5"},{"bias":4.595308572946313,"type":"hidden","squash":"LOGISTIC","mask":1,"index":"6"},{"bias":0.9725008710844876,"type":"hidden","squash":"LOGISTIC","mask":1,"index":"7"},{"bias":5.740806789543546,"type":"hidden","squash":"LOGISTIC","mask":1,"index":"8"},{"bias":-11.65990615858481,"type":"hidden","squash":"LOGISTIC","mask":1,"index":"9"},{"bias":21.47107697672074,"type":"hidden","squash":"LOGISTIC","mask":1,"index":"10"},{"bias":-5.7157966634444115,"type":"hidden","squash":"LOGISTIC","mask":1,"index":"11"},{"bias":0.9751032564165294,"type":"output","squash":"LOGISTIC","mask":1,"index":"12"},{"bias":-4.73422957581146,"type":"output","squash":"LOGISTIC","mask":1,"index":"13"},{"bias":3.015668895421343,"type":"output","squash":"LOGISTIC","mask":1,"index":"14"},{"bias":-0.6976044326293908,"type":"output","squash":"LOGISTIC","mask":1,"index":"15"},{"bias":-3.3069639140330773,"type":"output","squash":"LOGISTIC","mask":1,"index":"16"},{"bias":-0.06199700564072729,"type":"output","squash":"LOGISTIC","mask":1,"index":"17"}],"connections":[{"weight":8.966717150512343,"from":0,"to":6,"gater":null},{"weight":0.8126136731650553,"from":0,"to":7,"gater":null},{"weight":0.3385303133112628,"from":0,"to":8,"gater":null},{"weight":1.201974807668561,"from":0,"to":9,"gater":null},{"weight":-17.858612124519606,"from":0,"to":10,"gater":null},{"weight":12.402502611675507,"from":0,"to":11,"gater":null},{"weight":13.559318636974053,"from":1,"to":6,"gater":null},{"weight":-0.2741855525323099,"from":1,"to":7,"gater":null},{"weight":-1.582130240806475,"from":1,"to":8,"gater":null},{"weight":13.543278345790526,"from":1,"to":9,"gater":null},{"weight":-27.340504288948456,"from":1,"to":10,"gater":null},{"weight":16.732897158275904,"from":1,"to":11,"gater":null},{"weight":-48.13773474822595,"from":2,"to":6,"gater":null},{"weight":-2.287463243117397,"from":2,"to":7,"gater":null},{"weight":45.90538038221753,"from":2,"to":8,"gater":null},{"weight":6.70158002935127,"from":2,"to":9,"gater":null},{"weight":7.584796227013818,"from":2,"to":10,"gater":null},{"weight":4.970193460137637,"from":2,"to":11,"gater":null},{"weight":13.591497108293032,"from":3,"to":6,"gater":null},{"weight":1.17542400952141,"from":3,"to":7,"gater":null},{"weight":-0.8741516683865586,"from":3,"to":8,"gater":null},{"weight":-8.863225358803325,"from":3,"to":9,"gater":null},{"weight":14.054640268653863,"from":3,"to":10,"gater":null},{"weight":-3.6996699340894845,"from":3,"to":11,"gater":null},{"weight":-17.2893908611145,"from":4,"to":6,"gater":null},{"weight":1.9063082161529477,"from":4,"to":7,"gater":null},{"weight":-9.93704632940983,"from":4,"to":8,"gater":null},{"weight":6.490610734264249,"from":4,"to":9,"gater":null},{"weight":-4.505362500226456,"from":4,"to":10,"gater":null},{"weight":3.056123628087459,"from":4,"to":11,"gater":null},{"weight":-4.027855411750879,"from":5,"to":6,"gater":null},{"weight":-4.3800637157804285,"from":5,"to":7,"gater":null},{"weight":-2.8857462089487864,"from":5,"to":8,"gater":null},{"weight":10.188339584132798,"from":5,"to":9,"gater":null},{"weight":-7.1991557615914665,"from":5,"to":10,"gater":null},{"weight":-11.817309346162093,"from":5,"to":11,"gater":null},{"weight":-7.121051392365412,"from":6,"to":17,"gater":null},{"weight":-11.878092246362835,"from":6,"to":16,"gater":null},{"weight":23.40428587946832,"from":6,"to":15,"gater":null},{"weight":-12.813628875718297,"from":6,"to":14,"gater":null},{"weight":-12.49838779465548,"from":6,"to":13,"gater":null},{"weight":15.393411876639309,"from":6,"to":12,"gater":null},{"weight":-1.8426745087503593,"from":7,"to":17,"gater":null},{"weight":-4.84199801073036,"from":7,"to":16,"gater":null},{"weight":-3.206682879905788,"from":7,"to":15,"gater":null},{"weight":5.415510356451036,"from":7,"to":14,"gater":null},{"weight":-7.4180933762805825,"from":7,"to":13,"gater":null},{"weight":1.4797500900340383,"from":7,"to":12,"gater":null},{"weight":-16.24310575671103,"from":8,"to":17,"gater":null},{"weight":16.669103700161635,"from":8,"to":16,"gater":null},{"weight":5.707799640909552,"from":8,"to":15,"gater":null},{"weight":11.884210963995985,"from":8,"to":14,"gater":null},{"weight":8.420291003351519,"from":8,"to":13,"gater":null},{"weight":-15.378903403549288,"from":8,"to":12,"gater":null},{"weight":-0.9070050991066841,"from":9,"to":17,"gater":null},{"weight":2.658327999210884,"from":9,"to":16,"gater":null},{"weight":-12.97027893127016,"from":9,"to":15,"gater":null},{"weight":-17.192709759286988,"from":9,"to":14,"gater":null},{"weight":5.333106505623515,"from":9,"to":13,"gater":null},{"weight":-0.8215490355894556,"from":9,"to":12,"gater":null},{"weight":9.648173781008335,"from":10,"to":17,"gater":null},{"weight":-22.8185397806731,"from":10,"to":16,"gater":null},{"weight":-11.103828107998012,"from":10,"to":15,"gater":null},{"weight":-13.448705538819503,"from":10,"to":14,"gater":null},{"weight":3.642459411501253,"from":10,"to":13,"gater":null},{"weight":-19.381400872389694,"from":10,"to":12,"gater":null},{"weight":-10.574964819685746,"from":11,"to":17,"gater":null},{"weight":5.179887339094516,"from":11,"to":16,"gater":null},{"weight":-19.456537071688814,"from":11,"to":15,"gater":null},{"weight":-1.9230554467533696,"from":11,"to":14,"gater":null},{"weight":-12.807958480990845,"from":11,"to":13,"gater":null},{"weight":2.6401694406433878,"from":11,"to":12,"gater":null}],"input":6,"output":6,"dropout":0}';
localStorage.ampNetworkDump = '{"nodes":[{"bias":0,"type":"input","squash":"LOGISTIC","mask":1,"index":"0"},{"bias":0,"type":"input","squash":"LOGISTIC","mask":1,"index":"1"},{"bias":0,"type":"input","squash":"LOGISTIC","mask":1,"index":"2"},{"bias":0,"type":"input","squash":"LOGISTIC","mask":1,"index":"3"},{"bias":0,"type":"input","squash":"LOGISTIC","mask":1,"index":"4"},{"bias":-14.491311101732814,"type":"hidden","squash":"LOGISTIC","mask":1,"index":"5"},{"bias":-25.288149278167925,"type":"hidden","squash":"LOGISTIC","mask":1,"index":"6"},{"bias":9.718908817462497,"type":"hidden","squash":"LOGISTIC","mask":1,"index":"7"},{"bias":-6.01016526470543,"type":"output","squash":"LOGISTIC","mask":1,"index":"8"}],"connections":[{"weight":17.43472000436073,"from":0,"to":5,"gater":null},{"weight":-29.538365093279698,"from":0,"to":6,"gater":null},{"weight":-24.66261128038835,"from":0,"to":7,"gater":null},{"weight":-5.1868635648458135,"from":1,"to":5,"gater":null},{"weight":-10.264863338453992,"from":1,"to":6,"gater":null},{"weight":10.099085605642436,"from":1,"to":7,"gater":null},{"weight":8.822996925772628,"from":2,"to":5,"gater":null},{"weight":-25.044768545593517,"from":2,"to":6,"gater":null},{"weight":13.538445781520162,"from":2,"to":7,"gater":null},{"weight":11.45448755640953,"from":3,"to":5,"gater":null},{"weight":-11.511913702440651,"from":3,"to":6,"gater":null},{"weight":-18.536441958012976,"from":3,"to":7,"gater":null},{"weight":0.023309479116293462,"from":4,"to":5,"gater":null},{"weight":68.50597918275815,"from":4,"to":6,"gater":null},{"weight":13.70693257864227,"from":4,"to":7,"gater":null},{"weight":6.649586259226967,"from":5,"to":8,"gater":null},{"weight":30.06271035425857,"from":6,"to":8,"gater":null},{"weight":6.721104797833264,"from":7,"to":8,"gater":null}],"input":5,"output":1,"dropout":0}';
localStorage.chargeNetworkDump = '{"nodes":[{"bias":0,"type":"input","squash":"LOGISTIC","mask":1,"index":"0"},{"bias":0,"type":"input","squash":"LOGISTIC","mask":1,"index":"1"},{"bias":0,"type":"input","squash":"LOGISTIC","mask":1,"index":"2"},{"bias":0,"type":"input","squash":"LOGISTIC","mask":1,"index":"3"},{"bias":0,"type":"input","squash":"LOGISTIC","mask":1,"index":"4"},{"bias":0,"type":"input","squash":"LOGISTIC","mask":1,"index":"5"},{"bias":0,"type":"input","squash":"LOGISTIC","mask":1,"index":"6"},{"bias":2.5930768153920005,"type":"hidden","squash":"LOGISTIC","mask":1,"index":"7"},{"bias":0.8540335645865319,"type":"hidden","squash":"LOGISTIC","mask":1,"index":"8"},{"bias":3.2094977792405763,"type":"hidden","squash":"LOGISTIC","mask":1,"index":"9"},{"bias":0.5368363530891298,"type":"hidden","squash":"LOGISTIC","mask":1,"index":"10"},{"bias":3.2401297976809844,"type":"output","squash":"LOGISTIC","mask":1,"index":"11"}],"connections":[{"weight":-4.19527325872225,"from":0,"to":7,"gater":null},{"weight":-3.642344679042059,"from":0,"to":8,"gater":null},{"weight":-5.846721522074074,"from":0,"to":9,"gater":null},{"weight":0.11577354866810043,"from":0,"to":10,"gater":null},{"weight":-6.928594523713224,"from":1,"to":7,"gater":null},{"weight":-2.1335507215395335,"from":1,"to":8,"gater":null},{"weight":-5.501075655091093,"from":1,"to":9,"gater":null},{"weight":-0.04938659020674497,"from":1,"to":10,"gater":null},{"weight":1.4407346420943814,"from":2,"to":7,"gater":null},{"weight":-0.22254816573611,"from":2,"to":8,"gater":null},{"weight":0.13787646827431252,"from":2,"to":9,"gater":null},{"weight":0.12753777274359876,"from":2,"to":10,"gater":null},{"weight":2.160288983153175,"from":3,"to":7,"gater":null},{"weight":-1.5120548483347742,"from":3,"to":8,"gater":null},{"weight":-0.569637164539417,"from":3,"to":9,"gater":null},{"weight":0.8823489183812374,"from":3,"to":10,"gater":null},{"weight":4.086551674964468,"from":4,"to":7,"gater":null},{"weight":1.8940219630269761,"from":4,"to":8,"gater":null},{"weight":4.700310283151143,"from":4,"to":9,"gater":null},{"weight":0.7778932868600702,"from":4,"to":10,"gater":null},{"weight":-2.377502758505338,"from":5,"to":7,"gater":null},{"weight":0.1868604563102802,"from":5,"to":8,"gater":null},{"weight":0.19683816795002482,"from":5,"to":9,"gater":null},{"weight":0.6343045673561286,"from":5,"to":10,"gater":null},{"weight":-1.7315147738127445,"from":6,"to":7,"gater":null},{"weight":1.5224919867805733,"from":6,"to":8,"gater":null},{"weight":3.7693558289042084,"from":6,"to":9,"gater":null},{"weight":0.7048326562006998,"from":6,"to":10,"gater":null},{"weight":-8.040757452944232,"from":7,"to":11,"gater":null},{"weight":-2.7901586047478886,"from":8,"to":11,"gater":null},{"weight":-5.158933917282963,"from":9,"to":11,"gater":null},{"weight":0.5014008651305707,"from":10,"to":11,"gater":null}],"input":7,"output":1,"dropout":0}';
localStorage.dataVer = '19.071';

function _train() {
  var oldVersion = parseFloat(localStorage.dataVer);
  log += '<span style="color: grey">`localStorage` support found, cached=' + oldVersion + '</span>, <button type="button" onclick="delete localStorage.dataVer;location.reload();">Delete cached network</button><br>';
  
//  if (oldVersion != DATA_VER) {
    log += '<span style="color: orange">cache outdated (newVersion=' + DATA_VER + '), training networks live...</span><br>';
    prep();
    evolve();
    
    localStorage.mainNetworkDump = JSON.stringify(network.toJSON());
    localStorage.ampNetworkDump = JSON.stringify(networkToPredictAmp.toJSON());
    localStorage.chargeNetworkDump = JSON.stringify(networkToPredictCharge.toJSON());
    localStorage.dataVer = DATA_VER.toString();
//  }
  
    network = neataptic.Network.fromJSON(JSON.parse(localStorage.mainNetworkDump));
  networkToPredictAmp = neataptic.Network.fromJSON(JSON.parse(localStorage.ampNetworkDump));
  networkToPredictCharge = neataptic.Network.fromJSON(JSON.parse(localStorage.chargeNetworkDump));
}

if (localStorage) {
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
