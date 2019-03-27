const servicesWrapper = require("../Lib/servicesWrapper.js");
const chai = require("chai");
const assert = chai.assert;
let sWInstance;
let event;
let parsedBody;

describe("servicesWrapper", function() {
  before(function(done) {
    event = {
      body: {
        "api-key": "8QhnVrqe9p4B5ci3R06NR7QNpJgQ2tnc1kMQD7Lw",
        Census: [
          {
            Phone: "649-444-4928",
            Address: "473 Pine St Fl 2, San Francisco, CA 94114",
            Name: "Jason Smith",
            DOB: "02/26/1970",
            Gender: "Male"
          },
          {
            Phone: "949-234-5023",
            Address: "1687 Wylie Ln, Draper, UT 84020",
            Name: "Jannet Maquask",
            DOB: "11/05/1964",
            Gender: "Female"
          }
        ]
      }
    };
    sWInstance = new servicesWrapper(event);
    done();
  })

  describe("servicesWrapper.parse(body)", function() {
    it("resolves parsed JSON string", function(done) {
      console.log(sWInstance);
      let stringyBody = JSON.stringify(event.body);
      sWInstance.parse(stringyBody)
      .then((parsedBodyRet) => {
        console.log(parsedBodyRet);
        assert.equal(parsedBodyRet["api-key"], "8QhnVrqe9p4B5ci3R06NR7QNpJgQ2tnc1kMQD7Lw");
        parsedBody = parsedBodyRet;
        done();
      })
      .catch((err) => {
        console.error(err);
        assert.fail();
        done();
      });
    });

    it("rejects non-JSON string", function(done) {
      sWInstance.parse(event.body)
      .catch((err) => {
        console.error(err);
        assert.equal(err.statusCode, 400);
        done();
      });      
    });
  });

  describe("servicesWrapper.normalize(parsedBody)", function() {
    it("rejects missing api-key", function(done) {
      parsedBody["api-key"] = undefined;
      sWInstance.normalize(parsedBody)
      .catch((err) => {
        console.error(err);
        assert.equal(err.statusCode, 422);
        assert.equal(JSON.parse(err.body), "Failed due to missing api-key");
        parsedBody["api-key"] = "8QhnVrqe9p4B5ci3R06NR7QNpJgQ2tnc1kMQD7Lw";
        done();
      });
    });

    it("rejects missing Census", function(done) {
      parsedBody["Census"] = undefined;
      sWInstance.normalize(parsedBody)
      .catch((err) => {
        console.error(err);
        assert.equal(err.statusCode, 422);
        assert.equal(JSON.parse(err.body), "Failed due to missing Census");
        parsedBody["Census"] = [
          {
            Phone: "649-444-4928",
            Address: "473 Pine St Fl 2, San Francisco, CA 94114",
            Name: "Jason Smith",
            DOB: "02/26/1970",
            Gender: "Male"
          },
          {
            Phone: "949-234-5023",
            Address: "1687 Wylie Ln, Draper, UT 84020",
            Name: "Jannet Maquask",
            DOB: "11/05/1964",
            Gender: "Female"
          }
        ];
        done();
      });
    });

    it("rejects missing Census properties (phone)", function(done) {
      parsedBody["Census"][1]["Phone"] = undefined;
      sWInstance.normalize(parsedBody)
      .catch((err) => {
        console.error(err);
        assert.equal(err.statusCode, 422);
        assert.equal(JSON.parse(err.body), "Failed due to missing Census properties");
        parsedBody["Census"][1]["Phone"] = "949-234-5023";
        done();
      });
    });

    it("rejects missing Census properties (address)", function(done) {
      parsedBody["Census"][0]["Address"] = undefined;
      sWInstance.normalize(parsedBody)
      .catch((err) => {
        console.error(err);
        assert.equal(err.statusCode, 422);
        assert.equal(JSON.parse(err.body), "Failed due to missing Census properties");
        parsedBody["Census"][0]["Address"] = "473 Pine St Fl 2, San Francisco, CA 94114";
        done();
      });
    });

    it("rejects missing Census properties (name)", function(done) {
      parsedBody["Census"][0]["Name"] = undefined;
      sWInstance.normalize(parsedBody)
      .catch((err) => {
        console.error(err);
        assert.equal(err.statusCode, 422);
        assert.equal(JSON.parse(err.body), "Failed due to missing Census properties");
        parsedBody["Census"][0]["Name"] = "Jason Smith";
        done();
      });
    });

    it("rejects missing Census properties (DOB)", function(done) {
      parsedBody["Census"][1]["DOB"] = undefined;
      sWInstance.normalize(parsedBody)
      .catch((err) => {
        console.error(err);
        assert.equal(err.statusCode, 422);
        assert.equal(JSON.parse(err.body), "Failed due to missing Census properties");
        parsedBody["Census"][1]["DOB"] = "02/26/1970";
        done();
      });
    });

    it("rejects missing Census properties (gender)", function(done) {
      parsedBody["Census"][1]["Gender"] = undefined;
      sWInstance.normalize(parsedBody)
      .catch((err) => {
        console.error(err);
        assert.equal(err.statusCode, 422);
        assert.equal(JSON.parse(err.body), "Failed due to missing Census properties");
        parsedBody["Census"][1]["Gender"] = "Female";
        done();
      });
    });

    it("rejects invalid Census properties (phone)", function(done) {
      parsedBody["Census"][1]["Phone"] = 8642223333;
      sWInstance.normalize(parsedBody)
      .catch((err) => {
        console.error(err);
        assert.equal(err.statusCode, 422);
        assert.equal(JSON.parse(err.body), "Failed due to invalid Census properties");
        parsedBody["Census"][1]["Phone"] = "949-234-5023";
        done();
      });
    });

    it("rejects invalid Census properties (address)", function(done) {
      parsedBody["Census"][1]["Address"] = 1423;
      sWInstance.normalize(parsedBody)
      .catch((err) => {
        console.error(err);
        assert.equal(err.statusCode, 422);
        assert.equal(JSON.parse(err.body), "Failed due to invalid Census properties");
        parsedBody["Census"][1]["Address"] = "1687 Wylie Ln, Draper, UT 84020";
        done();
      });
    });

    it("rejects invalid Census properties (name)", function(done) {
      parsedBody["Census"][1]["Name"] = {"name": "invalidName"};
      sWInstance.normalize(parsedBody)
      .catch((err) => {
        console.error(err);
        assert.equal(err.statusCode, 422);
        assert.equal(JSON.parse(err.body), "Failed due to invalid Census properties");
        parsedBody["Census"][1]["Name"] = "Jannet Maquask";
        done();
      });
    });

    it("rejects invalid Census properties (DOB)", function(done) {
      parsedBody["Census"][1]["DOB"] = 1211994;
      sWInstance.normalize(parsedBody)
      .catch((err) => {
        console.error(err);
        assert.equal(err.statusCode, 422);
        assert.equal(JSON.parse(err.body), "Failed due to invalid Census properties");
        parsedBody["Census"][1]["DOB"] = "02/26/1970";
        done();
      });
    });

    it("rejects invalid Census properties (gender)", function(done) {
      parsedBody["Census"][1]["Gender"] = 01101011;
      sWInstance.normalize(parsedBody)
      .catch((err) => {
        console.error(err);
        assert.equal(err.statusCode, 422);
        assert.equal(JSON.parse(err.body), "Failed due to invalid Census properties");
        parsedBody["Census"][1]["Gender"] = "Female";
        done();
      });
    });

    it("rejects invalid phone number", function(done) {
      parsedBody["Census"][1]["Phone"] = "1342341233";
      sWInstance.normalize(parsedBody)
      .catch((err) => {
        console.error(err);
        assert.equal(err.statusCode, 422);
        assert.equal(JSON.parse(err.body), "Failed due to invalid phone number in Census properties");
        parsedBody["Census"][1]["Phone"] = "949-234-5023";
        done();
      });
    })

    it("rejects invalid gender", function(done) {
      parsedBody["Census"][1]["Gender"] = "invalidGender";
      sWInstance.normalize(parsedBody)
      .catch((err) => {
        console.error(err);
        assert.equal(err.statusCode, 422);
        assert.equal(JSON.parse(err.body), "Failed due to invalid gender in Census properties");
        parsedBody["Census"][1]["Gender"] = "Female";
        done();
      });
    });  

    it("rejects invalid date format", function(done) {
      parsedBody["Census"][1]["DOB"] = "21/1/1994";
      sWInstance.normalize(parsedBody)
      .catch((err) => {
        console.error(err);
        assert.equal(err.statusCode, 422);
        assert.equal(JSON.parse(err.body), "Failed due to invalid date format in Census properties");
        parsedBody["Census"][1]["DOB"] = "02/26/1970";
        done();
      });
    });

    it("resolves normalized data", function(done) {
      sWInstance.normalize(parsedBody)
      .then((normalizedData) => {
        console.error(normalizedData);
        assert.equal(normalizedData.countTotal, 2);
        done();
      });
    });
  });

  describe("servicesWrapper.writeLog(filename, logData)", function() {
    it("rejects fs writeFile error", function(done) {
      done();
    });

    it("resolves logged data", function(done) {
      done();
    });
  });

  describe("servicesWrapper.postCensusKit(normalizedData)", function() {
    it("rejects https request error", function(done) {
      done();
    });

    it("resolves Census kit response", function(done) {
      done();
    });
  });

  describe("servicesWrapper.run()", function() {
    it("resolves census kit response", function(done) {
      done();
    });
  });

  describe("servicesWrapperHandler", function() {
    it("resolves census kit response", function(done) {
      done();
    });
  });
});