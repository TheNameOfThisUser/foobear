const servicesWrapper = require('../Lib/servicesWrapper.js');

exports.servicesWrapperHandler = (event) => {
  return new Promise((resolve, reject) => {
    let servicesWrapperInstance = new servicesWrapper(event);
    servicesWrapperInstance.run()
    .then((censusKitResponse) => {
      console.log("Census kit response: " + censusKitResponse);
      return resolve({"body": censusKitResponse});
    })
    .catch((err) => {
      console.error(err);
      return reject(err);
    });
  });
};