'use strict';

/* jshint varstmt: false */

function fasthash_js(str) {
  let hash = 5381,
      i    = str.length;

  while(i)
    hash = (hash * 33) ^ str.charCodeAt(--i);

  /* JavaScript does bitwise operations (like XOR, above) on 32-bit signed
   * integers. Since we want the results to be always positive, convert the
   * signed int to an unsigned by doing an unsigned bitshift. */
  return hash >>> 0;
}



// Simple but unreliable function to create string hash by Sergey.Shuchkin [t] gmail.com
// alert( strhash('http://www.w3schools.com/js/default.asp') ); // 6mn6tf7st333r2q4o134o58888888888
function strhash( str ) {
    if (str.length % 32 > 0) str += Array(33 - str.length % 32).join('z');
    var i, j, k, a, ch; i = j = k = a = 0;
    var hash = '', bytes = [], dict = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','1','2','3','4','5','6','7','8','9'];
    for (i = 0; i < str.length; i++ ) {
        ch = str.charCodeAt(i);
        bytes[j++] = (ch < 127) ? ch & 0xFF : 127;
    }
    var chunk_len = Math.ceil(bytes.length / 32);   
    for (i=0; i<bytes.length; i++) {
        j += bytes[i];
        k++;
        if ((k == chunk_len) || (i == bytes.length-1)) {
            a = Math.floor( j / k );
            if (a < 32)
                hash += '0';
            else if (a > 126)
                hash += 'z';
            else
                hash += dict[  Math.floor( (a-32) / 2.76) ];
            j = k = 0;
        }
    }
    return hash;
}

/* hashCode by http://stackoverflow.com/users/353872/fordi */

function toHex(n) {
    var ret = ((n<0?0x8:0)+((n >> 28) & 0x7)).toString(16) + (n & 0xfffffff).toString(16);
    while (ret.length < 8) ret = '0'+ret;
    return ret;
}
function hashCode(o, l) {
    l = l || 2;
    var i, c, r = [];
    for (i=0; i<l; i++)
        r.push(i*268803292);
    function stringify(o) {
        var i,r;
        if (o === null) return 'n';
        if (o === true) return 't';
        if (o === false) return 'f';
        if (o instanceof Date) return 'd:'+(0+o);
        i=typeof o;
        if (i === 'string') return 's:'+o.replace(/([\\\\;])/g,'\\$1');
        if (i === 'number') return 'n:'+o;
        if (o instanceof Function) return 'm:'+o.toString().replace(/([\\\\;])/g,'\\$1');
        if (o instanceof Array) {
            r=[];
            for (i=0; i<o.length; i++) 
                r.push(stringify(o[i]));
            return 'a:'+r.join(';');
        }
        r=[];
        for (i in o) {
            r.push(i+':'+stringify(o[i]));
        }
        return 'o:'+r.join(';');
    }
    o = stringify(o);
    for (i=0; i<o.length; i++) {
        for (c=0; c<r.length; c++) {
            r[c] = (r[c] << 13)-(r[c] >> 19);
            r[c] += o.charCodeAt(i) << (r[c] % 24);
            r[c] = r[c] & r[c];
        }
    }
    for (i=0; i<r.length; i++) {
        r[i] = toHex(r[i]);
    }
    return r.join('');
}


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  SHA-1 implementation in JavaScript                  (c) Chris Veness 2002-2014 / MIT Licence  */
/*                                                                                                */
/*  - see http://csrc.nist.gov/groups/ST/toolkit/secure_hashing.html                              */
/*        http://csrc.nist.gov/groups/ST/toolkit/examples.html                                    */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

/**
 * SHA-1 hash function reference implementation.
 *
 * @namespace
 */
var Sha1 = {};


/**
 * Generates SHA-1 hash of string.
 *
 * @param   {string} msg - (Unicode) string to be hashed.
 * @returns {string} Hash of msg as hex character string.
 */
