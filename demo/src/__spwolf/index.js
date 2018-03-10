'use strict';

module.exports = {
  FormHoC: require('./SpForm.js').FormHoC,
  connect: require('./SpForm.js').connect,
  calculateHash: require('./hash.js').calculateHash,
  getHash: require('./hash.js').getHash,
  getDiff: require('./diff.js')
};