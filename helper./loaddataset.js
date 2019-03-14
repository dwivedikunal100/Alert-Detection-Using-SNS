const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const twitter = require("./gettweet.js").twitter;
const fs = require("fs");
var paths = require("path");
var path = paths.join(__dirname, "../public/datasets");

var filename = "../FINALYEARPROJECT/public/datasets/file";

var methods = {};

methods.loaddataset = function() {
  fs.readdir(path, function(err, items) {

    filename += items.length + 1 + ".csv";
    console.log("Dataset is loaded in file " + filename);
    const csvWriter = createCsvWriter({
      path: filename,
      header: [{ id: "text", title: "TEXT" }]
    });
    twitter.stream("statuses/filter", { track: "earthquake" }, function(
      stream
    ) {
      stream.on("data", function(tweet) {
        let data = [{ text: tweet.text }];
        csvWriter
          .writeRecords(data) // returns a promise
          .then(() => {
            console.log("Tweet written on file");
          });
      });

      stream.on("error", function(error) {
        console.log("Error occured");
      });
    });
  });
};

module.exports = methods;