Sha1.hash = function(msg) {
    // convert string to UTF-8, as SHA only deals with byte-streams
    //msg = msg.utf8Encode();

    // constants [§4.2.1]
    var K = [ 0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xca62c1d6 ];

    // PREPROCESSING

    msg += String.fromCharCode(0x80);  // add trailing '1' bit (+ 0's padding) to string [§5.1.1]

    // convert string msg into 512-bit/16-integer blocks arrays of ints [§5.2.1]
    var l = msg.length/4 + 2; // length (in 32-bit integers) of msg + ‘1’ + appended length
    var N = Math.ceil(l/16);  // number of 16-integer-blocks required to hold 'l' ints
    var M = new Array(N);

    for (var i=0; i<N; i++) {
        M[i] = new Array(16);
        for (var j=0; j<16; j++) {  // encode 4 chars per integer, big-endian encoding
            M[i][j] = (msg.charCodeAt(i*64+j*4)<<24) | (msg.charCodeAt(i*64+j*4+1)<<16) |
                (msg.charCodeAt(i*64+j*4+2)<<8) | (msg.charCodeAt(i*64+j*4+3));
        } // note running off the end of msg is ok 'cos bitwise ops on NaN return 0
    }
    // add length (in bits) into final pair of 32-bit integers (big-endian) [§5.1.1]
    // note: most significant word would be (len-1)*8 >>> 32, but since JS converts
    // bitwise-op args to 32 bits, we need to simulate this by arithmetic operators
    M[N-1][14] = ((msg.length-1)*8) / Math.pow(2, 32); M[N-1][14] = Math.floor(M[N-1][14]);
    M[N-1][15] = ((msg.length-1)*8) & 0xffffffff;

    // set initial hash value [§5.3.1]
    var H0 = 0x67452301;
    var H1 = 0xefcdab89;
    var H2 = 0x98badcfe;
    var H3 = 0x10325476;
    var H4 = 0xc3d2e1f0;

    // HASH COMPUTATION [§6.1.2]

    var W = new Array(80); var a, b, c, d, e;
    for (i=0; i<N; i++) {

        // 1 - prepare message schedule 'W'
        for (var t=0;  t<16; t++) W[t] = M[i][t];
        for (t=16; t<80; t++) W[t] = Sha1.ROTL(W[t-3] ^ W[t-8] ^ W[t-14] ^ W[t-16], 1);

        // 2 - initialise five working variables a, b, c, d, e with previous hash value
        a = H0; b = H1; c = H2; d = H3; e = H4;

        // 3 - main loop
        for (t=0; t<80; t++) {
            var s = Math.floor(t/20); // seq for blocks of 'f' functions and 'K' constants
            var T = (Sha1.ROTL(a,5) + Sha1.f(s,b,c,d) + e + K[s] + W[t]) & 0xffffffff;
            e = d;
            d = c;
            c = Sha1.ROTL(b, 30);
            b = a;
            a = T;
        }

        // 4 - compute the new intermediate hash value (note 'addition modulo 2^32')
        H0 = (H0+a) & 0xffffffff;
        H1 = (H1+b) & 0xffffffff;
        H2 = (H2+c) & 0xffffffff;
        H3 = (H3+d) & 0xffffffff;
        H4 = (H4+e) & 0xffffffff;
    }

    return Sha1.toHexStr(H0) + Sha1.toHexStr(H1) + Sha1.toHexStr(H2) +
           Sha1.toHexStr(H3) + Sha1.toHexStr(H4);
};


/**
 * Function 'f' [§4.1.1].
 * @private
 */
Sha1.f = function(s, x, y, z)  {
    switch (s) {
        case 0: return (x & y) ^ (~x & z);           // Ch()
        case 1: return  x ^ y  ^  z;                 // Parity()
        case 2: return (x & y) ^ (x & z) ^ (y & z);  // Maj()
        case 3: return  x ^ y  ^  z;                 // Parity()
    }
};

/**
 * Rotates left (circular left shift) value x by n positions [§3.2.5].
 * @private
 */
Sha1.ROTL = function(x, n) {
    return (x<<n) | (x>>>(32-n));
};


/**
 * Hexadecimal representation of a number.
 * @private
 */
Sha1.toHexStr = function(n) {
    // note can't use toString(16) as it is implementation-dependant,
    // and in IE returns signed numbers when used on full words
    var s='', v;
    for (var i=7; i>=0; i--) { v = (n>>>(i*4)) & 0xf; s += v.toString(16); }
    return s;
};


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */


