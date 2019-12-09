const moduleDiscover = require('./module_loader/finder');

moduleDiscover()
  .then(console.log)
  .catch(console.error);