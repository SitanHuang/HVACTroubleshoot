var network;

function prep() {
  let hidden = Math.ceil((data[0].input.length + data[0].output.length) / 2);
  network = new neataptic.architect.Perceptron(data[0].input.length, hidden, data[0].output.length);

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
    error: 0.001,
    momentum: 0.7,
    iterations: 100000
  });

  console.log('Done.');
}


prep();
