//class/handler/object names could be better.
"use strict";
const fs = require("fs");
const https = require("https");
const moment = require("moment");
const customer_id = "105928";
const campaign_id = "0250598";
const transcodedFilename = "/tmp/transcoded.json";
const resultFilename = "/tmp/result.json";
class servicesWrapper {

  constructor(event) {
    this.body = event.body;
  }

  parse(body) {
    return new Promise((resolve, reject) => {
      let parsedBody;
      try{
        parsedBody = JSON.parse(body);
        this.xApiKey = parsedBody["api-key"];
        console.log(parsedBody);
        return resolve(parsedBody);
      } catch(e) {
        console.error(e);
        return reject({"statusCode": 400, "body": JSON.stringify("Failed to parse body: Invalid JSON")});
      }
    });
  }

  normalize(parsedBody) {
    return new Promise((resolve, reject) => {
      //will match US as well as non-US phone numbers
      console.log(parsedBody);
      let normalizedRows = [];
      let normalizedData;
      let phoneNumberRegex = /(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}/;
      //how to confirm real address without 3rd party library?
      //is it required?
      //robust validation vs extra dependency?
      let genderEnum = ["male", "female"];
      if(!parsedBody["api-key"]) {
        console.error("Failed due to missing api-key");
        return reject({"statusCode": 422, "body": JSON.stringify("Failed due to missing api-key")});
      }
      if(!parsedBody["Census"]) {
        console.error("Failed due to missing Census");
        return reject({"statusCode": 422, "body": JSON.stringify("Failed due to missing Census")});
      }
      for(let i = 0; i < parsedBody["Census"].length; i++) {
        if(!parsedBody["Census"][i]["Phone"] || !parsedBody["Census"][i]["Address"] || !parsedBody["Census"][i]["Name"] || !parsedBody["Census"][i]["DOB"] || !parsedBody["Census"][i]["Gender"]) {
          console.error("Failed due to missing Census properties");
          return reject({"statusCode": 422, "body": JSON.stringify("Failed due to missing Census properties")});
        }
        if(typeof parsedBody["Census"][i]["Phone"] !== "string" || typeof parsedBody["Census"][i]["Address"] !== "string" || typeof parsedBody["Census"][i]["Name"] !== "string" || typeof parsedBody["Census"][i]["DOB"] !== "string" || typeof parsedBody["Census"][i]["Gender"] !== "string") {
          console.error("Failed due to invalid Census properties");
          return reject({"statusCode": 422, "body": JSON.stringify("Failed due to invalid Census properties")});
        }
        if(!phoneNumberRegex.test(parsedBody["Census"][i]["Phone"])) {
          console.error("Failed due to invalid phone number in Census properties");
          return reject({"statusCode": 422, "body": JSON.stringify("Failed due to invalid phone number in Census properties")});
        }
        if(genderEnum.indexOf(parsedBody["Census"][i]["Gender"].toLowerCase()) < 0) {
          console.error("Failed due to invalid gender in Census properties");
          return reject({"statusCode": 422, "body": JSON.stringify("Failed due to invalid gender in Census properties")});
        }
        if(!moment(parsedBody["Census"][i]["DOB"], "MM/DD/YYYY", true).isValid()) {
          console.error("Failed due to invalid date format in Census properties");
          return reject({"statusCode": 422, "body": JSON.stringify("Failed due to invalid date format in Census properties")});
        }
        normalizedRows.push({pii: parsedBody["Census"][i]});
      }
      normalizedData = {
        "rows": normalizedRows,
        "countTotal": parsedBody["Census"].length,
        "metaData": {
          "meta_group_name": "test name", 
          "meta_group_number": "123", 
          "meta_group_zip": "55555", 
          "meta_quote_date": "08/27/2019", 
        }
      };
      console.log(normalizedData);
      return resolve(JSON.stringify(normalizedData));
    });
  }

  writeLog(filename, logData) {
    return new Promise((resolve, reject) => {
      console.log("Writing file to /tmp directory...");
      fs.writeFile(filename, logData, function (writeErr) {
        if (writeErr) {
          console.error(writeErr);
          return reject({"statusCode": 400, "body": JSON.stringify("Failed to write file: " + filename)});
        }
        console.log("Successfully wrote file to tmp directory");
        return resolve(logData);
      });
    });
  }

  postCensusKit(normalizedData) {
    return new Promise((resolve, reject) => {
      //https://api.alumai.com/census/v1/customer/{customer_id}/campaign/{campaign_id}/inline[/test]
      let customPath = "/census/v1/customer/" + customer_id + "/campaign/" + campaign_id + "/inline/test";
      let options = {
        "hostname": "api.alumai.com",
        "port": 443,
        "path": customPath,
        "method": "POST",
        "headers": {
           "Content-Type": "application/json",
           "Content-Length": normalizedData.length,
           "x-api-key": this.xApiKey
        }
      };
      let request = https.request(options, (censusKitResponse) => {
        console.log("statusCode:", censusKitResponse.statusCode);
        let censusKitData = "";
        censusKitResponse.on('data', (piece) => {
          censusKitData += piece;
        });
        censusKitResponse.on('end', function () {
          console.log("CENSUS KIT DATA:", censusKitData);
          return resolve(censusKitData);
        });
      });

      request.on('error', (e) => {
        console.error("HTTPS request error: " + e);
        return reject({"statusCode": 400, "body": JSON.stringify("Failed to contact Census Kit API")});
      });
      request.write(normalizedData);
      request.end();
    });
  }

  run() {
    return this.parse(this.body)
    .then((parsedBody) => {
      console.log(parsedBody);
      return this.normalize(parsedBody);
    })
    .then((normalizedData) => {
      console.log(normalizedData);
      return this.writeLog(transcodedFilename, normalizedData);
    })
    .then((loggedNormalizedData) => { 
      return this.postCensusKit(loggedNormalizedData);
    })
    .then((censusKitResponse) => {
      return this.writeLog(resultFilename, censusKitResponse);
    })
    .then((loggedCensusKitResponse) => {
      return loggedCensusKitResponse;
    });
  }
}
module.exports = servicesWrapper;