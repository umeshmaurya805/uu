var request = require("postman-request");

const output = (script, language, stdin, callback) => {
  var program = {
    code:script,
    lang:language,
    input:stdin,
    versionIndex: "0",
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  };

  request(
    {
      url: "http://15.206.27.131/compile",
      method: "POST",
      json: program,
    },

    function (error, response, body) {
      if (error) {
        callback(error, undefined);
      } else {
        callback(error, {
          // statusCode: response && response.statusCode,
          // body: body,
        });
      }
      //   console.log("error:", error);
      //   console.log("statusCode:", response && response.statusCode);
      //   console.log("body:", body);
    }
  );
};

module.exports = output;
