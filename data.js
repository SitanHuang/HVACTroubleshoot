
var data = [
  // { input: [], output: [] }
];

var dataToPredictAmperage = [
  // { input: [], output: [] }
];

AMBIENT_MAX = 115;
SH_MAX = 100;
SC_MAX = 100;
LT_MAX = 100;
HT_MAX = AMBIENT_MAX + 40;
AMP_MAX = 1;

`
85	22	5.2	14.3	60	233	34	112	28.8	21	0.7291666667			0	0	1	0	0	0	0
82	410a	12.4	8	112.7	319.7	37.2	100	26.4	12.2	0.4621212121			0	0	0	0	0	0	0
82	410a	10	8	108	318	35	99.5	26.4	12.2	0.4621212121			0	0	0	0	0	0	0
90	22	80.9	14	18.9	235	-7.2	113	23	16	0.6956521739			0	0	0	0	0	1	0
95	22	79	0	18	179	-7.9	94	18	11	0.6111111111			0	1	0	0	0	0	0
84	407c	12.8	3.7	68	211	43	104	18	11	0.6111111111			0	0	0	0	1	0	0
78	22	2.5	9.9	63	180	39.9	94.6	19.2	12	0.625			0	0	0.5	0.5	0	0	0
92	22	55.5	3.8	42	249	23.8	115.6			#DIV/0!			0	1	0	0	0	0	0
85	22	19	13	70	255	44.6	117.3			#DIV/0!			0	0	0	0	0	0	0
97	410a	11	36.3	134.4	489	46	131.9	16	13	0.8125			0	0	1	0	0	0	0
97	410a	15.5	13.2	133.6	363.1	46	109			#DIV/0!			0	0	0	0	0	0	0
85	407c	13.5	7.7	72.7	260.6	45.4	109.7			#DIV/0!			0	0	0	0	0	0	0
88	22	2.1	4.5	70	260	43	115	13.7	11.5	0.8394160584			0.5	0	0	0	0	0	1
#95	410a	32	0.7	124.1	349	42	107	12.9	7.5	0.5813953488			0	1	0	0	0	0	0
98	410a	12	10			50	111	16.5	10.4	0.6303030303			0	0	0	0	0	0	0
94	407c	13	17			46	126	11.6	8.1	0.6982758621			0	0	0.5	0	0	0	0
92	22	5	18			51	128	11.6	9.8	0.8448275862			0	0	1	0	0	0	0
98	22	41	16			43	127	11.6	9.2	0.7931034483			0	0	0	0	0	1	0
98	22	38	15			46	129	11.6	9.3	0.8017241379			1	0	0	0	0	1	0
105	22	4	10			46	125	1	0.67	0.67			0	0	0	0	0	0	0
100	22	12	24			46	140	14	18	1.285714286			1	0	1	0	0	1	0
100	407c	17	7			48	131	14	13.7	0.9785714286			1	0	0	0	0	0.6	0
`.split('\n').forEach(line => {
  if (!line.length) return;
  let tabs = line.split('\t');

  let ambient = parseFloat(tabs[0]);
  let sh = parseFloat(tabs[2]);
  let sc = parseFloat(tabs[3]);
  let lt = parseFloat(tabs[6]);
  let ht = parseFloat(tabs[7]);
  let amp = parseFloat(tabs[10]) || 0;

  // console.log([ambient, sh, sc, lt, ht]);

  let underCharge = parseFloat(tabs[14]);
  let overCharge = parseFloat(tabs[15]);
  let lowIndoorFlow = parseFloat(tabs[16]);
  let dirtyCoil = parseFloat(tabs[17]);
  let restriction = parseFloat(tabs[18]);
  let txvStuckOpen = parseFloat(tabs[19]);

  if (isNaN(ambient) || isNaN(sh) || isNaN(sc) || isNaN(lt) || isNaN(ht) ||
    isNaN(underCharge) || isNaN(overCharge) || isNaN(lowIndoorFlow) || isNaN(dirtyCoil) || isNaN(restriction) || isNaN(txvStuckOpen))
    return;

  data.push({input: [normalize(ambient, AMBIENT_MAX),
                  normalize(sh, SH_MAX),
                  normalize(sc, SC_MAX),
                  normalize(lt, LT_MAX),
                  normalize(ht, HT_MAX),
                  normalize(amp, AMP_MAX)],
             output: [underCharge, overCharge, lowIndoorFlow, dirtyCoil, restriction, txvStuckOpen]});
  if (amp)
    dataToPredictAmperage.push({input: [normalize(ambient, AMBIENT_MAX),
                    normalize(sh, SH_MAX),
                    normalize(sc, SC_MAX),
                    normalize(lt, LT_MAX),
                    normalize(ht, HT_MAX)],
               output: [normalize(amp, AMP_MAX)]});
});

function activate(ambient, sh, sc, lt, ht, net) {
  if (isNaN(net)) {
    net.clear();
    return net.activate([normalize(ambient, AMBIENT_MAX),
      normalize(sh, SH_MAX),
      normalize(sc, SC_MAX),
      normalize(lt, LT_MAX),
      normalize(ht, HT_MAX)]);
  }
  network.clear();
  let results = network.activate([normalize(ambient, AMBIENT_MAX),
    normalize(sh, SH_MAX),
    normalize(sc, SC_MAX),
    normalize(lt, LT_MAX),
    normalize(ht, HT_MAX),
    normalize(net, AMP_MAX)]).map(x => (Math.round(x * 100)));
  return results;
}

function test(ambient, sh, sc, lt, ht, amp) {
  let results = activate(ambient, sh, sc, lt, ht, amp);
  return `Undercharge: ${results[0]}%, Overcharge: ${results[1]}%,
  Low Indoor Flow: ${results[2]}%, Dirty coil: ${results[3]}%,
  Restriction: ${results[4]}%, TXV Stuck Open: ${results[5]}%`;
}
