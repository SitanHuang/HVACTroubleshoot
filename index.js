var network;
var networkToPredictAmp;

function prep() {
  let hidden2 = Math.ceil((dataToPredictAmperage[0].input.length + dataToPredictAmperage[0].output.length) / 2);
  networkToPredictAmp = new neataptic.architect.Perceptron(dataToPredictAmperage[0].input.length, hidden2, dataToPredictAmperage[0].output.length);
  console.log(`Input: ${networkToPredictAmp.input}, Hidden: ${hidden2}, Output: ${networkToPredictAmp.output}`);
  console.log('Training amperage prediction network.');
  networkToPredictAmp.train(dataToPredictAmperage, {
    log: 1000,
    error: 0.0001,
    momentum: 0.7,
    iterations: 100000
  });
  networkToPredictAmp.clear();

  data.forEach(row => {
    if (row[5]) return;
    let amp = activate(row[0], row[1], row[2], row[3], row[4], networkToPredictAmp)[0];
    row[5] = normalize(amp, AMP_MAX);
  });

  let hidden = Math.ceil((data[0].input.length + data[0].output.length) / 2);
  network = new neataptic.architect.Perceptron(data[0].input.length, hidden, data[0].output.length);
  network.clear();


  console.log(`Input: ${network.input}, Hidden: ${hidden}, Output: ${network.output}`);
  console.log(`Ready to train.`);
}

function evolve() {
  // await network.evolve(data, {
  //   mutation: neataptic.methods.mutation.ALL,
  //   mutationRate: 0.4,
  //   clear: true,
  //   cost: neataptic.methods.cost.MSE,
  //   error: 0.002,
  //   log: 500,
  //   iterations: 3000
  // });

  console.log('Finished evolving, training...');

  network.train(data, {
    log: 1000,
    error: 0.0001,
    momentum: 0.7,
    iterations: 100000
  });

  console.log('Done.');
}


prep();
evolve();
