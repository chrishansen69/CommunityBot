'use strict';

const bot = require('../../bot.js');
const utility = require('../../utility.js');
const perms = require('../../permissions.js');
//const rand = require('../../lib/rand.js');

// I am the constructor function.
function Deck() { // Note: this works. It shouldn't work, it really shouldn't, and `length` should not be updated, but it is, so let's roll with it

  // When creating the collection, we are going to work off
  // the core array. In order to maintain all of the native
  // array features, we need to build off a native array.
  let deck = Object.create(Array.prototype); // http://stackoverflow.com/a/22022264 is this wrong? seems to be fine...


  // Initialize the array. This line is more complicated than
  // it needs to be, but I'm trying to keep the approach
  // generic for learning purposes.
  if (arguments.length === 1 && arguments[0] instanceof Array) { // special constructor for converting from []
    if (arguments[0].length === 1 && typeof arguments[0][0] == 'number') { // special case, only 1 arg and is number
      deck = (Array.apply(deck) || deck);
      deck[0] = arguments[0][0];
    } else {
      deck = (Array.apply(deck, arguments[0]) || deck);
    }
  } else {
    deck = (Array.apply(deck, arguments) || deck);
  }

  // TODO: the way it was done in the example is faster maybe, assigning to a single function

  // Add all the class methods to the collection.
  deck.shuffle = function () {
    const array = this;
    let currentIndex = array.length,
      temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  };

  deck.clone = function () {
    return new Deck(this.slice(0));
  };

  /**
   * Groups an array of objects by one or more keys
   * 
   * @param array arr       The array of objects to group
   * 
   * @param string|function A string representing the child property to group by
   *                        or a function that returns an array of one or more properties.
   * 
   * @returns               An object with keys representing the grouping properties, 
   *                        finally holding an array of records that fell into 
   *                        those groups.
   */
  deck.groupBy = function (by) {
    const items = this;
    const groups = {};
    let group;
    let values;
    let i = items.length;
    let j;
    let key;

    // make sure we specified how we want it grouped
    if (!by) {
      return items;
    }
    while (i--) {

      // find out group values for this item
      values = (typeof (by) === 'function' && by(items[i]) ||
        typeof items[i] === 'object' && items[i][by] ||
        items[i]);

      // make sure our group values are an array
      values = values instanceof Array && values || [values];

      // recursively group
      group = groups;
      for (j = 0; j < values.length; j++) {
        key = values[j];
        group = (group[key] || (group[key] = j === values.length - 1 && [] || {}));
      }

      // for the last group, push the actual item onto the array
      group = (group instanceof Array && group || []).push(items[i]);
    }

    return new Deck(groups);
  };

  deck.count = function (func) {
    if (func) {
      let size = 0;

      for (let i = this.length - 1; i >= 0; i--) {
        if (func(this[i], this))
          size++;
      }
      return size;
    }
    return this.length;
  };

  deck.min = function (func) {
    return this.reduce(function (p, v) { // `deck` or `this`? https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this
      return (func(p) < func(v) ? p : v);
    });
  };
  
  // Production steps of ECMA-262, Edition 5, 15.4.4.17
  // Reference: http://es5.github.io/#x15.4.4.17
  deck.any = deck.some;

  // Return the new collection object.
  return (deck);
}

//function pairNumbers(arr, num) {
//  let cnt = 0;
//  for (let i = arr.length - 1; i >= 0; i--) {
//    if (arr[i].number === num)
//      cnt++;
//  }
//  return cnt;
//}
//function pairTypes(arr, num) {
//  let cnt = 0;
//  for (let i = arr.length - 1; i >= 0; i--) {
//    if (arr[i].type === num)
//      cnt++;
//  }
//  return cnt;
//}

function maxPairN(arr) {
  const c = {};
  let m = 0;
  arr.forEach(function(x) {
    c[x.number] = (c[x.number] || 0) + 1;
    if (c[x.number] > m) m = c[x.number];
  });
  console.log('MaxPaitN, object c: ' + JSON.stringify(c));
  return m;
}

//function maxPairT(arr) {
//  const c = {};
//  let m = 0;
//  arr.forEach(function(x) {
//    c[x.type] = (c[x.type] || 0) + 1;
//    if (c[x.type] > m) m = c[x.type];
//  });
//  return m;
//}

function arrContains(arr, z) {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (arr[i] === z) return true;
  }
  return false;
}

const dict = {
  1: 'Ace',
  2: 'Two',
  3: 'Three',
  4: 'Four',
  5: 'Five',
  6: 'Six',
  7: 'Seven',
  8: 'Eight',
  9: 'Nine',
  10: 'Ten',
  11: 'Jack',
  12: 'Queen',
  13: 'King'
};

