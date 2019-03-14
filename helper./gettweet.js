var twitter = require("twitter");

var twitter = new twitter({
  consumer_key: "*********************",
  consumer_secret: "**********************************",
  access_token_key: "*********************************",
  access_token_secret: "****************"
});//use twitter keys

var methods = {};

methods.twitter = twitter;

methods.gettweet = function(callback) {
  twitter.get("search/tweets", { q: "earthquake", count: 1 }, function(
    error,
    tweets,
    response
  ) {
    console.log("Request made to twitter....");
    if (error) {
      console.log("Error occurred...." + error.errno);
      return callback({ statusCode: 404, statusMessage: error.errno });
    } else if (response.statusCode != 200) {
      console.log("Error occured...." + response.statusMessage);
      return callback({
        statusCode: 404,
        statusMessage: response.statusMessage + " Try again later...."
      });
    } else if (tweets.statuses.length === 0) {
      console.log("No tweets returned....");
      return callback({
        statusCode: 404,
        statusMessage: "No tweets returned try again later....."
      });
    } else {
      console.log("Tweet returned successfully....");
      //profile_image_url friends_count: 76
      return callback({
        statusCode: 200,
        statusMessage: "Success",
        user: tweets.statuses[0].user.name,
        text: tweets.statuses[0].text,
        created_at: tweets.statuses[0].created_at,
        location: tweets.statuses[0].user.location,
        profile_image: tweets.statuses[0].user.profile_image_url
      });
    }
  });
};

module.exports = methods;
