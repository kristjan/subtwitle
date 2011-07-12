Subtwitle = (function() {
  var init = function() {
    $('form').submit(fillTweets);
    $('#username').focus();
    if ($('#username').val().length > 0) $('form').submit();
  };

  var clearTweets = function() {
    $('.caption.loaded').remove();
  };

  var fillTweets = function(evt) {
    evt.preventDefault();
    $.jTwitter($('#username').val(), 25, function(tweets) {
      clearTweets();

      $.each(tweets, function(i, tweet){
        var newTweet = $('#captions .caption:first').clone()
        newTweet.find('.tweet').text(tweet.text);
        newTweet.addClass('loaded');
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
        var images = data.responseData.results
        images = $.grep(images, photobucketImage, true);
        images = images.sort(imageSort);
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

  var loadPhotos = function() {
    $('.person').each(function(i, person) {
      person = $(person);
      var username = person.clone().removeClass('person').attr('class');
      $.jTwitter(username, 0, function(tweets) {
        var img = person.find('img');
        var photo = tweets[0].user.profile_image_url;
        img.attr('src', photo);
      });
    });
  };

  var photobucketImage = function(img) {
    return img.url.match(/photobucket\.com/);
  };

  var squareness = function(img) {
    var ratio = parseInt(img.height)/parseInt(img.width);
    return (ratio < 1) ? 1/ratio : ratio;
  };

  return {
    init: init,
    loadPhotos: loadPhotos
  };
})();

$(document).ready(function() {
  Subtwitle.init();
  Subtwitle.loadPhotos();
});
