const servicesWrapper = require("../Lib/servicesWrapper.js");
const servicesWrapperHandler = require("../Handlers/servicesWrapperHandler.js");
const chai = require("chai");
const assert = chai.assert;
let sWInstance;
let event;
let parsedBody;
let normalizedData;

describe("servicesWrapper", function() {
  before(function(done) {
    //use this api-key instead of const
    event = {
      "body": JSON.stringify({
        "api-key": "8QhnVrqe9p4B5ci3R06NR7QNpJgQ2tnc1kMQD7Lw",
        "Census": [
          {
            "Phone": "649-444-4928",
            "Address": "473 Pine St Fl 2, San Francisco, CA 94114",
            "Name": "Jason Smith",
            "DOB": "02/26/1970",
            "Gender": "Male"
          },
          {
            "Phone": "949-234-5023",
            "Address": "1687 Wylie Ln, Draper, UT 84020",
            "Name": "Jannet Maquask",
            "DOB": "11/05/1964",
            "Gender": "Female"
          }
        ]
      })
    };
    sWInstance = new servicesWrapper(event);
    done();
  })

  describe("servicesWrapper.parse(body)", function() {
    it("resolves parsed JSON string", function(done) {
      console.log(sWInstance);
      sWInstance.parse(event.body)
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
      let invalidJson = {"invalidJson": "invalid"};
      sWInstance.parse({"invalidJson": "invalid"})
      .then((res) => {
        console.log(res);
        assert.fail();
        done();
      })
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
      .then((res) => {
        console.log(res);
        assert.fail();
        done();
      })
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
      .then((res) => {
        console.log(res);
        assert.fail();
        done();
      })
      .catch((err) => {
        console.error(err);
        assert.equal(err.statusCode, 422);
        assert.equal(JSON.parse(err.body), "Failed due to missing Census");
        parsedBody["Census"] = [
          {
            "Phone": "649-444-4928",
            "Address": "473 Pine St Fl 2, San Francisco, CA 94114",
            "Name": "Jason Smith",
            "DOB": "02/26/1970",
            "Gender": "Male"
          },
          {
            "Phone": "949-234-5023",
            "Address": "1687 Wylie Ln, Draper, UT 84020",
            "Name": "Jannet Maquask",
            "DOB": "11/05/1964",
            "Gender": "Female"
          }
        ];
        done();
      });
    });

    it("rejects missing Census properties (phone)", function(done) {
      parsedBody["Census"][1]["Phone"] = undefined;
      sWInstance.normalize(parsedBody)
      .then((res) => {
        console.log(res);
        assert.fail();
        done();
      })
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
      .then((res) => {
        console.log(res);
        assert.fail();
        done();
      })
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
      .then((res) => {
        console.log(res);
        assert.fail();
        done();
      })
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
      .then((res) => {
        console.log(res);
        assert.fail();
        done();
      })
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
      .then((res) => {
        console.log(res);
        assert.fail();
        done();
      })
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
      .then((res) => {
        console.log(res);
        assert.fail();
        done();
      })
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
      .then((res) => {
        console.log(res);
        assert.fail();
        done();
      })
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
      .then((res) => {
        console.log(res);
        assert.fail();
        done();
      })
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
      .then((res) => {
        console.log(res);
        assert.fail();
        done();
      })
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
      .then((res) => {
        console.log(res);
        assert.fail();
        done();
      })
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
      .then((res) => {
        console.log(res);
        assert.fail();
        done();
      })
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
      .then((res) => {
        console.log(res);
        assert.fail();
        done();
      })
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
      .then((res) => {
        console.log(res);
        assert.fail();
        done();
      })
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
      .then((normalizedDataRet) => {
        console.log(normalizedDataRet);
        normalizedData = normalizedDataRet;
        assert.equal(JSON.parse(normalizedDataRet).countTotal, 2);
        done();
      })
      .catch((err) => {
        console.error(err);
        assert.fail();
        done();
      });
    });
  });

  describe("servicesWrapper.writeLog(filename, logData)", function() {
    it("resolves logged transcoded data", function(done) {
      sWInstance.writeLog("transcoded.json", JSON.stringify({json: "json", foo: "bar"}))
      .then((transcodedRes) => {
        console.log(transcodedRes);
        assert.equal(transcodedRes, JSON.stringify({json: "json", foo: "bar"}));
        done();
      })
      .catch((err) => {
        console.error(err);
        assert.fail();
        done();
      })
    });

    it("resolves logged result data", function(done) {
      sWInstance.writeLog("result.json", JSON.stringify({result: "results", important: "stuff"}))
      .then((resultRes) => {
        console.log(resultRes);
        assert.equal(resultRes, JSON.stringify({result: "results", important: "stuff"}));
        done();
      })
      .catch((err) => {
        console.error(err);
        assert.fail();
        done();
      })
    });
  });

  describe("servicesWrapper.postCensusKit(normalizedData)", function() {
    it("resolves Census kit response from .postCensusKit(normalizedData)", function(done) {
      console.log("normData" + normalizedData);
      sWInstance.postCensusKit(normalizedData)
      .then((res) => {
        console.log(res);
        assert.equal(JSON.parse(res).state, "completed");
        done();
      })
      .catch((err) => {
        console.error(err);
        assert.fail()
        done();
      });
    });
  });

  describe("servicesWrapper.run()", function() {
    it("resolves census kit response from .run()", function(done) {
      sWInstance.run()
      .then((res) => {
        console.log(res);
        assert.equal(JSON.parse(res).state, "completed");
        done();
      })
      .catch((err) => {
        console.error(err);
        assert.fail();
        done();
      });
    });
  });

  describe("servicesWrapperHandler", function() {
    it("resolves census kit response from .handler(event)", function(done) {
      servicesWrapperHandler.servicesWrapperHandler(event)
      .then((res) => {
        console.log(res);
        assert.equal(JSON.parse(res.body).state, "completed");
        done();
      })
      .catch((err) => {
        console.error(err);
        assert.fail();
        done();
      });
    });
  });
});