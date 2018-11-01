/*
Created By:Kunal Dwivedi on 27/10/2018
*/

//Declaration
const express = require('express');
const app = express();
var twitter = require('twitter');

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

//Async request
app.get('/loaddata', function (req, res)
{
  var funcvalue,output;
  twitter.get('search/tweets', {q: 'earthquake'}, function(error, tweets, response) {


    if(response.statusCode==429){
      res.send("Too many requests");
    }
   else{
     var op='';
     for(var i in tweets.statuses){

    var output="<tr>";
    output+="<td>"+tweets.statuses[i].user.name+"</td>";
    output+="<td>"+tweets.statuses[i].text+"</td>";
    output+="<td>"+tweets.statuses[i].created_at+"</td>";
    output+="<td>"+tweets.statuses[i].user.location+"</td>";
    output+="</tr>";
    if(tweets.statuses[0].created_at==newpost){
      output="";
    }
    op+=output;
  }
    newpost=tweets.statuses[0].created_at;
    res.send(op);
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
