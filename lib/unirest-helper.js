'use strict';
const request = require('request-promise');

/**
 * Fetch an URL with unirest
 * @param  {String} url the url
 * @param  {Function} callback the function to call
 */
exports.getPage = function(url, callback) {
  request({
    url: url,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/json'
    },
    followRedirect: true,
    maxRedirects: 10
  }).then(body => {
    const response = handle(body);
    callback(response);
  }).catch(console.error);
};

/**
 * Fetch an URL with unirest, passing a differenct Accept HTML header
 * @param  {String} url the url
 * @param  {String} acceptHeader the header to pass
 * @param  {Function} callback the function to call
 */
exports.getPageB = function(url, acceptHeader = 'text/html,application/xhtml+xml', callback = function() {}) {
  request({
    url: url,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36',
      'Accept': acceptHeader
    },
    followRedirect: true,
    maxRedirects: 10
  }).then(body => {
    const response = handle(body);
    callback(response);
  }).catch(console.error);
};

exports.getMashape = function(url, apiKey, acceptHeader, callback) {
  request({
    url: url,
    headers: {
      'X-Mashape-Key': apiKey,
      'Accept': acceptHeader
    },
    followRedirect: true,
    maxRedirects: 10
  }).then(body => {
    const response = handle(body);
    callback(response);
  }).catch(console.error);
};

function handle(body) {
  const response = {
    body: body,
    raw_body: body
  };

  try {
    const c = JSON.parse(response.body);
    response.body = c;
  } catch (e) {
  }

  return response;
}