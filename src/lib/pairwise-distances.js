import ndarray from 'ndarray';
import cwise from 'cwise';

let euclidean = cwise({
  args: ['array', 'array'],
  pre: function(a, b) {
    this.sum = 0.0;
  },
  body: function(a, b) {
    var d = a - b;
    this.sum += d * d;
  },
  post: function(a, b) {
    return Math.sqrt(this.sum);
  }
});

let jaccard = cwise({
  args: ['array', 'array'],
  pre: function(a, b) {
    this.tf = 0.0;
    this.tt = 0.0;
  },
  body: function(a, b) {
    this.tf += +(a != b);
    this.tt += +(a == 1 && b == 1);
  },
  post: function(a, b) {
    return this.tf / (this.tf + this.tt);
  }
});

export default function(data, metric) {
  let nSamples = data.shape[0];
  let distance = ndarray(new Float64Array(nSamples * nSamples), [nSamples, nSamples]);

  switch (metric) {
    case 'euclidean':
      for (let i = 0; i < nSamples; i++) {
        for (let j = i + 1; j < nSamples; j++) {
          let d = euclidean(data.pick(i, null), data.pick(j, null));
          distance.set(i, j, d);
          distance.set(j, i, d);
        }
      }
      break;
    case 'jaccard':
      for (let i = 0; i < nSamples; i++) {
        for (let j = i + 1; j < nSamples; j++) {
          let d = jaccard(data.pick(i, null), data.pick(j, null));
          distance.set(i, j, d);
          distance.set(j, i, d);
        }
      }
      break;
    default:
  }

  return distance;
}