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
    error: 0.001,
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

localStorage = {
};

localStorage.mainNetworkDump = '{"nodes":[{"bias":0,"type":"input","squash":"LOGISTIC","mask":1,"index":"0"},{"bias":0,"type":"input","squash":"LOGISTIC","mask":1,"index":"1"},{"bias":0,"type":"input","squash":"LOGISTIC","mask":1,"index":"2"},{"bias":0,"type":"input","squash":"LOGISTIC","mask":1,"index":"3"},{"bias":0,"type":"input","squash":"LOGISTIC","mask":1,"index":"4"},{"bias":0,"type":"input","squash":"LOGISTIC","mask":1,"index":"5"},{"bias":-1.184863532536495,"type":"hidden","squash":"LOGISTIC","mask":1,"index":"6"},{"bias":6.856490560506887,"type":"hidden","squash":"LOGISTIC","mask":1,"index":"7"},{"bias":-3.3931401712507645,"type":"hidden","squash":"LOGISTIC","mask":1,"index":"8"},{"bias":10.359875718715934,"type":"hidden","squash":"LOGISTIC","mask":1,"index":"9"},{"bias":-1.262804308626694,"type":"hidden","squash":"LOGISTIC","mask":1,"index":"10"},{"bias":-4.93223618246224,"type":"hidden","squash":"LOGISTIC","mask":1,"index":"11"},{"bias":-6.237004938946298,"type":"output","squash":"LOGISTIC","mask":1,"index":"12"},{"bias":0.23900816938010053,"type":"output","squash":"LOGISTIC","mask":1,"index":"13"},{"bias":-9.738219400192076,"type":"output","squash":"LOGISTIC","mask":1,"index":"14"},{"bias":-10.47595550706231,"type":"output","squash":"LOGISTIC","mask":1,"index":"15"},{"bias":-1.4316706626648892,"type":"output","squash":"LOGISTIC","mask":1,"index":"16"},{"bias":2.4810294745983654,"type":"output","squash":"LOGISTIC","mask":1,"index":"17"}],"connections":[{"weight":-0.5516166256746496,"from":0,"to":6,"gater":null},{"weight":11.22106781904441,"from":0,"to":7,"gater":null},{"weight":8.181335683191467,"from":0,"to":8,"gater":null},{"weight":-15.23445970690262,"from":0,"to":9,"gater":null},{"weight":2.0093789230625165,"from":0,"to":10,"gater":null},{"weight":5.058480285952875,"from":0,"to":11,"gater":null},{"weight":19.136538113807543,"from":1,"to":6,"gater":null},{"weight":5.50238382039995,"from":1,"to":7,"gater":null},{"weight":4.637539479049339,"from":1,"to":8,"gater":null},{"weight":-14.174478385820288,"from":1,"to":9,"gater":null},{"weight":4.487826537143238,"from":1,"to":10,"gater":null},{"weight":6.604084936032489,"from":1,"to":11,"gater":null},{"weight":13.117874389081942,"from":2,"to":6,"gater":null},{"weight":-26.316590789809915,"from":2,"to":7,"gater":null},{"weight":-29.72106868105576,"from":2,"to":8,"gater":null},{"weight":6.434523594637598,"from":2,"to":9,"gater":null},{"weight":17.953284545137265,"from":2,"to":10,"gater":null},{"weight":16.400697479458486,"from":2,"to":11,"gater":null},{"weight":3.45347569023203,"from":3,"to":6,"gater":null},{"weight":6.759100993332956,"from":3,"to":7,"gater":null},{"weight":5.689692272074626,"from":3,"to":8,"gater":null},{"weight":8.29093757973169,"from":3,"to":9,"gater":null},{"weight":-0.22770701818209546,"from":3,"to":10,"gater":null},{"weight":3.2399943402247,"from":3,"to":11,"gater":null},{"weight":-5.1070424650535005,"from":4,"to":6,"gater":null},{"weight":-5.272199490778737,"from":4,"to":7,"gater":null},{"weight":0.9497940986909092,"from":4,"to":8,"gater":null},{"weight":2.757818697473563,"from":4,"to":9,"gater":null},{"weight":-0.6904821543114414,"from":4,"to":10,"gater":null},{"weight":7.705853559608036,"from":4,"to":11,"gater":null},{"weight":0.12417523075178777,"from":5,"to":6,"gater":null},{"weight":-18.02612070815229,"from":5,"to":7,"gater":null},{"weight":-5.132721378796911,"from":5,"to":8,"gater":null},{"weight":-3.689477210424405,"from":5,"to":9,"gater":null},{"weight":-2.3826551042512882,"from":5,"to":10,"gater":null},{"weight":-13.805182224989231,"from":5,"to":11,"gater":null},{"weight":-9.640860916185005,"from":6,"to":17,"gater":null},{"weight":10.368697571361079,"from":6,"to":16,"gater":null},{"weight":-6.936873933743154,"from":6,"to":15,"gater":null},{"weight":-13.162496354781052,"from":6,"to":14,"gater":null},{"weight":0.8044579929800775,"from":6,"to":13,"gater":null},{"weight":5.310789740092844,"from":6,"to":12,"gater":null},{"weight":-8.775962557887635,"from":7,"to":17,"gater":null},{"weight":-12.934340732325287,"from":7,"to":16,"gater":null},{"weight":12.639688678989295,"from":7,"to":15,"gater":null},{"weight":4.89750111893089,"from":7,"to":14,"gater":null},{"weight":-6.7090417765704515,"from":7,"to":13,"gater":null},{"weight":11.649123865747123,"from":7,"to":12,"gater":null},{"weight":3.389508406688061,"from":8,"to":17,"gater":null},{"weight":-10.352417717516447,"from":8,"to":16,"gater":null},{"weight":8.6128476736643,"from":8,"to":15,"gater":null},{"weight":-4.636540479260899,"from":8,"to":14,"gater":null},{"weight":-14.50077820911025,"from":8,"to":13,"gater":null},{"weight":4.629835728291283,"from":8,"to":12,"gater":null},{"weight":5.0780549984180015,"from":9,"to":17,"gater":null},{"weight":-23.34942912597198,"from":9,"to":16,"gater":null},{"weight":2.335831352961782,"from":9,"to":15,"gater":null},{"weight":12.2018756701532,"from":9,"to":14,"gater":null},{"weight":5.888942976005751,"from":9,"to":13,"gater":null},{"weight":-22.07889333336035,"from":9,"to":12,"gater":null},{"weight":-12.157716142269482,"from":10,"to":17,"gater":null},{"weight":6.903369609418618,"from":10,"to":16,"gater":null},{"weight":-7.765769146877924,"from":10,"to":15,"gater":null},{"weight":-1.0158131498119325,"from":10,"to":14,"gater":null},{"weight":4.157406313966582,"from":10,"to":13,"gater":null},{"weight":-0.40213406411746233,"from":10,"to":12,"gater":null},{"weight":-8.322092633697705,"from":11,"to":17,"gater":null},{"weight":-0.6786241610382044,"from":11,"to":16,"gater":null},{"weight":-12.384184928424078,"from":11,"to":15,"gater":null},{"weight":1.4492409477060646,"from":11,"to":14,"gater":null},{"weight":-5.396853313368442,"from":11,"to":13,"gater":null},{"weight":-9.980537064071665,"from":11,"to":12,"gater":null}],"input":6,"output":6,"dropout":0}';
localStorage.ampNetworkDump = '{"nodes":[{"bias":0,"type":"input","squash":"LOGISTIC","mask":1,"index":"0"},{"bias":0,"type":"input","squash":"LOGISTIC","mask":1,"index":"1"},{"bias":0,"type":"input","squash":"LOGISTIC","mask":1,"index":"2"},{"bias":0,"type":"input","squash":"LOGISTIC","mask":1,"index":"3"},{"bias":0,"type":"input","squash":"LOGISTIC","mask":1,"index":"4"},{"bias":-11.652205323565923,"type":"hidden","squash":"LOGISTIC","mask":1,"index":"5"},{"bias":5.109309716874446,"type":"hidden","squash":"LOGISTIC","mask":1,"index":"6"},{"bias":-22.329569843968205,"type":"hidden","squash":"LOGISTIC","mask":1,"index":"7"},{"bias":-4.076359655240505,"type":"output","squash":"LOGISTIC","mask":1,"index":"8"}],"connections":[{"weight":10.658927711498011,"from":0,"to":5,"gater":null},{"weight":-14.309196321775605,"from":0,"to":6,"gater":null},{"weight":-23.34932224511728,"from":0,"to":7,"gater":null},{"weight":-3.314593971970346,"from":1,"to":5,"gater":null},{"weight":8.459008990268298,"from":1,"to":6,"gater":null},{"weight":-8.054070744919667,"from":1,"to":7,"gater":null},{"weight":7.686498123757365,"from":2,"to":5,"gater":null},{"weight":12.262549954198027,"from":2,"to":6,"gater":null},{"weight":-20.84735656532473,"from":2,"to":7,"gater":null},{"weight":8.792761160181849,"from":3,"to":5,"gater":null},{"weight":-13.012493078309792,"from":3,"to":6,"gater":null},{"weight":-9.34009126021175,"from":3,"to":7,"gater":null},{"weight":4.198715429209544,"from":4,"to":5,"gater":null},{"weight":7.233820817295637,"from":4,"to":6,"gater":null},{"weight":56.82876103020733,"from":4,"to":7,"gater":null},{"weight":4.657499529439762,"from":5,"to":8,"gater":null},{"weight":4.567278103306286,"from":6,"to":8,"gater":null},{"weight":25.24259427017262,"from":7,"to":8,"gater":null}],"input":5,"output":1,"dropout":0}';
localStorage.chargeNetworkDump = '{"nodes":[{"bias":0,"type":"input","squash":"LOGISTIC","mask":1,"index":"0"},{"bias":0,"type":"input","squash":"LOGISTIC","mask":1,"index":"1"},{"bias":0,"type":"input","squash":"LOGISTIC","mask":1,"index":"2"},{"bias":0,"type":"input","squash":"LOGISTIC","mask":1,"index":"3"},{"bias":0,"type":"input","squash":"LOGISTIC","mask":1,"index":"4"},{"bias":0,"type":"input","squash":"LOGISTIC","mask":1,"index":"5"},{"bias":0,"type":"input","squash":"LOGISTIC","mask":1,"index":"6"},{"bias":-0.30925512876620953,"type":"hidden","squash":"LOGISTIC","mask":1,"index":"7"},{"bias":-0.24924164206511257,"type":"hidden","squash":"LOGISTIC","mask":1,"index":"8"},{"bias":-0.24056517040547876,"type":"hidden","squash":"LOGISTIC","mask":1,"index":"9"},{"bias":-0.34001168008897253,"type":"hidden","squash":"LOGISTIC","mask":1,"index":"10"},{"bias":2.431384712454504,"type":"output","squash":"LOGISTIC","mask":1,"index":"11"}],"connections":[{"weight":-2.172259235569561,"from":0,"to":7,"gater":null},{"weight":-1.5023669874079122,"from":0,"to":8,"gater":null},{"weight":-0.8904587533446615,"from":0,"to":9,"gater":null},{"weight":-1.5869550939714079,"from":0,"to":10,"gater":null},{"weight":-2.3024243151885715,"from":1,"to":7,"gater":null},{"weight":-1.6165539990467395,"from":1,"to":8,"gater":null},{"weight":-1.0108430714747305,"from":1,"to":9,"gater":null},{"weight":-1.7976540338997715,"from":1,"to":10,"gater":null},{"weight":0.12459153064437664,"from":2,"to":7,"gater":null},{"weight":0.13241967675295485,"from":2,"to":8,"gater":null},{"weight":-0.004515722346035751,"from":2,"to":9,"gater":null},{"weight":-0.006983369943701283,"from":2,"to":10,"gater":null},{"weight":2.0973299880643475,"from":3,"to":7,"gater":null},{"weight":1.354719020165841,"from":3,"to":8,"gater":null},{"weight":0.6916624678922101,"from":3,"to":9,"gater":null},{"weight":1.3759967513377165,"from":3,"to":10,"gater":null},{"weight":0.34505599704588963,"from":4,"to":7,"gater":null},{"weight":0.21160143858782318,"from":4,"to":8,"gater":null},{"weight":0.09984245503217695,"from":4,"to":9,"gater":null},{"weight":0.3352736659254367,"from":4,"to":10,"gater":null},{"weight":0.8099989567690326,"from":5,"to":7,"gater":null},{"weight":0.5348859486463483,"from":5,"to":8,"gater":null},{"weight":0.32400055723832955,"from":5,"to":9,"gater":null},{"weight":0.5887971031666362,"from":5,"to":10,"gater":null},{"weight":2.6528316063869277,"from":6,"to":7,"gater":null},{"weight":1.5273259742849823,"from":6,"to":8,"gater":null},{"weight":0.8738461225850357,"from":6,"to":9,"gater":null},{"weight":1.7886492616819474,"from":6,"to":10,"gater":null},{"weight":-3.917060432808494,"from":7,"to":11,"gater":null},{"weight":-2.186843000340314,"from":8,"to":11,"gater":null},{"weight":-0.9159305219166204,"from":9,"to":11,"gater":null},{"weight":-2.504373235184659,"from":10,"to":11,"gater":null}],"input":7,"output":1,"dropout":0}';
localStorage.dataVer = '19.071';

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
