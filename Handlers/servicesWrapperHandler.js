const servicesWrapper = require('../lib/servicesWrapper.js');

exports.servicesWrapperHandler = (event) => {
  return new Promise((resolve, reject) => {
    let servicesWrapperInstance = new servicesWrapper(event);
    servicesWrapperInstance.run()
    .then((censusKitResponse) => {
      return resolve({"body": JSON.stringify(censusKitResponse)});
    })
    .catch((err) => {
      console.error(err);
      return reject(err);
    });
  });
};