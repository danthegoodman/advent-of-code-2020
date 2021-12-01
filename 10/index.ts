import * as assert from 'assert';
import { readFileSync } from 'fs';
import _ = require('lodash');

function main() {
  const input = _.trim(readFileSync(__dirname + '/input.txt', 'utf8'));
  const ex1 = `\
16
10
15
5
1
11
7
19
6
12
4`;
  const ex2 = `\
28
33
18
42
31
14
46
20
48
47
24
23
49
45
19
38
39
11
1
32
25
35
8
17
7
9
4
2
34
10
3`;

  assert.strictEqual(35, solveA(ex1));
  assert.strictEqual(220, solveA(ex2));
  assert.strictEqual(2310, solveA(input));

  assert.strictEqual(8, solveB(ex1));
  assert.strictEqual(19208, solveB(ex2));
  assert.strictEqual(64793042714624, solveB(input));
}

main();

function solveA(rawInput: string) {
  const input = _.sortBy(rawInput.split('\n').map(Number));
  input.push(_.last(input)! + 3);
  let count1 = 0;
  let count3 = 0;
  let prev = 0;
  for(const n of input){
    if(prev + 1 === n){
      count1 ++;
    } else if(prev + 2 === n){
      //nope
    } else if(prev + 3 === n){
      count3 ++;
    } else {
      throw new Error("Not found")
    }
    prev = n;
  }
  return count1 * count3;
}

function solveB(rawInput: string) {
  const input = _.sortBy(rawInput.split('\n').map(Number));
  input.unshift(0);

  let count = 1;

  for(let i = 0; i < input.length - 1; ){
    let j = i;
    while(input[j] + 3 > input[j + 1]){
      j++;
    }

    if(j - i <= 1) {
      i++;
      continue;
    }

    const window = input.slice(i, j+1);
    if(window.length === 3){
      count *= 2;
    } else if(window.length === 4){
      count *= 4;
    } else if(window.length === 5){
      count *= 7;
    }

    i=j;
  }

  return count;
}
