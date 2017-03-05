'use strict';

/**
 * Returns the bank account number parsed from specified string.
 *
 * You work for a bank, which has recently purchased an ingenious machine to assist in reading letters and faxes sent in by branch offices.
 * The machine scans the paper documents, and produces a string with a bank account that looks like this:
 *
 *    _  _     _  _  _  _  _
 *  | _| _||_||_ |_   ||_||_|
 *  ||_  _|  | _||_|  ||_| _|
 *
 * Each string contains an account number written using pipes and underscores.
 * Each account number should have 9 digits, all of which should be in the range 0-9.
 *
 * Your task is to write a function that can take bank account string and parse it into actual account numbers.
 *
 * @param {string} bankAccount
 * @return {number}
 *
 * Example of return :
 *
 *   '    _  _     _  _  _  _  _ \n'+
 *   '  | _| _||_||_ |_   ||_||_|\n'+     =>  123456789
 *   '  ||_  _|  | _||_|  ||_| _|\n'
 *
 *   ' _  _  _  _  _  _  _  _  _ \n'+
 *   '| | _| _|| ||_ |_   ||_||_|\n'+     => 23056789
 *   '|_||_  _||_| _||_|  ||_| _|\n',
 *
 *   ' _  _  _  _  _  _  _  _  _ \n'+
 *   '|_| _| _||_||_ |_ |_||_||_|\n'+     => 823856989
 *   '|_||_  _||_| _||_| _||_| _|\n',
 *
 */
function parseBankAccount(bankAccount) {
  function getNumber(gs) {
    let result = '';
    if ('   ' === gs[0]) {
      if ('  |' === gs[1]) result = '1';
      else result = '4';
    }
    else {
      if ('|_ ' === gs[2]) result = '2';
      else if ('  |' === gs[2]) result = '7';
      else if (' _|' === gs[2]) {
        if (' _|' === gs[1]) result = '3';
        else if ('|_ ' === gs[1]) result = '5';
        else result = '9';
      }
      else if ('|_|' === gs[2]) {
        if ('|_|' === gs[1]) result = '8';
        else if ('|_ ' === gs[1]) result = '6';
        else result = '0';
      }
    }
    return result;
  }

  let seq = bankAccount.split('\n'), gr = [[], [], []], out = '';
  seq.pop();
  for (let i = 0; i < seq.length; i++) {
    for (let j = 0; j < seq[i].length; j += 3) {
      gr[i].push(seq[i][j] + seq[i][j + 1] + seq[i][j + 2]);
    }
  }
  for (let i = 0; i < 9; i++) out += getNumber([gr[0][i], gr[1][i], gr[2][i]]);
  return parseInt(out, 10);
}


/**
 * Returns the string, but with line breaks inserted at just the right places to make sure that no line is longer than the specified column number.
 * Lines can be broken at word boundaries only.
 *
 * @param {string} text
 * @param {number} columns
 * @return {Iterable.<string>}
 *
 * @example :
 *
 *  'The String global object is a constructor for strings, or a sequence of characters.', 26 =>  'The String global object',
 *                                                                                                'is a constructor for',
 *                                                                                                'strings, or a sequence of',
 *                                                                                                'characters.'
 *
 *  'The String global object is a constructor for strings, or a sequence of characters.', 12 =>  'The String',
 *                                                                                                'global',
 *                                                                                                'object is a',
 *                                                                                                'constructor',
 *                                                                                                'for strings,',
 *                                                                                                'or a',
 *                                                                                                'sequence of',
 *                                                                                                'characters.'
 */
function* wrapText(text, columns) {
  let words = text.split(' ');
  while (words.length) {
    let out = '';
    while (true) {
      if (words.length && columns >= words[0].length + out.length + ((out.length) ? 1 : 0))
        out += (out.length) ? ` ${words.shift()}` : words.shift();
      else break;
    }
    yield out;
  }
}


/**
 * Returns the rank of the specified poker hand.
 * See the ranking rules here: https://en.wikipedia.org/wiki/List_of_poker_hands.
 *
 * @param {array} hand
 * @return {PokerRank} rank
 *
 * @example
 *   [ '4♥','5♥','6♥','7♥','8♥' ] => PokerRank.StraightFlush
 *   [ 'A♠','4♠','3♠','5♠','2♠' ] => PokerRank.StraightFlush
 *   [ '4♣','4♦','4♥','4♠','10♥' ] => PokerRank.FourOfKind
 *   [ '4♣','4♦','5♦','5♠','5♥' ] => PokerRank.FullHouse
 *   [ '4♣','5♣','6♣','7♣','Q♣' ] => PokerRank.Flush
 *   [ '2♠','3♥','4♥','5♥','6♥' ] => PokerRank.Straight
 *   [ '2♥','4♦','5♥','A♦','3♠' ] => PokerRank.Straight
 *   [ '2♥','2♠','2♦','7♥','A♥' ] => PokerRank.ThreeOfKind
 *   [ '2♥','4♦','4♥','A♦','A♠' ] => PokerRank.TwoPairs
 *   [ '3♥','4♥','10♥','3♦','A♠' ] => PokerRank.OnePair
 *   [ 'A♥','K♥','Q♥','2♦','3♠' ] =>  PokerRank.HighCard
 */
