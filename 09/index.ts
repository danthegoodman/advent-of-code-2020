import * as assert from 'assert';
import { readFileSync } from 'fs';
import _ = require('lodash');

function main() {
  const input = _.trim(readFileSync(__dirname + '/input.txt', 'utf8'));
  const example = `\
35
20
15
25
47
40
62
55
65
95
102
117
150
182
127
219
299
277
309
576`;

  const solnEx = solveA(example , 5);
  assert.strictEqual(127, solnEx);
  const solnA = solveA(input, 25);
  assert.strictEqual(257342611, solnA);

  assert.strictEqual(62, solveB(example, solnEx));
  assert.strictEqual(35602097, solveB(input, solnA));
}

main();

function solveA(rawInput: string, scanSize: number) {
  const input = rawInput.split('\n').map(Number);
  const window = input.slice(0, scanSize);
  for(const n of input.slice(scanSize)){
    if(!hasMatch(window, n)){
      return n;
    }
    window.shift();
    window.push(n);
  }
  return input.length;
}

function hasMatch(window: number[], n: number){
  for(let i = 0; i < window.length; i++){
    for(let j = i + 1; j < window.length; j++){
      if(window[i] + window[j] === n) {
        return true;
      }
    }
  }
  return false;
}

function solveB(rawInput: string, target: number) {
  const input = rawInput.split('\n').map(Number);

  const window = [];
  let sum = 0;
  for(const n of input){
    window.push(n);
    sum += n;
    while(sum > target){
      sum -= window.shift()!;
    }
    if(sum === target){
      return _.min(window)! + _.max(window)!;
    }
  }
  throw new Error("not found")
}
