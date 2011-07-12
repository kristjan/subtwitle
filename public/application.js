Subtwitle = (function() {
  var init = function() {
    $('form').submit(fillTweets);
    $('#username').focus();
  };

  var fillTweets = function(evt) {
    evt.preventDefault();
    $.jTwitter($('#username').val(), 25, function(tweets) {
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
    $.googli(words.join(' ') + ' funny', function(data) {
      if(data.responseData.results.length > 0) {
        var images = data.responseData.results.sort(imageSort);
        caption.find('img').attr('src', images[0].url)
      } else {
        caption.find('img').hide();
      }
    });
  };

  var goodWord = function(word, i) {
    if (word.match(/^[\W]/)) return false;
    return word.length > 5;
  }

  var imageSort = function(a, b) {
    return imageScore(b) - imageScore(a);
  };

  var imageScore = function(img) {
    return parseInt(img.width);
  };

  var squareness = function(img) {
    var ratio = parseInt(img.height)/parseInt(img.width);
    return (ratio < 1) ? 1/ratio : ratio;
  };

  return {
    init: init,
    fillTweets: fillTweets
  };
})();

$(document).ready(function() {
  Subtwitle.init();
});
