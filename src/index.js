module.exports = {
  FormHOC: require('./SpForm.js').FormHOC,
  connect: require('./SpForm.js').connect,
  calculateHash: require('./hash.js').calculateHash,
  getHash: require('./hash.js').getHash,
  getDiff: require('./diff.js')
};
