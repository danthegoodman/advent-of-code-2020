import * as assert from 'assert';
import { readFileSync } from 'fs';
import _ = require('lodash');

function main() {
  const input = _.trim(readFileSync(__dirname + '/input.txt', 'utf8'));
  const example = `\
nop +0
acc +1
jmp +4
acc +3
jmp -3
acc -99
acc +1
jmp -4
acc +6`;

  assert.strictEqual(5, solveA(example));
  assert.strictEqual(1563, solveA(input));

  assert.strictEqual(8, solveB(example));
  assert.strictEqual(767, solveB(input));
}

main();

function parseInput(input: string){
  return input.split('\n').map(it=> ({
    code: it.slice(0,3),
    val: Number.parseInt(it.slice(4))
  }));
}

function runUntilRepeatOrExit(instrs: ReturnType<typeof parseInput>){
  let accum = 0;
  let pos = 0;
  const posSeen = new Set<number>();
  while(true){
    if(pos >= instrs.length){
      return {type: 'exit', value: accum} as const
    }

    if(posSeen.has(pos)){
      return {type: 'repeat', value: accum} as const
    }

    posSeen.add(pos);
    const i = instrs[pos];
    if(i.code === 'nop'){
      pos += 1;
    } else if(i.code === 'acc'){
      accum += i.val;
      pos += 1;
    } else if(i.code === 'jmp'){
      pos += i.val;
    }
  }
}

function solveA(input: string) {
  const instrs = parseInput(input);
  const result = runUntilRepeatOrExit(instrs);
  if(result.type !== 'repeat'){
    throw new Error(`Did not repeat`)
  }
  return result.value;
}

function solveB(input: string) {
  const instrs = parseInput(input);
  for(const [ndx, instr] of instrs.entries()){
    if(instr.code === 'nop' || instr.code === 'jmp'){
      const modified = clone(instrs);
      modified[ndx].code = instr.code === 'nop' ? 'jmp' : 'nop';
      const result = runUntilRepeatOrExit(modified);
      if(result.type === 'exit'){
        return result.value;
      }
    }
  }
  throw new Error("never exited");
}
function clone<T>(obj: T): T{
  return JSON.parse(JSON.stringify(obj));
}
