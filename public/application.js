Subtwitle = (function() {
  var init = function() {
    $('form').submit(fireForm);
    $('#username').focus();
    if ($('#username').val().length > 0) $('form').submit();
    window.onpopstate = loadTweets;
  };

  var clearTweets = function() {
    $('.caption.loaded').remove();
  };

  var fireForm = function(evt) {
    evt.preventDefault();
    loadUser($('#username').val());
  };

  var loadTweets = function(evt) {
    console.log('loading');
    var match = /\/t\/(\d+)(\/.*)?/.exec(document.URL);
    if (match) {
      console.log('just one');
      var image_url = match[2]
      if (image_url) image_url = image_url.slice(1); // Remove leading '/'
      loadSingleTweet(match[1], image_url);
    } else {
      var urlParts = document.URL.split('/');
      var username = urlParts[urlParts.length - 1];
      console.log('user ' + username);
      loadUser(username, true);
    }
  };

  var loadUser = function(username, popped) {
    if (username.length == 0) return;
    $.jTwitter.timeline(username, 25, function(tweets) {
      clearTweets();
      if (!popped) {
        window.history.pushState(username, 'Subtwitle/' + username,
                                 '/' + username);
      }
      $('#username').val(username).focus();

      $.each(tweets, function(i, tweet){
        createCaption(tweet);
      });
    });
  };

  var loadSingleTweet = function(tweet_id, image_url) {
    $.jTwitter.tweet(tweet_id, function(tweet) {
      createCaption(tweet, image_url);
    });
  };

  var createCaption = function(tweet, image_url) {
    var caption = $('#captions .caption:first').clone()
    caption.find('.tweet').text(tweet.text);
    tweetLink = caption.find('.tweet_link');
    tweetLink.attr('href',
      tweetLink.attr('href') + '?' + $.param({
        text : "Just found an awesome caption on Subtwitle",
        url : document.URL // Changes as we push and pop
      })
    );
    caption.addClass('loaded');
    caption.appendTo('#captions');
    if (typeof (image_url) === 'undefined' || image_url.length == 0) {
      findImage(caption);
    } else {
      caption.find('img').attr('src', image_url);
    }
    caption.show();
  };

  var findImage = function(caption) {
    var words = $.grep(caption.find('.tweet').text().split(' '), goodWord);
    $.googli(words.join(' ') + ' funny', function(data) {
      if(data.responseData.results.length > 0) {
        var images = data.responseData.results
        images = $.grep(images, photobucketImage, true);
        images = images.sort(imageSort);
        caption.find('img').attr('src', images[0].url);
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
      $.jTwitter.timeline(username, 0, function(tweets) {
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
