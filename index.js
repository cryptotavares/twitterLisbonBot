var Twit = require('twit');
var twitInfo = require('./config.js');
var natural = require('natural');

var twitter = new Twit(twitInfo);
var tokenizer = new natural.WordTokenizer();

var tweets;

var date1 = new Date();
console.log(date1);

function post (content) {
  twitter.post('statuses/update', { status: content }, function(err, data, response) {
  })
};

function search (query, asker) {
  var search = "Lisboa " + query + " filter:links";
  twitter.get('search/tweets', { q: search, count: 10 }, function(err, data, response) {

    var resultLink; 

    if (data.statuses[0].entities.urls.length > 0) {
      resultLink = data.statuses[0].entities.urls[0].url;
    } else {
      for (var i=0;i < data.statuses.length;i++) {
        if (data.statuses[i].entities.urls.length > 0) {
          resultLink = data.statuses[i].entities.urls[0].url;
          i = data.statuses.length;
        }
      }
    };    

    var result = "@" + asker + " Ok. Eu percebo perfeitamente... " + query + " é topo. Que tal isto? " + resultLink;
    post(result);
  })
 };

function matchRE (re, text) {
var wordArray = tokenizer.tokenize(text);
  for(var i=0;i < wordArray.length;i++) {
    if (re.test(wordArray[i])) {
      return true;
    }
  }
  return false; 
};

var stream = twitter.stream('statuses/filter', { track: '@LisbonBot' });

stream.on('tweet', function (tweet) {
  var asker = tweet.user.screen_name;
  var text = tweet.text;

  // RegExes
  var greetingRE = /^hey$/;
  var musicRE = /^clubs$/;
  var culturaRE = /^cultura$/;
  var filmRE = /^cinema$/;
  var foodRE = /^restaurantes$/;
  var partyRE = /^party$/;

  if (matchRE(culturaRE, text)) {
    search("interactive", asker);
  } else if (matchRE(filmRE, text)) {
    search("film", asker);
  } else if (matchRE(musicRE, text)) {
    search("music", asker);
  } else if (matchRE(partyRE, text)) {
    search("drink", asker);
  } else if (matchRE(foodRE, text)) {
    search("food", asker);
  } else if (matchRE(greetingRE, text)) {
    post("Hey " + "@" + asker + " . So, I've heard about some Lisbon cool topics. Or you know, whatever. [party, cultura, cinema, restuarantes, clubs]");
  } else {
  }

})

