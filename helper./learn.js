var bayes = require("bayes");
var classifier = bayes();
var fs = require('fs');
var CsvReadableStream = require('csv-reader');
var filename = "../FINALYEARPROJECT/public/datasets/file4.csv";
var outputflename="../FINALYEARPROJECT/public/classification/classifier.json";
var inputStream = fs.createReadStream(filename, 'utf8');

inputStream
    .pipe(CsvReadableStream({ parseNumbers: true, parseBooleans: true, trim: true }))
    .on('data', function (row) {
       classifier.learn(row[0],row[1]);
    })
    .on('end', function (data) {
       var classifier_json=classifier.toJson();
        fs.writeFile(outputflename, classifier_json, function(err, data){
            if (err) console.log(err);
            console.log('Program is ready for prediction.........')
        });
    });
