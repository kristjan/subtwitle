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
        findImage(newTweet);
      });
    });
  };

  var findImage = function(caption) {
    var words = $.grep(caption.find('.tweet').text().split(' '), goodWord);
    $.googli(words.join(' '), function(data) {
      if(data.responseData.results[0]) {
        caption.find('img').attr('src', data.responseData.results[0].url)
      } else {
        caption.find('img').hide();
      }
    });
  };

  var goodWord = function(word, i) {
    return word.length > 3 && word.length < 12;
  }

  return {
    init: init,
    fillTweets: fillTweets
  };
})();

$(document).ready(function() {
  Subtwitle.init();
});