const suit = {
  1: 'Spades',
  2: 'Hearts',
  3: 'Diamonds',
  4: 'Clubs',
};

function Card(n, t) {
  // AKA rank
  this.number = n; //rand(13) + 1;
  //this.name = dict[this.number];
  // AKA suit
  this.type = t; //rand(4) + 1;
  //this.suit = suit[this.type];
}
Card.prototype.getName = Card.prototype.toString = function () {
  return dict[this.number] + ' of ' + suit[this.type];
};

//////////////////////////////////////////////////////////////////////////////

const cards = new Deck(
  new Card(1, 1),
  new Card(1, 2),
  new Card(1, 3),
  new Card(1, 4),
  new Card(2, 1),
  new Card(2, 2),
  new Card(2, 3),
  new Card(2, 4),
  new Card(3, 1),
  new Card(3, 2),
  new Card(3, 3),
  new Card(3, 4),
  new Card(4, 1),
  new Card(4, 2),
  new Card(4, 3),
  new Card(4, 4),
  new Card(5, 1),
  new Card(5, 2),
  new Card(5, 3),
  new Card(5, 4),
  new Card(6, 1),
  new Card(6, 2),
  new Card(6, 3),
  new Card(6, 4),
  new Card(7, 1),
  new Card(7, 2),
  new Card(7, 3),
  new Card(7, 4),
  new Card(8, 1),
  new Card(8, 2),
  new Card(8, 3),
  new Card(8, 4),
  new Card(9, 1),
  new Card(9, 2),
  new Card(9, 3),
  new Card(9, 4),
  new Card(10, 1),
  new Card(10, 2),
  new Card(10, 3),
  new Card(10, 4),
  new Card(11, 1),
  new Card(11, 2),
  new Card(11, 3),
  new Card(11, 4),
  new Card(12, 1),
  new Card(12, 2),
  new Card(12, 3),
  new Card(12, 4),
  new Card(13, 1),
  new Card(13, 2),
  new Card(13, 3),
  new Card(13, 4)
);

function splitByProperty(obj, prop) { // http://stackoverflow.com/a/20170128
  const s = [];
  Object.keys(obj).forEach(function(k) {
    if (prop in obj[k])
      s.push(obj[k][prop]);
  });
  console.log('Split by property ' + prop + ': ' + JSON.stringify(s));
  return s;
}

const hasPair =
  cards => maxPairN(cards) >= 2;

const hasTwoPair =
  cards => maxPairN(cards) >= 4;

const isStraight =
  cards => {
    const group = splitByProperty(cards, 'number');

    for (let i = 1; i <= 9; i++) { // 13 - 4 = 9
      if (arrContains(group, i  ) && 
          arrContains(group, i+1) && 
          arrContains(group, i+2) && 
          arrContains(group, i+3) && 
          arrContains(group, i+4))
        return true;
    }
    return false;
  };

const hasThreeOfKind =
  cards => maxPairN(cards) >= 6;

const isFlush =
  cards => {
    const groupType = splitByProperty(cards, 'type');

    for (let i = groupType.length - 1; i >= 0; i--) {
      for (let j = groupType.length - 1; i >= 0; i--) {
        if (j !== i) return false;
      }
    }
    return true;
  };

const hasFourOfKind =
  cards => maxPairN(cards) >= 8;

const isFullHouse =
  cards => {
    if (!hasThreeOfKind(cards))
      return false;

    const scards = splitByProperty(cards, 'type');

    let gotThrees = false;
    let gotPair = false;

    for (let i = 1; i <= 4; i++) {
      if (!(i in scards)) continue;

      if (hasThreeOfKind(scards[i])){
        gotThrees = true;
        if (gotPair) return true;
      } else if (hasPair(scards[i])) {
        gotPair = true;
        if (gotThrees) return true;
      }
    }

    return false;
  };

const hasStraightFlush =
  cards => isFlush(cards) && isStraight(cards);

const isRoyalFlush =
  cards => cards.min(card => card.number) === 1 && // could use splitByProperty
  cards.max(card => card.number) == 13 &&  // could use splitByProperty
  hasStraightFlush(cards);

const isStraightFlush =
  cards => hasStraightFlush(cards) && !isRoyalFlush(cards);

const handValues = {
  'a Royal Flush!!!': isRoyalFlush,
  'a Straight Flush!!': isStraightFlush,
  'Four Of A Kind!': hasFourOfKind,
  'a Full House!': isFullHouse,
  'a Flush': isFlush,
  'a Straight': isStraight,
  'Three Of A Kind': hasThreeOfKind,
  'Two Pairs': hasTwoPair,
  'a Pair': hasPair,
};

//////////////////////////////////////////////////////////////////////////////

function createPool() {
  return cards.clone().shuffle();
}

