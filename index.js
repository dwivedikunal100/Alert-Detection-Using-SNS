const express = require("express");
const app = express();
const twitter = require("./helper/gettweet.js");
const geocoder = require("./helper/getlocation.js");
const datasets = require("./helper/loaddataset.js");
var bodyParser = require("body-parser");
var nodemailer = require("nodemailer");
const fs = require("fs");
var bayes = require("bayes");
var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database("./database/database.db");

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "dwivedikunal100@gmail.com",
    pass: "*********"
  }
});

var mailOptions = {
  from: "dwivedikunal100@gmail.com",
  to: "dwivedikunal@ymail.com",
  subject: "ALERT!!!!",
  text: ""
};

var paths = require("path");
var path = paths.join(__dirname, "public/datasets");

// front-end declarations
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Ensure unique tweets are published
var newpost = "first";

/************Async requests*********/
//for displaying  on map
app.get("/loadlocation", function(req, res) {
  geocoder.locator(function(response) {
    res.send(response);
  });
});

//loading datasets
app.get("/loaddataset", function(req, res) {
  datasets.loaddataset();
  res.send("Success");
});

app.get("/stoploaddataset", function(req, res) {
  process.exit(1);
  res.send("Success");
});

//for displaying tweets
app.get("/loaddata", function(req, res) {
  twitter.gettweet(function(response) {
    if (response.statusCode === 200 && response.created_at == newpost) {
      response.duplicate = true;
    } else response.duplicate = false;
    newpost = response.created_at;
    res.send(response);
  });
});

//For predictions
app.get("/predict", function(req, res) {
  twitter.gettweet(function(response) {
    if (response.statusCode === 200 && response.created_at == newpost) {
      response.duplicate = true;
    } else response.duplicate = false;
    newpost = response.created_at;
    var outputflename =
      "../FINALYEARPROJECT/public/classification/classifier.json";
    let rawdata = fs.readFileSync(outputflename);
    var classifier = bayes.fromJson(rawdata);
    if (!response.text != "undefined") {
      var alert = classifier.categorize(response.text);
      console.log(alert);
      if (alert === "1" && !response.duplicate) {
        mailOptions.text = response.text;

        db.each("SELECT name,email,location FROM users", function(err, row) {
          console.log(row);
          mailOptions.text = "Alert " + row.name + " " + response.text;
          mailOptions.to = row.email;
          if (response.toLowerCase().indexOf(row.location.toLowerCase()) != -1)
            transporter.sendMail(mailOptions, function(error, info) {
              if (error) {
                console.log(error);
              } else {
                console.log("Email sent: " + info.response);
              }
            });
        });
      }
      response.alert = alert;
    } else {
      response.alert = "0";
    }
    res.send(response);
  });
});

app.post("/registeraction", function(req, res) {
  var query = `INSERT INTO users(name,email,location) VALUES("${
    req.body.name
  }","${req.body.email}","${req.body.location}")`;
  console.log(query);
  var stmt = db.prepare(query);
  stmt.run();
  stmt.finalize();
  console.log(`User added successfully..........`);
  res.render("register", { user_created: true });
});

//Website Redirection
app.get("/", (req, res) => res.render("index"));
app.get("/:route", function(req, res) {
  if (req.params.route !== "favicon.ico") {
    if (req.params.route === "analyzedata") {
      fs.readdir(path, function(err, items) {
        res.render(req.params.route, { datasets: items });
      });
    } else {
      res.render(req.params.route, { user_created: false });
    }
  }
});

//Initialization
app.listen(3000, () =>
  console.log("Application is running at url:localhost:3000")
);
