/*
Created By:Kunal Dwivedi on 27/10/2018
*/

//Declaration
const express = require('express');
const app = express();
var twitter = require('twitter');
var NodeGeocoder = require('node-geocoder');
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: 'AIzaSyCXLoGrNXHCazTfVETItNy95g8lJPurI4w',
  formatter: null
};
var geocoder = NodeGeocoder(options);
var twitter = new twitter({
  consumer_key: 'mOUpwzhjCGYrPpqBL03n8cbtg',
  consumer_secret: 'CFEMDfwkiMnLAO7ofi0ConXlDAmwqUmaAKkx8XQRtfQnMWxI4N',
  access_token_key: '261608471-ATGdO8ydPJ3l36vMKJgqTSecpoQZsHNIaBbXjJCJ',
  access_token_secret: 'Lwo2SrXGLHapLoXhp3LWiWELpnT1JhPcCEvEgsRmlrkKZ'
});

// front-end declarations
app.set('view engine','ejs');
app.use(express.static('public'));

//Ensure unique tweets are published
var newpost="first";

/************Async requests*********/
//for displaying tweets
app.get('/loadlocation', function (req, res)
{
  twitter.get('search/tweets', {q: 'earthquake',count:1}, function(error, tweets, response) {
    if(error){  res.send({statusCode:404,statusMessage:"INTERNET NOT WORKING"});  }
    else{
      if(response.statusCode!=200){res.send({statusCode:400,statusMessage:response.statusMessage});}
      else{
        geocoder.geocode(tweets.statuses[0].user.location, function ( err, data ) {
          if(err){res.send({statusCode:400,statusMessage:"Error: Status is OVER_QUERY_LIMIT."}); }
          else{res.send({statusCode:200,latitude:data[0].latitude,longitude:data[0].longitude});}
        });
      }
    }
  });
});


app.get('/loaddata', function (req, res)
{
  var funcvalue,output;
  twitter.get('search/tweets', {q: 'earthquake',count:1}, function(error, tweets, response) {
    if(error || tweets.statuses===undefined){
      res.send("<div class=\" alert alert-danger alert-dismissible\"> <a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">&times;</a>Internet not working</div>");
    }
    else if(response.statusCode!=200){
      res.send("<div class=\" alert alert-danger alert-dismissible\"> <a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">&times;</a>"+response.statusMessage+"</div>");
    }
    else{
      var output="<tr>";
      output+="<td>"+tweets.statuses[0].user.name+"</td>";
      output+="<td>"+tweets.statuses[0].text+"</td>";
      output+="<td>"+tweets.statuses[0].created_at+"</td>";
      output+="<td>"+tweets.statuses[0].user.location+"</td>";
      output+="</tr>";
      if(tweets.statuses[0].created_at==newpost){
        output="";
      }
      newpost=tweets.statuses[0].created_at;
      res.send(output);
    }
  });
});





//Website Redirection
app.get('/',(req, res) =>res.render('index'));
app.get('/about',(req,res)=> res.render('about'));
app.get('/displayonmap',(req,res)=>res.render('displayonmap'));
app.get('/displaytweets',(req,res)=> res.render('displaytweets'));

//Initialization
app.listen(3000, () => console.log(`Initiated @ localhost:3000`));
