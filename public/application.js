Subtwitle = (function() {
  var init = function() {
    $('form').submit(fillTweets);
    $('#username').focus();
  };

  var fillTweets = function(evt) {
    evt.preventDefault();
    $.jTwitter($('#username').val(), 10, function(tweets) {
      $.each(tweets, function(i, tweet){
        var newTweet = $('#captions .caption:first').clone()
        newTweet.find('.tweet').text(tweet.text);
        newTweet.appendTo('#captions');
        newTweet.show();
      });
    });
  };

  return {
    init: init,
    fillTweets: fillTweets
  };
})();

$(document).ready(function() {
  Subtwitle.init();
});
