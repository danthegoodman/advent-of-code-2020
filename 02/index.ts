import * as assert from 'assert';
import {readFileSync} from 'fs';
import _ = require('lodash');

function main() {
  const example = `\
1-3 a: abcde
1-3 b: cdefg
2-9 c: ccccccccc`;
  const input = _.trim(readFileSync(__dirname + '/input.txt', 'utf8'));

  assert.strictEqual(2, solveA(example));
  assert.strictEqual(586, solveA(input));

  assert.strictEqual(1, solveB(example));
  assert.strictEqual(352, solveB(input));
}

main();

function parseInput(input: string){
  return input.split('\n').map(it=>{
    const [, a, b, char, pass] = it.match(/(\d+)-(\d+) (\w): (.+)/)!;
    return {
      char, pass,
      a: Number.parseInt(a, 10),
      b: Number.parseInt(b, 10),
    }
  })
}

function solveA(rawInput: string) {
  return _.sumBy(
    parseInput(rawInput),
    it=> {
      const charCount = _.sumBy(it.pass, c=> c === it.char ? 1 : 0)
      return it.a <= charCount && charCount <= it.b ? 1 : 0
    }
  )
}

function solveB(rawInput: string) {
  return _.sumBy(
    parseInput(rawInput),
    it => {
      const a = it.pass[it.a - 1] === it.char;
      const b = it.pass[it.b - 1] === it.char;
      return a !== b ? 1 : 0;
    }
  )
}
