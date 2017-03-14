'use strict';

/**
 * Returns true if word occurrs in the specified word snaking puzzle.
 * Each words can be constructed using "snake" path inside a grid with top, left, right and bottom directions.
 * Each char can be used only once ("snake" should not cross itself).
 *
 * @param {array} puzzle
 * @param {array} searchStr
 * @return {bool}
 *
 * @example
 *   var puzzle = [ 
 *      'ANGULAR',
 *      'REDNCAE',
 *      'RFIDTCL',
 *      'AGNEGSA',
 *      'YTIRTSP',
 *   ]; 
 *   'ANGULAR'   => true   (first row)
 *   'REACT'     => true   (starting from the top-right R adn follow the ↓ ← ← ↓ )
 *   'UNDEFINED' => true
 *   'RED'       => true
 *   'STRING'    => true
 *   'CLASS'     => true
 *   'ARRAY'     => true   (first column)
 *   'FUNCTION'  => false
 *   'NULL'      => false 
 */
function findStringInSnakingPuzzle(puzzle, searchStr) {
  function getNextPoint(idx, x, y, path, branch) {
    let i = idx + 1, found = false, nextX, nextY;
    path.push(`${x},${y}`);
    if (x < puzzle[y].length - 1 && puzzle[y][x + 1] === searchStr[i] && -1 === path.indexOf(`${x + 1},${y}`)) {
      nextX = x + 1;
      nextY = y;
      found = true;
    }
    if (y < puzzle.length - 1 && puzzle[y + 1][x] === searchStr[i] && -1 === path.indexOf(`${x},${y + 1}`)) {
      nextX = x;
      nextY = y + 1;
      if (found) branch.push([x, y + 1]);
      found = true;
    }
    if (x > 0 && puzzle[y][x - 1] === searchStr[i] && -1 === path.indexOf(`${x - 1},${y}`)) {
      nextX = x - 1;
      nextY = y;
      if (found) branch.push([x - 1, y]);
      found = true;
    }
    if (y > 0 && puzzle[y - 1][x] === searchStr[i] && -1 === path.indexOf(`${x},${y - 1}`)) {
      nextX = x;
      nextY = y - 1;
      if (found) branch.push([x, y - 1]);
      found = true;
    }
    if (found && i < searchStr.length - 1) {
      found = getNextPoint(i, nextX, nextY, path, branch);
      while (!found && branch.length) {
        let branchPoint = branch.pop();
        found = getNextPoint(i, branchPoint[0], branchPoint[1], path, branch);
      }
    }
    return found;
  }
  let fnd = false;
  searchStartPoint:
    for (let i = 0; i < puzzle.length; i++) {
      for (let j = 0; j < puzzle[i].length; j++) {
        if (puzzle[i][j] === searchStr[0]) {
          const pathPoints = [], branchPoints = [];
          fnd = getNextPoint(0, j, i, pathPoints, branchPoints);
          if (fnd) break searchStartPoint;
        }
      }
    }
  return fnd;
}


/**
 * Returns all permutations of the specified string.
 * Assume all chars in the specified string are different.
 * The order of permutations does not matter.
 * 
 * @param {string} chars
 * @return {Iterable.<string>} all posible strings constructed with the chars from the specfied string
 *
 * @example
 *    'ab'  => 'ab','ba'
 *    'abc' => 'abc','acb','bac','bca','cab','cba'
 */
function* getPermutations(chars) {
  function gen(item) {
    if (!item.length) store.push(prefix.join(''));
    for (let i = 0; i < item.length; i++) {
      item.push(item.shift());
      prefix.push(item[0]);
      gen(item.slice(1));
      prefix.pop();
    }
  }
  const store = [], prefix = [];
  gen(chars.split(''));
  yield* store;
}


/**
 * Returns the most profit from stock quotes.
 * Stock quotes are stores in an array in order of date.
 * The stock profit is the difference in prices in buying and selling stock.
 * Each day, you can either buy one unit of stock, sell any number of stock units you have already bought, or do nothing. 
 * Therefore, the most profit is the maximum difference of all pairs in a sequence of stock prices.
 * 
 * @param {array} quotes
 * @return {number} max profit
 *
 * @example
 *    [ 1, 2, 3, 4, 5, 6]   => 15  (buy at 1,2,3,4,5 and then sell all at 6)
 *    [ 6, 5, 4, 3, 2, 1]   => 0   (nothing to buy)
 *    [ 1, 6, 5, 10, 8, 7 ] => 18  (buy at 1,6,5 and sell all at 10)
 */
function getMostProfitFromStockQuotes(quotes) {
  if (!quotes.length) return 0;
  let max = quotes.reduce((a, c) => (a > c) ? a : c), acc = 0;
  if (0 === quotes.indexOf(max)) {
    quotes.shift();
    acc += getMostProfitFromStockQuotes(quotes);
  }
  else {
    acc += quotes.slice(0, quotes.indexOf(max)).reduce((a, c) => a + (max - c), 0);
    if (quotes.indexOf(max) < quotes.length - 1) {
      acc += getMostProfitFromStockQuotes(quotes.slice(quotes.indexOf(max) + 1));
    }
  }
  return acc;
}


/**
 * Class representing the url shorting helper.
 * Feel free to implement any algorithm, but do not store link in the key\value stores.
 * The short link can be at least 1.5 times shorter than the original url.
 * 
 * @class
 *
 * @example
 *    
 *     var urlShortener = new UrlShortener();
 *     var shortLink = urlShortener.encode('https://en.wikipedia.org/wiki/URL_shortening');
 *     var original  = urlShortener.decode(shortLink); // => 'https://en.wikipedia.org/wiki/URL_shortening'
 * 
 */
function UrlShortener() {
    this.urlAllowedChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"+
                           "abcdefghijklmnopqrstuvwxyz"+
                           "0123456789-_.~!*'();:@&=+$,/?#[]";
}

UrlShortener.prototype = {

    encode: function(url) {
      let
        ds = url.split('')
          .reduce((a, c) => a + this.urlAllowedChars.indexOf(c).toLocaleString('en-US', {minimumIntegerDigits: 2}), ''),
        out = '';
      while (ds.length > 0) {
        out += String.fromCharCode(parseInt((ds.length > 3) ? ds.slice(0, 4) : ds, 10));
        ds = ds.slice(4);
      }
      return out;
    },
    
    decode: function(code) {
      const ds = code.split('').reduce((a, c) => {
        if (this.urlAllowedChars.length < parseInt(c.charCodeAt(0), 10))
          a.push(Math.floor(parseInt(c.charCodeAt(0), 10) / 100));
        a.push(parseInt(c.charCodeAt(0), 10) % 100);
        return a;
      }, []);
      return ds.map(v => this.urlAllowedChars[v]).join('');
    } 
}


module.exports = {
    findStringInSnakingPuzzle: findStringInSnakingPuzzle,
    getPermutations: getPermutations,
    getMostProfitFromStockQuotes: getMostProfitFromStockQuotes,
    UrlShortener: UrlShortener
};