///** Extend String object with method to encode multi-byte string to utf8
// *  - monsur.hossa.in/2012/07/20/utf-8-in-javascript.html */
//if (typeof String.prototype.utf8Encode == 'undefined') {
//    String.prototype.utf8Encode = function() {
//        return unescape( encodeURIComponent( this ) );
//    };
//}
//
///** Extend String object with method to decode utf8 string to multi-byte */
//if (typeof String.prototype.utf8Decode == 'undefined') {
//    String.prototype.utf8Decode = function() {
//        try {
//            return decodeURIComponent( escape( this ) );
//        } catch (e) {
//            return this; // invalid UTF-8? return as-is
//        }
//    };
//}


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
//if (typeof module != 'undefined' && module.exports) module.exports = Sha1; // CommonJs export
//if (typeof define == 'function' && define.amd) define([], function() { return Sha1; }); // AMD





// 
// 
// MD5 Algorithm from http://www.myersdaily.org/joseph/javascript/md5-text.html
// 
// 




function md5cycle(x, k) {
  var a = x[0],
    b = x[1],
    c = x[2],
    d = x[3];

  a = ff(a, b, c, d, k[0], 7, -680876936);
  d = ff(d, a, b, c, k[1], 12, -389564586);
  c = ff(c, d, a, b, k[2], 17, 606105819);
  b = ff(b, c, d, a, k[3], 22, -1044525330);
  a = ff(a, b, c, d, k[4], 7, -176418897);
  d = ff(d, a, b, c, k[5], 12, 1200080426);
  c = ff(c, d, a, b, k[6], 17, -1473231341);
  b = ff(b, c, d, a, k[7], 22, -45705983);
  a = ff(a, b, c, d, k[8], 7, 1770035416);
  d = ff(d, a, b, c, k[9], 12, -1958414417);
  c = ff(c, d, a, b, k[10], 17, -42063);
  b = ff(b, c, d, a, k[11], 22, -1990404162);
  a = ff(a, b, c, d, k[12], 7, 1804603682);
  d = ff(d, a, b, c, k[13], 12, -40341101);
  c = ff(c, d, a, b, k[14], 17, -1502002290);
  b = ff(b, c, d, a, k[15], 22, 1236535329);

  a = gg(a, b, c, d, k[1], 5, -165796510);
  d = gg(d, a, b, c, k[6], 9, -1069501632);
  c = gg(c, d, a, b, k[11], 14, 643717713);
  b = gg(b, c, d, a, k[0], 20, -373897302);
  a = gg(a, b, c, d, k[5], 5, -701558691);
  d = gg(d, a, b, c, k[10], 9, 38016083);
  c = gg(c, d, a, b, k[15], 14, -660478335);
  b = gg(b, c, d, a, k[4], 20, -405537848);
  a = gg(a, b, c, d, k[9], 5, 568446438);
  d = gg(d, a, b, c, k[14], 9, -1019803690);
  c = gg(c, d, a, b, k[3], 14, -187363961);
  b = gg(b, c, d, a, k[8], 20, 1163531501);
  a = gg(a, b, c, d, k[13], 5, -1444681467);
  d = gg(d, a, b, c, k[2], 9, -51403784);
  c = gg(c, d, a, b, k[7], 14, 1735328473);
  b = gg(b, c, d, a, k[12], 20, -1926607734);

  a = hh(a, b, c, d, k[5], 4, -378558);
  d = hh(d, a, b, c, k[8], 11, -2022574463);
  c = hh(c, d, a, b, k[11], 16, 1839030562);
  b = hh(b, c, d, a, k[14], 23, -35309556);
  a = hh(a, b, c, d, k[1], 4, -1530992060);
  d = hh(d, a, b, c, k[4], 11, 1272893353);
  c = hh(c, d, a, b, k[7], 16, -155497632);
  b = hh(b, c, d, a, k[10], 23, -1094730640);
  a = hh(a, b, c, d, k[13], 4, 681279174);
  d = hh(d, a, b, c, k[0], 11, -358537222);
  c = hh(c, d, a, b, k[3], 16, -722521979);
  b = hh(b, c, d, a, k[6], 23, 76029189);
  a = hh(a, b, c, d, k[9], 4, -640364487);
  d = hh(d, a, b, c, k[12], 11, -421815835);
  c = hh(c, d, a, b, k[15], 16, 530742520);
  b = hh(b, c, d, a, k[2], 23, -995338651);

  a = ii(a, b, c, d, k[0], 6, -198630844);
  d = ii(d, a, b, c, k[7], 10, 1126891415);
  c = ii(c, d, a, b, k[14], 15, -1416354905);
  b = ii(b, c, d, a, k[5], 21, -57434055);
  a = ii(a, b, c, d, k[12], 6, 1700485571);
  d = ii(d, a, b, c, k[3], 10, -1894986606);
  c = ii(c, d, a, b, k[10], 15, -1051523);
  b = ii(b, c, d, a, k[1], 21, -2054922799);
  a = ii(a, b, c, d, k[8], 6, 1873313359);
  d = ii(d, a, b, c, k[15], 10, -30611744);
  c = ii(c, d, a, b, k[6], 15, -1560198380);
  b = ii(b, c, d, a, k[13], 21, 1309151649);
  a = ii(a, b, c, d, k[4], 6, -145523070);
  d = ii(d, a, b, c, k[11], 10, -1120210379);
  c = ii(c, d, a, b, k[2], 15, 718787259);
  b = ii(b, c, d, a, k[9], 21, -343485551);

  x[0] = add32(a, x[0]);
  x[1] = add32(b, x[1]);
  x[2] = add32(c, x[2]);
  x[3] = add32(d, x[3]);

}

