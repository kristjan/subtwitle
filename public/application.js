Subtwitle = (function() {
  var init = function() {
    $('form').submit(function(evt) {
      evt.preventDefault();
      $.jTwitter($('#username').val(), 10, function(tweets) {
        $.each(tweets, function(i, tweet){
          console.log(tweet.text);
        });
      });
    });

    $('#username').focus();
  };

  return {
    init: init
  };
})();

$(document).ready(function() {
  Subtwitle.init();
});
