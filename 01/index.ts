import * as assert from 'assert';
import { readFileSync } from 'fs';
import _ = require('lodash');

function main(){
  const input = _.trim(readFileSync(__dirname + '/input.txt', 'utf8'));
  const example = `
1721
979
366
299
675
1456`

  assert.strictEqual(514579, solveA(example))
  assert.strictEqual(319531, solveA(input))

  assert.strictEqual(241861950, solveB(example))
  assert.strictEqual(244300320, solveB(input))
}

function solveA(input: string): number {
  let lines = input.trim().split('\n').map(Number)
  for(const x of lines){
    for(const y of lines){
      if ( x + y === 2020){
        return x * y;
      }
    }
  }
  throw new Error("not found");
}

function solveB(input: string): number {
  let lines = input.trim().split('\n').map(Number)
  for(const x of lines){
    for(const y of lines){
      for(const z of lines) {
        if (x + y + z === 2020) {
          return x * y * z;
        }
      }
    }
  }
  throw new Error("not found");
}

main()
