'use strict';

const qs = require('querystring');

exports.get_gif = function(tags, func) {
  const params = {
    'api_key': 'dc6zaTOxFJmzC',
    'rating': 'r',
    'format': 'json',
    'limit': 1
  };
  let query = qs.stringify(params);

  if (tags !== null) {
    query += '&tag=' + tags.join('+');
  }

  const request = require('request');

  request('http://api.giphy.com/v1/gifs/random' + '?' + query, function(error, response, body) {
    if (error || response.statusCode !== 200) {
      // Logger.log('debug', response)
    } else {
      const responseObj = JSON.parse(body);
      if (responseObj.data) {
        func(responseObj.data.id);
      } else {
        func(undefined);
      }
    }
  });
};
