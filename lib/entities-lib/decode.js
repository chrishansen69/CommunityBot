'use strict';
const entityMap = require('../entities-maps/entities.json'),
    legacyMap = require('../entities-maps/legacy.json'),
    xmlMap    = require('../entities-maps/xml.json'),
    decodeCodePoint = require('./decode_codepoint.js');

const decodeXMLStrict  = getStrictDecoder(xmlMap),
    decodeHTMLStrict = getStrictDecoder(entityMap);

function getStrictDecoder(map){
	let keys = Object.keys(map).join('|');
	const replace = getReplacer(map);

	keys += '|#[xX][\\da-fA-F]+|#\\d+';

	const re = new RegExp('&(?:' + keys + ');', 'g');

	return function(str){
		return String(str).replace(re, replace);
	};
}

const decodeHTML = (function(){
	const legacy = Object.keys(legacyMap)
		.sort(sorter);

	const keys = Object.keys(entityMap)
		.sort(sorter);

	for(let i = 0, j = 0; i < keys.length; i++){
		if(legacy[j] === keys[i]){
			keys[i] += ';?';
			j++;
		} else {
			keys[i] += ';';
		}
	}

	const re = new RegExp('&(?:' + keys.join('|') + '|#[xX][\\da-fA-F]+;?|#\\d+;?)', 'g'),
	    replace = getReplacer(entityMap);

	function replacer(str){
		if(str.substr(-1) !== ';') str += ';';
		return replace(str);
	}

	//TODO consider creating a merged map
	return function(str){
		return String(str).replace(re, replacer);
	};
}());

function sorter(a, b){
	return a < b ? 1 : -1;
}

function getReplacer(map){
	return function replace(str){
		if(str.charAt(1) === '#'){
			if(str.charAt(2) === 'X' || str.charAt(2) === 'x'){
				return decodeCodePoint(parseInt(str.substr(3), 16));
			}
			return decodeCodePoint(parseInt(str.substr(2), 10));
		}
		return map[str.slice(1, -1)];
	};
}

module.exports = {
	XML: decodeXMLStrict,
	HTML: decodeHTML,
	HTMLStrict: decodeHTMLStrict
};