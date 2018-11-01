var twitter = require('twitter');
const fs = require('fs');

var twitter = new twitter({
consumer_key: 'mOUpwzhjCGYrPpqBL03n8cbtg',
consumer_secret: 'CFEMDfwkiMnLAO7ofi0ConXlDAmwqUmaAKkx8XQRtfQnMWxI4N',
access_token_key: '261608471-ATGdO8ydPJ3l36vMKJgqTSecpoQZsHNIaBbXjJCJ',
access_token_secret: 'Lwo2SrXGLHapLoXhp3LWiWELpnT1JhPcCEvEgsRmlrkKZ'
});


var search = "earthquake"

//Stream data
twitter.stream('statuses/filter', {track: search}, function(stream) {
stream.on('data', function(tweet) {
console.log(tweet.text);
});
stream.on('error', function(error) {
});
});


//twitter.get('search/tweets', {q: 'earthquake'}, function(error, tweets, response) {console.log(tweets);});





/*
//Getting keys from json object
var op=Object.keys(tweets);
console.log(op);
*/

/*
//Saving JSON to file
  let data = JSON.stringify(tweet);
  fs.writeFileSync('student.json', data);
*/
