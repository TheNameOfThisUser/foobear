const servicesWrapper = require('../lib/servicesWrapper.js');

exports.servicesWrapperHandler = function (event, context, callback) {
  let servicesWrapperInstance = new servicesWrapper(event);
  servicesWrapperInstance.run()
  .then((res) => {
    return callback(null, "body": JSON.stringify(res));
  })
  .catch((err) => {
    console.error(err);
    return callback(null, err);
  })
};