const PokerRank = {
  StraightFlush: 8,
  FourOfKind: 7,
  FullHouse: 6,
  Flush: 5,
  Straight: 4,
  ThreeOfKind: 3,
  TwoPairs: 2,
  OnePair: 1,
  HighCard: 0
}

function getPokerHandRank(hand) {
  let
    ranking = '234567891JQKA',
    straight = '2345A',
    handRank = hand.sort((a, b) => ranking.indexOf(a[0]) - ranking.indexOf(b[0]))
      .reduce((p, c) => p + c[0], ''),
    handSuit = hand.sort((a, b) => a.charCodeAt(a.length - 1) - b.charCodeAt(b.length - 1))
      .reduce((p, c) => p + c[c.length - 1], ''),
    rankMatch = handRank.match(/(.)\1{1,3}/g),
    suitMatch = handSuit.match(/(.)\1{4}/g),
    out;
  if (rankMatch != null) {
    if (rankMatch.length === 1) {
      if (rankMatch[0].length === 4) out = PokerRank.FourOfKind;
      else if (rankMatch[0].length === 3) out = PokerRank.ThreeOfKind;
      else out = PokerRank.OnePair;
    }
    else if (rankMatch.length === 2) {
      if (rankMatch[0].length === 3 || rankMatch[1].length === 3) out = PokerRank.FullHouse;
      else out = PokerRank.TwoPairs;
    }
  }
  else if (-1 < ranking.indexOf(handRank) || handRank === straight) {
    if (suitMatch != null) out = PokerRank.StraightFlush;
    else out = PokerRank.Straight;
  }
  else if (suitMatch != null) out = PokerRank.Flush;
  else out = PokerRank.HighCard;
  return out;
}


/**
 * Returns the rectangles sequence of specified figure.
 * The figure is ASCII multiline string comprised of minus signs -, plus signs +, vertical bars | and whitespaces.
 * The task is to break the figure in the rectangles it is made of.
 *
 * NOTE: The order of rectanles does not matter.
 *
 * @param {string} figure
 * @return {Iterable.<string>} decomposition to basic parts
 *
 * @example
 *
 *    '+------------+\n'+
 *    '|            |\n'+
 *    '|            |\n'+              '+------------+\n'+
 *    '|            |\n'+              '|            |\n'+         '+------+\n'+          '+-----+\n'+
 *    '+------+-----+\n'+       =>     '|            |\n'+     ,   '|      |\n'+     ,    '|     |\n'+
 *    '|      |     |\n'+              '|            |\n'+         '|      |\n'+          '|     |\n'+
 *    '|      |     |\n'               '+------------+\n'          '+------+\n'           '+-----+\n'
 *    '+------+-----+\n'
 *
 *
 *
 *    '   +-----+     \n'+
 *    '   |     |     \n'+                                    '+-------------+\n'+
 *    '+--+-----+----+\n'+              '+-----+\n'+          '|             |\n'+
 *    '|             |\n'+      =>      '|     |\n'+     ,    '|             |\n'+
 *    '|             |\n'+              '+-----+\n'           '+-------------+\n'
 *    '+-------------+\n'
 */
function* getFigureRectangles(figure) {
  function drawRectangle(w, h) {
    let result = '';
    result += `+${'-'.repeat(w - 2)}+\n`;
    for (let i = 1; i < h - 1; i++) result += `|${' '.repeat(w - 2)}|\n`;
    result += `+${'-'.repeat(w - 2)}+\n`;
    return result;
  }

  let fig = figure.split('\n');
  fig.pop();
  for (let i = 0; i < fig.length - 1; i++) {
    let counting = false, width = 0, height = 0;
    for (let j = 0; j < fig[i].length; j++) {
      if (counting && '+' === fig[i][j] && -1 < '-+'.indexOf(fig[i][j - 1]) && -1 < '|+'.indexOf(fig[i + 1][j])) {
        width++;
        let k = i + 1;
        height++;
        while (k < fig.length) {
          if ('+' === fig[k][j] && -1 < '-+'.indexOf(fig[k][j - 1])) {
            height++;
            break;
          }
          height++;
          k++;
        }
        if (height > 1) yield drawRectangle(width, height);
        counting = false;
        width = 0;
        height = 0;
      }
      if (!counting && '+' === fig[i][j] && j < fig[i].length - 1 && -1 < '-+'.indexOf(fig[i][j + 1]) && -1 < '|+'.indexOf(fig[i + 1][j])) {
        counting = true;
        width++;
      }
      else if (counting) {
        width++;
      }
    }
  }
}


module.exports = {
  parseBankAccount: parseBankAccount,
  wrapText: wrapText,
  PokerRank: PokerRank,
  getPokerHandRank: getPokerHandRank,
  getFigureRectangles: getFigureRectangles
};
