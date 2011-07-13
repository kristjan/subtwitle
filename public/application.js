Subtwitle = (function() {
  var init = function() {
    $('form').submit(fireForm);
    $('#username').focus();
    if ($('#username').val().length > 0) $('form').submit();
    window.onpopstate = loadLastUser;
  };

  var clearTweets = function() {
    $('.caption.loaded').remove();
  };

  var fireForm = function(evt) {
    evt.preventDefault();
    loadUser($('#username').val());
  };

  var loadLastUser = function(evt) {
    var urlParts = document.URL.split('/');
    var username = urlParts[urlParts.length - 1];
    loadUser(username, true);
  };

  var loadUser = function(username, popped) {
    $.jTwitter(username, 25, function(tweets) {
      clearTweets();
      if (!popped) {
        window.history.pushState(username, 'Subtwitle/' + username,
                                 '/' + username);
      }
      $('#username').val(username).focus();

      $.each(tweets, function(i, tweet){
        var newTweet = $('#captions .caption:first').clone()
        newTweet.find('.tweet').text(tweet.text);
        var tweetButton = newTweet.find('.twitter-share-button');
        tweetButton.attr('href',
          tweetButton.attr('href') + '?' + $.param({
            text : "Just found an awesome caption on Subtwitle",
            url : document.URL
          })
        );
        newTweet.addClass('loaded');
        newTweet.appendTo('#captions');
        findImage(newTweet);
        newTweet.show();
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
        if (tweets.length > 0) {
          var img = person.find('img');
          var photo = tweets[0].user.profile_image_url;
          img.attr('src', photo);
        }
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
