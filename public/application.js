Subtwitle = (function() {
  var init = function() {
    window.onpopstate = statePopped;
    $('form').submit(fireForm);
    loadTweets();
    $('#username').focus();
  };

  var clearTweets = function() {
    $('.caption.loaded, a.more').remove();
  };

  var fireForm = function(evt) {
    evt.preventDefault();
    loadUser($('#username').val());
  };

  var pageLoaded = false;
  var statePopped = function(evt) {
    if (evt.state || pageLoaded) loadTweets();
    pageLoaded = true;
  };

  var firstTime = true;
  var loadTweets = function() {
    var match = /\/t\/(\d+)(\/.*)?/.exec(document.URL);
    if (match) {
      var image_url = match[2]
      if (image_url) image_url = image_url.slice(1); // Remove leading '/'
      loadSingleTweet(match[1], image_url);
    } else {
      var urlParts = document.URL.split('/');
      var username = urlParts[urlParts.length - 1];
      loadUser(username, true);
    }
    if (!firstTime) _gaq.push(['_trackPageview', location.pathname]);
    firstTime = false;
  };

  var historyAvailable = function() {
    return !!(window.history && history.pushState);
  }

  var loadUser = function(username, popped) {
    if (username.length == 0) return;
    if (historyAvailable() && !popped) {
      window.history.pushState(
        username, 'Subtwitle/' + username, '/' + username);
    } else {
      var newUrl = location.protocol + '//' + location.host + '/' + username;
      if (window.location != newUrl) {
        window.location = newUrl;
        return;
      }
    }
    $.jTwitter.timeline(username, 25, function(tweets) {
      clearTweets();
      $.each(tweets, function(i, tweet){
        createCaption(tweet);
      });
      $('#username').val(username).focus();
    });
  };

  var loadSingleTweet = function(tweet_id, image_url) {
    $.jTwitter.tweet(tweet_id, function(tweet) {
      clearTweets();
      caption = createCaption(tweet, image_url);
      var username = tweet.user.screen_name;
      var more = $("<a>").
        text('See more from @' + username).
        attr('href',
             location.protocol + '//' + location.host + '/' + username).
        addClass('more').
        insertAfter(caption);
      more.click(function(evt) {
        evt.preventDefault();
        $('#username').val(username);
        $('form').submit();
        $(this).remove();
      });
    });
  };

  var createCaption = function(tweet, image_url) {
    var caption = $('#captions .caption:first').clone()
    caption.attr('data-tweet-id', tweet.id_str);
    caption.find('.tweet').text(tweet.text);
    if (typeof (image_url) === 'undefined' || image_url.length == 0) {
      findImage(caption);
    } else {
      image_url = revealImageExtension(image_url);
      caption.find('img').attr('src', image_url);
      setTweetLink(caption);
    }
    caption.addClass('loaded');
    caption.appendTo('#captions');
    caption.show();
    return caption;
  };

  var findImage = function(caption) {
    var words = $.grep(caption.find('.tweet').text().split(' '), goodWord);
    $.googli(words.join(' ') + ' funny', function(data) {
      if(data.responseData.results.length > 0) {
        var images = data.responseData.results
        images = $.grep(images, photobucketImage, true);
        images = images.sort(imageSort);
        caption.find('img').attr('src', images[0].url);
        setTweetLink(caption);
      } else {
        caption.find('img').remove();
      }
    });
  };

  var setTweetLink = function(caption) {
    var tweetLink = caption.find('.tweet_link');
    var tweet_id = caption.attr('data-tweet-id');
    var url = location.protocol + '//' + location.host + '/t/' + tweet_id
    var image = caption.find('img');
    if (image.length > 0) url += '/' + image.attr('src');
    url = hideImageExtension(url);
    tweetLink.attr('href',
      'http://twitter.com/intent/tweet' + '?' + $.param({
        text : "Just found an awesome Subtwitle",
        url : url
      })
    );
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

  IMAGE_EXTENSION_RE = /\.([^.]+)$/
  var hideImageExtension = function(url) {
    var match = IMAGE_EXTENSION_RE.exec(url);
    if (match && match[1].length < 5) {
      url = url.replace(IMAGE_EXTENSION_RE, '_$1')
    }
    return url;
  };

  HIDDEN_IMAGE_EXTENSION_RE = /_([^_]+)$/
  var revealImageExtension = function(url) {
    var match = HIDDEN_IMAGE_EXTENSION_RE.exec(url);
    if (match && match[1].length < 5) {
      url = url.replace(HIDDEN_IMAGE_EXTENSION_RE, '.$1');
    }
    return url;
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
