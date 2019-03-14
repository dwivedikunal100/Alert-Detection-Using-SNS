var NodeGeocoder = require("node-geocoder");
var twitter = require("./gettweet.js");
var options = {
  provider: "google",
  httpAdapter: "https",
  apiKey: "Your API key here",
  formatter: null
};
var geocoder = NodeGeocoder(options);

var methods = {};

methods.locator = function(callback) {
  twitter.gettweet(function(response) {
    if (response.statusCode != 200) {
      console.log("No request made to google maps");
      return callback(response);
    } else {
      console.log("Request made to google maps");
      geocoder.geocode(response.location, function(err, data) {
        if (err) {
          console.log("Error occured........" + err);
          return callback({
            statusCode: 400,
            statusMessage: JSON.stringify(err)
          });
        } else {
          console.log("Location successfully returned...");
          console.log(data);
          return callback({
            statusCode: 200,
            latitude: data[0].latitude,
            longitude: data[0].longitude
          });
        }
      });
    }
  });
};

module.exports = methods;