function getHandValue(cards) {
  const hv = Object.keys(handValues);
  for (let i = 0, il = hv.length, k = hv[i]; i < il; i++, k = hv[i]) {
    if (handValues[k](cards)) {
      console.log(handValues[k] + ' returned true');
      return k; /// OHHH FUCK WE CANT BREAK HERE... I FUCKED UP BAD
    }
    console.log(handValues[k] + ' returned false');
  }
  
  // just go for the high card
  return 'a high card, the ' + cards.reduce(function (p, v) {
    return (p.number > v.number ? p : v);
  }).getName();
}

function iMention(id) {
  return bot.users.get(id).toString();
}

const mCommands = {
  'draw5': function(message, suffix) {
    mCommands.draw(message, suffix);
    mCommands.draw(message, suffix);
    mCommands.draw(message, suffix);
    mCommands.draw(message, suffix);
    mCommands.draw(message, suffix);
  },
  'draw': function (message, suffix) {
    const pc = utility.getPseudoChannel(message.channel);
    const sender = message.author.id;

    // create holders
    if (!pc.blackjack) {
      pc.blackjack = {};
    }
    const bj = pc.blackjack;
    if (!bj.pool) {
      bj.pool = createPool();
    }
    if (!bj[sender]) {
      bj[sender] = {};
    }
    if (!bj[sender].cards) {
      bj[sender].cards = new Deck();
    }

    if (bj.pool.length <= 0) { // deck empty
      message.channel.sendMessage('All out of cards in the deck.\nAsk an operator to restart or finish the round.');
    } else { // deck has cards
      const card = bj.pool.pop(); // get last item and remove
      bj[sender].cards.push(card);
      message.channel.sendMessage(message.author.toString() + ' drew a card, they now have ' + bj[sender].cards.length + ' cards.');
      message.author.sendMessage('You drew: ' + (card.getName()));
    }
  },
  'player': function (message) {
    if (message.mentions.users.size != 1) {
      message.channel.sendMessage('Please mention only one user.');
    } else {
      message.channel.sendMessage(message.mentionsArr[0].toString() + ' has ' + utility.getPseudoChannel(message.channel).blackjack[message.mentionsArr[0].id].cards.length + ' cards.');
    }
  },
  'deck': function (message) {
    const pc = utility.getPseudoChannel(message.channel);
    message.channel.sendMessage(pc.blackjack && pc.blackjack.pool ? (pc.blackjack.pool.length + ' cards in the deck.') : 'There is no deck. Draw to get a new one.');
  },
  'hand': function (message) {
    const pc = utility.getPseudoChannel(message.channel);
    message.author.sendMessage('Your cards:\n' +

      ((pc.blackjack && pc.blackjack[message.author.id] && pc.blackjack[message.author.id].cards ? // deck exists
        pc.blackjack[message.author.id].cards : // get cards
        'Your hand is empty.').join('\n')) // join arr
    );
  },
  'game': function (message) {
    if (!perms.has(message, 'op')) return;

    const pc = utility.getPseudoChannel(message.channel);

    if (!pc.blackjack || !pc.blackjack.pool || Object.keys(pc.blackjack).length === 1) {
      message.channel.sendMessage("Nobody's played yet, so we can't end the game. You might want to use `=cards reset` instead.");
      return;
    }

    const out = ['Here are the scores...', ''];

    Object.keys(pc.blackjack).forEach(function(k) {
      const v = pc.blackjack[k];
      if (!v.cards) return; // isn't the pool

      out.push(iMention(k) + ' drew ' + v.cards.length + ' cards and scored ' + getHandValue(v.cards));
    });

    message.channel.sendMessage(out);

    delete pc.blackjack;
  },
  'reset': function (message) {
    if (!perms.has(message, 'op')) return;

    const pc = utility.getPseudoChannel(message.channel);
    if (pc.blackjack)
      delete pc.blackjack;

    message.channel.sendMessage("The board's been reset!");
  },
  'help': function (message) {
    message.channel.sendMessage(
      `List of commands: 

=cards draw: draw a card from the deck.
=cards player: view how many cards a player has drawn.
=cards deck: view how many cards are in the deck.
=cards hand: view the cards in your hand.
=cards game: end a round and see people's hands

Use these commands to play a game of Texas Hold'em, Blackjack, or whatever game variation you prefer.
`);
    /*
    =cards wallet: view how many Vietnamese Dongs you have to spend.
    =cards bet <number>: bet an amount of Vietnamese Dongs on your current hand
    =cards fold: stop playing for the current round (and lose your bet money)
     */
  }
};

module.exports = {
  name: 'cards',
  defaultCommandPrefix: 'cards',
  commands: {
    'cards': {
      fn: function (message, suffix) {
        const cmd = suffix.split(' ')[0];
        if (mCommands[cmd])
          mCommands[cmd](message, suffix);
      }
    },
  }
};
