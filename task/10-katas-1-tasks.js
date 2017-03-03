'use strict';

/**
 * Returns the array of 32 compass points and heading.
 * See details here:
 * https://en.wikipedia.org/wiki/Points_of_the_compass#32_cardinal_points
 *
 * @return {array}
 *
 * Example of return :
 *  [
 *     { abbreviation : 'N',     azimuth : 0.00 ,
 *     { abbreviation : 'NbE',   azimuth : 11.25 },
 *     { abbreviation : 'NNE',   azimuth : 22.50 },
 *       ...
 *     { abbreviation : 'NbW',   azimuth : 348.75 }
 *  ]
 */
function createCompassPoints() {
    //throw new Error('Not implemented');
    var sides = ['N','E','S','W'];  // use array of cardinal directions only!
  const b = 'b';
  let az = 0, out = [];
  for (let i = 0; i < sides.length; i++) {
    for (let j = 0; j < 8; j++) {
      let cur = sides[i], next = sides[(i + 1) % 4], cn = cur + next, nc = next + cur, abbr;
      switch (j) {
        case 1:
          abbr = cur + b + next;
          break;
        case 2:
          abbr = (i % 2) ? cn + cur : cur + cn;
          break;
        case 3:
          abbr = ((i % 2) ? nc : cn) + b + cur;
          break;
        case 4:
          abbr = (i % 2) ? nc : cn;
          break;
        case 5:
          abbr = ((i % 2) ? nc : cn) + b + next;
          break;
        case 6:
          abbr = next + ((i % 2) ? nc : cn);
          break;
        case 7:
          abbr = next + b + cur;
          break;
        default:
          abbr = cur;
      }
      out.push({abbreviation: abbr, azimuth: az});
      az += 11.25;
    }
  }
  return out;
}


/**
 * Expand the braces of the specified string.
 * See https://en.wikipedia.org/wiki/Bash_(Unix_shell)#Brace_expansion
 *
 * In the input string, balanced pairs of braces containing comma-separated substrings
 * represent alternations that specify multiple alternatives which are to appear at that position in the output.
 *
 * @param {string} str
 * @return {Iterable.<string>}
 *
 * NOTE: The order of output string does not matter.
 *
 * Example:
 *   '~/{Downloads,Pictures}/*.{jpg,gif,png}'  => '~/Downloads/*.jpg',
 *                                                '~/Downloads/*.gif'
 *                                                '~/Downloads/*.png',
 *                                                '~/Pictures/*.jpg',
 *                                                '~/Pictures/*.gif',
 *                                                '~/Pictures/*.png'
 *
 *   'It{{em,alic}iz,erat}e{d,}, please.'  => 'Itemized, please.',
 *                                            'Itemize, please.',
 *                                            'Italicized, please.',
 *                                            'Italicize, please.',
 *                                            'Iterated, please.',
 *                                            'Iterate, please.'
 *
 *   'thumbnail.{png,jp{e,}g}'  => 'thumbnail.png'
 *                                 'thumbnail.jpeg'
 *                                 'thumbnail.jpg'
 *
 *   'nothing to do' => 'nothing to do'
 */
function* expandBraces(str) {
  function prepare(data) {
    let search, result = [];
    search = data.match(/{([^{}]*?({*[^{}]+}*)[^{}]*)}/);
    if (search) {
      search[1] = search[1].split(/,(?![^{]*}+)/g);
      for (let i = 0; i < search[1].length; i++) {
        result.push(data.replace(search[0], search[1][i]));
      }
    }
    else result = [data];
    return result;
  }
  let out = prepare(str), cur = '', prepareNeeded = true;
  do {
    cur = out.find(function(e) {
      return (-1 < e.indexOf('{'));
    });
    prepareNeeded = (typeof cur !== 'undefined');
    if (prepareNeeded) {
      out.splice(out.indexOf(cur), 1);
      out.push(...prepare(cur));
    }
  } while (prepareNeeded);
  yield* out;
}


/**
 * Returns the ZigZag matrix
 *
 * The fundamental idea in the JPEG compression algorithm is to sort coefficient of given image by zigzag path and encode it.
 * In this task you are asked to implement a simple method to create a zigzag square matrix.
 * See details at https://en.wikipedia.org/wiki/JPEG#Entropy_coding
 * and zigzag path here: https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/JPEG_ZigZag.svg/220px-JPEG_ZigZag.svg.png
 *
 * @param {number} n - matrix dimension
 * @return {array}  n x n array of zigzag path
 *
 * @example
 *   1  => [[0]]
 *
 *   2  => [[ 0, 1 ],
 *          [ 2, 3 ]]
 *
 *         [[ 0, 1, 5 ],
 *   3  =>  [ 2, 4, 6 ],
 *          [ 3, 7, 8 ]]
 *
 *         [[ 0, 1, 5, 6 ],
 *   4 =>   [ 2, 4, 7,12 ],
 *          [ 3, 8,11,13 ],
 *          [ 9,10,14,15 ]]
 *
 */
