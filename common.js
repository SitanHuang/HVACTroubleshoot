function normalize(val, max) {
  return Math.min(Math.max(val / max, -1), 1);
}
function denormalize(val, max) {
  return val * max;
}
