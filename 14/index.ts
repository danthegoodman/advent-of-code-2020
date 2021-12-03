import * as assert from 'assert';
import {readFileSync} from 'fs';
import _ = require('lodash');

function main() {
  const input = _.trim(readFileSync(__dirname + '/input.txt', 'utf8'));

  const example = `\
mask = XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X
mem[8] = 11
mem[7] = 101
mem[8] = 0`
  assert.strictEqual(165, solveA(example));
  assert.strictEqual(6631883285184, solveA(input));

  const ex2 = `\
mask = 000000000000000000000000000000X1001X
mem[42] = 100
mask = 00000000000000000000000000000000X0XX
mem[26] = 1`;
  assert.strictEqual(208, solveB(ex2));
  assert.strictEqual(3161838538691, solveB(input));
}

main();

function solveA(input: string) {
  const lines = input.split('\n');

  let mask = '';
  let vals: Record<string, number> = {};
  for(const ln of lines){
    if(ln.startsWith("mask")){
      mask = ln.split(' = ')[1];
    } else {
      const [addr, val] = ln.match(/(\d+)/g)!;
      vals[addr] = applyMaskA(val, mask);
    }
  }

  return Number(_.sum(Object.values(vals)));
}

function applyMaskA(val: string, mask: string){
  const bitwise = Number(val).toString(2).padStart(36,'0').split('');
  for(let i = 0; i < mask.length; i++){
    if (mask[i] === 'X') continue;
    bitwise[i] = mask[i];
  }
  return Number.parseInt(bitwise.join(''), 2);
}

function solveB(input: string) {
  const lines = input.split('\n');

  let mask = '';
  let vals: Record<number, number> = {};
  for(const ln of lines){
    if(ln.startsWith("mask")){
      mask = ln.split(' = ')[1];
    } else {
      const [addr, val] = ln.match(/(\d+)/g)!.map(Number);
      const bitwise = addr.toString(2).padStart(36,'0').split('');
      for(let a of iterAddrs(bitwise, mask, 0)){
        vals[a] = val;
      }
    }
  }

  return Number(_.sum(Object.values(vals)));
}

function* iterAddrs(bitwise: string[], mask: string, index: number): Generator<number>{
  for(let i = index; i < mask.length; i++){
    if (mask[i] === '0') continue;
    if (mask[i] === '1') {
      bitwise[i] = '1';
      continue;
    }

    const a = Array.from(bitwise);
    const b = Array.from(bitwise);
    a[i] = '0'
    b[i] = '1'
    yield* iterAddrs(a, mask, i+1);
    yield* iterAddrs(b, mask, i+1);
    return;
  }

  yield Number.parseInt(bitwise.join(''), 2);
}
