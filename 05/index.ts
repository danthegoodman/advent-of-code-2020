import * as assert from 'assert';
import { readFileSync } from 'fs';
import _ = require('lodash');

function main() {
  const input = _.trim(readFileSync(__dirname + '/input.txt', 'utf8'));

  const example = `\
BFFFBBFRRR
FFFBBBFRRR
BBFFBBFRLL`

  assert.strictEqual(820, solveA(example));
  assert.strictEqual(991, solveA(input));

  assert.strictEqual(534, solveB(input));
}

main();

function parseInput(input: string){
  return input.split('\n').map(l=>{
    const rowBin = l.slice(0,7).split('').map(it=>it === 'F' ? 0 : 1).join('');
    const colBin = l.slice(7).split('').map(it=>it === 'L' ? 0 : 1).join('');
    const row = Number.parseInt(rowBin, 2);
    const col = Number.parseInt(colBin, 2);
    return (row * 8) + col;
  })
}

function solveA(input: string) {
  return _.max(parseInput(input))
}

function solveB(input: string) {
  const ids = _.sortBy(parseInput(input));
  for(let i = 1; i < ids.length - 1; i++){
    const a = ids[i-1];
    const b = ids[i];
    const c = ids[i+1];
    if(a + 1 === b && b + 2 === c){
      return b + 1;
    }
  }
  throw new Error("not found");
}