function cmn(q, a, b, x, s, t) {
  a = add32(add32(a, q), add32(x, t));
  return add32((a << s) | (a >>> (32 - s)), b);
}

function ff(a, b, c, d, x, s, t) {
  return cmn((b & c) | ((~b) & d), a, b, x, s, t);
}

function gg(a, b, c, d, x, s, t) {
  return cmn((b & d) | (c & (~d)), a, b, x, s, t);
}

function hh(a, b, c, d, x, s, t) {
  return cmn(b ^ c ^ d, a, b, x, s, t);
}

function ii(a, b, c, d, x, s, t) {
  return cmn(c ^ (b | (~d)), a, b, x, s, t);
}

function md51(s) {
  //var txt = '';
  var n = s.length,
    state = [1732584193, -271733879, -1732584194, 271733878],
    i;
  for (i = 64; i <= s.length; i += 64) {
    md5cycle(state, md5blk(s.substring(i - 64, i)));
  }
  s = s.substring(i - 64);
  var tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  for (i = 0; i < s.length; i++)
    tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3);
  tail[i >> 2] |= 0x80 << ((i % 4) << 3);
  if (i > 55) {
    md5cycle(state, tail);
    for (i = 0; i < 16; i++) tail[i] = 0;
  }
  tail[14] = n * 8;
  md5cycle(state, tail);
  return state;
}

/* there needs to be support for Unicode here,
 * unless we pretend that we can redefine the MD-5
 * algorithm for multi-byte characters (perhaps
 * by adding every four 16-bit characters and
 * shortening the sum to 32 bits). Otherwise
 * I suggest performing MD-5 as if every character
 * was two bytes--e.g., 0040 0025 = @%--but then
 * how will an ordinary MD-5 sum be matched?
 * There is no way to standardize text to something
 * like UTF-8 before transformation; speed cost is
 * utterly prohibitive. The JavaScript standard
 * itself needs to look at this: it should start
 * providing access to strings as preformed UTF-8
 * 8-bit unsigned value arrays.
 */
function md5blk(s) { /* I figured global was faster.   */
  var md5blks = [],
    i; /* Andy King said do it this way. */
  for (i = 0; i < 64; i += 4) {
    md5blks[i >> 2] = s.charCodeAt(i) +
      (s.charCodeAt(i + 1) << 8) +
      (s.charCodeAt(i + 2) << 16) +
      (s.charCodeAt(i + 3) << 24);
  }
  return md5blks;
}

var hex_chr = '0123456789abcdef'.split('');

function rhex(n) {
  var s = '',
    j = 0;
  for (; j < 4; j++)
    s += hex_chr[(n >> (j * 8 + 4)) & 0x0F] +
    hex_chr[(n >> (j * 8)) & 0x0F];
  return s;
}

function hex(x) {
  for (var i = 0; i < x.length; i++)
    x[i] = rhex(x[i]);
  return x.join('');
}

function md5(s) {
  return hex(md51(s));
}

/* this function is much faster,
so if possible we use it. Some IEs
are the only ones I know of that
need the idiotic second function,
generated by an if clause.  */

var add32 = function(a, b) {
  return (a + b) & 0xFFFFFFFF;
};

if (md5('hello') != '5d41402abc4b2a76b9719d911017c592') {
  add32 = function(x, y) {
    var lsw = (x & 0xFFFF) + (y & 0xFFFF),
      msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xFFFF);
  };
}

