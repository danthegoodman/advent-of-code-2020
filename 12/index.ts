import * as assert from 'assert';
import { readFileSync } from 'fs';
import _ = require('lodash');

function main() {
  const input = _.trim(readFileSync(__dirname + '/input.txt', 'utf8'));
const example = `\
F10
N3
F7
R90
F11`;

  assert.strictEqual(25, solveA(example));
  assert.strictEqual(319, solveA(input));

  assert.strictEqual(286, solveB(example));
  assert.strictEqual(50157, solveB(input));
}

main();

function nextLeftDir(dir: {x:number, y:number}){
  if(dir.x === +1) return {x:0,y:-1};
  if (dir.x === -1) return {x:0,y:1};
  if (dir.y === +1) return {x:1,y:0};
  if (dir.y === -1) return {x:-1,y:0};
  throw new Error("bad dir");
}

function solveA(input: string) {
  const actions = input.split('\n').map(it=> [it[0], Number.parseInt(it.slice(1))] as const)
  let x = 0;
  let y = 0;
  let dir = {x:1,y:0};
  for(const [code, num] of actions){
    if (code === 'F') {
      x += (dir.x * num);
      y += (dir.y * num);
    } else if (code === 'L'){
      let count = Math.round(num/90);
      for(let i = 0; i < count; i++) {
        dir = nextLeftDir(dir);
      }
    } else if (code === 'R'){
      let count = 4 - Math.round(num/90);
      for(let i = 0; i < count; i++) {
        dir = nextLeftDir(dir);
      }
    } else if (code === 'N') y -= num;
    else if (code === 'S') y += num;
    else if (code === 'E') x += num;
    else if (code === 'W') x -= num;
    else {
      throw new Error(`Invalid code: ${code}`)
    }
  }
  return Math.abs(x) + Math.abs(y);
}

function solveB(input: string) {
  const actions = input.split('\n').map(it=> [it[0], Number.parseInt(it.slice(1))] as const)
  let shipX = 0;
  let shipY = 0;
  let wayX = 10;
  let wayY = -1;
  for(const [code, num] of actions){
    if (code === 'F') {
      shipX += (wayX * num);
      shipY += (wayY * num);
    } else if (code === 'L'){
      let count = Math.round(num/90);
      for(let i = 0; i < count; i++) {
        ([wayX, wayY] = [wayY,-wayX]);
      }
    } else if (code === 'R'){
      let count = Math.round(num/90);
      for(let i = 0; i < count; i++) {
        ([wayX, wayY] = [-wayY,wayX]);
      }
    } else if (code === 'N') wayY -= num;
    else if (code === 'S') wayY += num;
    else if (code === 'E') wayX += num;
    else if (code === 'W') wayX -= num;
    else {
      throw new Error(`Invalid code: ${code}`)
    }
  }

  return Math.abs(shipX) + Math.abs(shipY);
}
