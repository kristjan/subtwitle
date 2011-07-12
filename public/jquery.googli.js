/* Adapted from http://jsfiddle.net/FX79h/2/ */

(function($){
  var iURL = "http://ajax.googleapis.com/ajax/services/search/images";

	$.extend( {
		googli: function(query, callback) {
      $.ajax({
        url: iURL,
        type: 'GET',
        dataType: 'jsonp',
        data: {
            v:  '1.0',
            q:  query,
            format: 'json',
            jsoncallback:  '?'
        },
        success: function(data){
          callback(data);
        }
      });
    }
  })
})(jQuery);