function getZigZagMatrix(n) {
  // Initializing the matrix
  let matrix = [];
  for (let i = 0; i < n; i++) matrix.push([]);
  // Filling the matrix
  let i = 0, j = 0, mi = 1, mj = -1, hs = false, vs = false, num = 0;
  while (num < n * n) {
    matrix[i][j] = num;
    // Counting indices
    if ((i === 0 && j === 0) || (num === n * n - 2)) {
      j++;
      hs = true;
      vs = false;
    }
    else if ((i === 0 && j != n - 1 && mi < 0 && !vs) || (i === n - 1 && mj < 0 && !hs)) {
      j++;
      hs = true;
      vs = false;
      mj = 0 - mj;
      mi = 0 - mi;
    }
    else if ((j === 0 && i != n - 1 && mj < 0 && !hs) || (j === n - 1 && mi < 0 && !vs)) {
      i++;
      hs = false;
      vs = true;
      mj = 0 - mj;
      mi = 0 - mi;
    }
    else {
      i += mi;
      j += mj;
      hs = false;
      vs = false;
    }
    num++;
  }
  return matrix;
}


/**
 * Returns true if specified subset of dominoes can be placed in a row accroding to the game rules.
 * Dominoes details see at: https://en.wikipedia.org/wiki/Dominoes
 *
 * Each domino tile presented as an array [x,y] of tile value.
 * For example, the subset [1, 1], [2, 2], [1, 2] can be arranged in a row (as [1, 1] followed by [1, 2] followed by [2, 2]),
 * while the subset [1, 1], [0, 3], [1, 4] can not be arranged in one row.
 * NOTE that as in usual dominoes playing any pair [i, j] can also be treated as [j, i].
 *
 * @params {array} dominoes
 * @return {bool}
 *
 * @example
 *
 * [[0,1],  [1,1]] => true
 * [[1,1], [2,2], [1,5], [5,6], [6,3]] => false
 * [[1,3], [2,3], [1,4], [2,4], [1,5], [2,5]]  => true
 * [[0,0], [0,1], [1,1], [0,2], [1,2], [2,2], [0,3], [1,3], [2,3], [3,3]] => false
 *
 */
function canDominoesMakeRow(dominoes) {
    //throw new Error('Not implemented');
  let table = [], out = true;
  table = dominoes.shift();
  while (dominoes.length) {
    let bone;
    bone = dominoes.find((e) => (e[0] === table[0] || e[0] === table[1] || e[1] === table[0] || e[1] === table[1]));
    if (typeof bone != 'undefined') {
      if (bone[0] === table[0]) table[0] =  bone[1];
      else if (bone[1] === table[0]) table[0] = bone[0];
      else if (bone[0] === table[1]) table[1] = bone[1];
      else if (bone[1] === table[1]) table[1] = bone[0];
      dominoes.splice(dominoes.indexOf(bone), 1);
    }
    else {
      out = false;
      break;
    }
  }
  return out;
}


/**
 * Returns the string expression of the specified ordered list of integers.
 *
 * A format for expressing an ordered list of integers is to use a comma separated list of either:
 *   - individual integers
 *   - or a range of integers denoted by the starting integer separated from the end integer in the range by a dash, '-'.
 *     (The range includes all integers in the interval including both endpoints)
 *     The range syntax is to be used only for, and for every range that expands to more than two values.
 *
 * @params {array} nums
 * @return {bool}
 *
 * @example
 *
 * [ 0, 1, 2, 3, 4, 5 ]   => '0-5'
 * [ 1, 4, 5 ]            => '1,4,5'
 * [ 0, 1, 2, 5, 7, 8, 9] => '0-2,5,7-9'
 * [ 1, 2, 4, 5]          => '1,2,4,5'
 */
function extractRanges(nums) {
  let out = '';
  for (const value of nums.reduce((p, c, i) => {
    if (i === 0) return [[c]];
    else if (p[p.length - 1][p[p.length - 1].length - 1] === c - 1) p[p.length - 1].push(c);
    else p.push([c]);
    return p;
  }, [])) {
    let div = (out.length) ? ',' : '';
    switch (value.length) {
      case 0:
        break;
      case 1:
        out += `${div}${value[0]}`;
        break;
      case 2:
        out += `${div}${value[0]},${value[1]}`;
        break;
      default:
        out += `${div}${value[0]}-${value[value.length - 1]}`;
    }
  }
  return out;
}

module.exports = {
    createCompassPoints : createCompassPoints,
    expandBraces : expandBraces,
    getZigZagMatrix : getZigZagMatrix,
    canDominoesMakeRow : canDominoesMakeRow,
    extractRanges : extractRanges
};