//
//
// "blazing fast unique hash generator" from https://github.com/bevacqua/hash-sum
//
//

function pad (hash, len) {
  while (hash.length < len) {
    hash = '0' + hash;
  }
  return hash;
}

function fold (hash, text) {
  var i;
  var chr;
  var len;
  if (text.length === 0) {
    return hash;
  }
  for (i = 0, len = text.length; i < len; i++) {
    chr = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0;
  }
  return hash < 0 ? hash * -2 : hash;
}

function foldObject (hash, o, seen) {
  return Object.keys(o).sort().reduce(foldKey, hash);
  function foldKey (hash, key) {
    return foldValue(hash, o[key], key, seen);
  }
}

function foldValue (input, value, key, seen) {
  var hash = fold(fold(fold(input, key), toString(value)), typeof value);
  if (value === null) {
    return fold(hash, 'null');
  }
  if (value === undefined) {
    return fold(hash, 'undefined');
  }
  if (typeof value === 'object') {
    if (seen.indexOf(value) !== -1) {
      return fold(hash, '[Circular]' + key);
    }
    seen.push(value);
    return foldObject(hash, value, seen);
  }
  return fold(hash, value.toString());
}

function toString (o) {
  return Object.prototype.toString.call(o);
}

function sum (o) {
  return pad(foldValue(0, o, '', []).toString(16), 8);
}

// Source: http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/

