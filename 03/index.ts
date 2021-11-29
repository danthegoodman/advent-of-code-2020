import * as assert from 'assert';
import { readFileSync } from 'fs';
import _ = require('lodash');

function main() {
  const input = _.trim(readFileSync(__dirname + '/input.txt', 'utf8'));
  const example = `\
..##.......
#...#...#..
.#....#..#.
..#.#...#.#
.#...##..#.
..#.##.....
.#.#.#....#
.#........#
#.##...#...
#...##....#
.#..#...#.#`;

  assert.strictEqual(7, solveA(example));
  assert.strictEqual(247, solveA(input));

  assert.strictEqual(336, solveB(example));
  assert.strictEqual(2983070376, solveB(input));
}

main();

function calcCollisions(lines: string[], right: number, down: number){
  let trees = 0;
  let x = right;
  for(let i = down; i < lines.length; i+= down){
    const ln = lines[i];
    if(ln[x % ln.length] === '#'){
      trees +=1;
    }
    x += right
  }
  return trees;
}

function solveA(input: string) {
  const lines = input.split('\n');
  return calcCollisions(lines, 3, 1);
}

function solveB(input: string) {
  const lines = input.split('\n');
  return calcCollisions(lines, 1, 1) *
    calcCollisions(lines, 3, 1) *
    calcCollisions(lines, 5, 1) *
    calcCollisions(lines, 7, 1) *
    calcCollisions(lines, 1, 2);
}
