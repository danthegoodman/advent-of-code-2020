import * as assert from 'assert';
import {readFileSync} from 'fs';
import _ = require('lodash');

function main() {
  const input = _.trim(readFileSync(__dirname + '/input.txt', 'utf8'));

  assert.strictEqual(436, solve("0,3,6", 2020));
  assert.strictEqual(1, solve("s1,3,2", 2020));
  assert.strictEqual(10, solve("2,1,3", 2020));
  assert.strictEqual(27, solve("1,2,3", 2020));
  assert.strictEqual(78, solve("2,3,1", 2020));
  assert.strictEqual(438, solve("3,2,1", 2020));
  assert.strictEqual(1836, solve("3,1,2", 2020));
  assert.strictEqual(475, solve(input, 2020));

  // assert.strictEqual(175594, solve("0,3,6", 30000000));
  // assert.strictEqual(2578, solve("1,3,2", 30000000));
  // assert.strictEqual(3544142, solve("2,1,3", 30000000));
  // assert.strictEqual(261214, solve("1,2,3", 30000000));
  // assert.strictEqual(6895259, solve("2,3,1", 30000000));
  // assert.strictEqual(18, solve("3,2,1", 30000000));
  // assert.strictEqual(362, solve("3,1,2", 30000000));
  assert.strictEqual(11261, solve(input, 30000000));
}

main();

function solve(input: string, tgt: number) {
  let initial = input.split(',').map(Number);
  let turns = new Map<number, number>(
    Array.from(initial.entries(), ([a, b]) => [b, a])
  );
  let t = initial.length - 1;
  let nextVal = 0;

  while(t < (tgt-2)){
    t++;
    let val = nextVal;
    if(turns.has(val)){
      nextVal = (t) - turns.get(val)!;
    } else {
      nextVal = 0;
    }
    turns.set(val, t);
  }

  return nextVal;
}