function stringHashCode(str) {
  var hash = 0, i, chr, len;
  if (str.length === 0) return hash;
  for (i = 0, len = str.length; i < len; i++) {
    chr   = str.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

/* mod of hashCode by http://stackoverflow.com/users/353872/fordi using base36 and only takes in strings */

function toBase36(n) {
    var ret = ((n<0?0x8:0)+((n >> 28) & 0x7)).toString(36) + (n & 0xfffffff).toString(36);
    while (ret.length < 8) ret = '0'+ret; // padding
    return ret;
}
/**
 * identical in speed to hashCode
 * 
 * @param  {String} o the string to hash
 * @param  {int} l length of the result in blocks of 8 chars, default 2
 * @return {String} the hash
 */
function hashCodeMod(o, l) {
    l = l || 2;
    var i, c, r = [];
    for (i=0; i<l; i++)
        r.push(i*268803292);
    //function stringify(o) {
    //    var i,r;
    //    if (o === null) return 'n';
    //    if (o === true) return 't';
    //    if (o === false) return 'f';
    //    if (o instanceof Date) return 'd:'+(0+o);
    //    i=typeof o;
    //    if (i === 'string') return 's:'+o.replace(/([\\\\;])/g,'\\$1');
    //    if (i === 'number') return 'n:'+o;
    //    if (o instanceof Function) return 'm:'+o.toString().replace(/([\\\\;])/g,'\\$1');
    //    if (o instanceof Array) {
    //        r=[];
    //        for (i=0; i<o.length; i++) 
    //            r.push(stringify(o[i]));
    //        return 'a:'+r.join(';');
    //    }
    //    r=[];
    //    for (i in o) {
    //        r.push(i+':'+stringify(o[i]));
    //    }
    //    return 'o:'+r.join(';');
    //}
    o = 's:'+o.replace(/([\\\\;])/g,'\\$1');
    for (i=0; i<o.length; i++) {
        for (c=0; c<r.length; c++) {
            r[c] = (r[c] << 13)-(r[c] >> 19);
            r[c] += o.charCodeAt(i) << (r[c] % 24);
            r[c] = r[c] & r[c];
        }
    }
    for (i=0; i<r.length; i++) {
        r[i] = toBase36(r[i]);
    }
    return r.join('');
}

/* globals console */

fasthash_js('The quick brown fox jumps over the lazy dog');
strhash('The quick brown fox jumps over the lazy dog');
hashCode('The quick brown fox jumps over the lazy dog');
md5('The quick brown fox jumps over the lazy dog');
Sha1.hash('The quick brown fox jumps over the lazy dog');
sum('The quick brown fox jumps over the lazy dog');
stringHashCode('The quick brown fox jumps over the lazy dog');
hashCodeMod('The quick brown fox jumps over the lazy dog');

console.log(fasthash_js('The quick brown fox jumps over the lazy dog'));
console.log(strhash('The quick brown fox jumps over the lazy dog'));
console.log(hashCode('The quick brown fox jumps over the lazy dog'));
console.log(md5('The quick brown fox jumps over the lazy dog'));
console.log(Sha1.hash('The quick brown fox jumps over the lazy dog'));
console.log(sum('The quick brown fox jumps over the lazy dog'));
console.log(stringHashCode('The quick brown fox jumps over the lazy dog'));
console.log(hashCodeMod('The quick brown fox jumps over the lazy dog'));

var ooperations = 10000; // at least 10000 is recommended for proper figures
var i = 0,
	t1=0,t2=0,t3=0,t4=0,t5=0,t6=0,t7=0,t8=0;

console.time('fasthash_js');
for (i = 0; i < ooperations; i++)
	fasthash_js('The quick brown fox jumps over the lazy dog');
 t1 = console.timeEnd('fasthash_js');

console.time('strhash');
for (i = 0; i < ooperations; i++)
	strhash('The quick brown fox jumps over the lazy dog');
 t2 = console.timeEnd('strhash');

console.time('hashCode');
for (i = 0; i < ooperations; i++)
	hashCode('The quick brown fox jumps over the lazy dog');
 t3 = console.timeEnd('hashCode');

console.time('md5');
for (i = 0; i < ooperations; i++)
	md5('The quick brown fox jumps over the lazy dog');
 t4 = console.timeEnd('md5');

console.time('Sha1.hash');
for (i = 0; i < ooperations; i++)
	Sha1.hash('The quick brown fox jumps over the lazy dog');
 t5 = console.timeEnd('Sha1.hash');

console.time('sum');
for (i = 0; i < ooperations; i++)
	sum('The quick brown fox jumps over the lazy dog');
 t6 = console.timeEnd('sum');

console.time('stringHashCode');
for (i = 0; i < ooperations; i++)
	stringHashCode('The quick brown fox jumps over the lazy dog');
 t7 = console.timeEnd('stringHashCode');

console.time('hashCodeMod');
for (i = 0; i < ooperations; i++)
	hashCodeMod('The quick brown fox jumps over the lazy dog');
 t8 = console.timeEnd('hashCodeMod');

console.log('fasthash_js average over ' + ooperations + ' ops: ' + ((t1 / ooperations)/* * 1000000*/)); // remove comment to display avg time in nanoseconds
console.log('strhash average over ' + ooperations + ' ops: ' + ((t2 / ooperations)/* * 1000000*/));
console.log('hashCode average over ' + ooperations + ' ops: ' + ((t3 / ooperations)/* * 1000000*/));
console.log('md5 average over ' + ooperations + ' ops: ' + ((t4 / ooperations)/* * 1000000*/));
console.log('Sha1.hash average over ' + ooperations + ' ops: ' + ((t5 / ooperations)/* * 1000000*/));
console.log('sum average over ' + ooperations + ' ops: ' + ((t6 / ooperations)/* * 1000000*/));
console.log('stringHashCode average over ' + ooperations + ' ops: ' + ((t7 / ooperations)/* * 1000000*/));
console.log('hashCodeMod average over ' + ooperations + ' ops: ' + ((t8 / ooperations)/* * 1000000*/));

// my test results: (10000 operations)
//
// 854341450
// undefinedm61n26o2p44o53p1n3p248888888888
// 2d662cfefdd91c3c
// 9e107d9d372bb6826bd81d3542a419d6
// 2fd4e1c67a2d28fced849ee1bb76e7391b93eb12
// 40aab39d
// -609428141
// 023pu8se0f3ubosc
//  
//  
// fasthash_js: 31.00ms
// strhash: 499.00ms
// hashCode: 406.00ms
// md5: 2590.00ms
// Sha1.hash: 982.00ms
// sum: 110.00ms
// stringHashCode: 15.00ms
// hashCodeMod: 406.00ms
//  
//  
// fasthash_js average over 10000 ops: 0.0031 ms
// strhash average over 10000 ops: 0.0499 ms
// hashCode average over 10000 ops: 0.0406 ms
// md5 average over 10000 ops: 0.259 ms
// Sha1.hash average over 10000 ops: 0.0982 ms
// sum average over 10000 ops: 0.011 ms
// stringHashCode average over 10000 ops: 0.0015 ms
// hashCodeMod average over 10000 ops: 0.0406 ms
//
// hashCode seems to give the best results.