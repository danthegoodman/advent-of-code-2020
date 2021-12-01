import * as assert from 'assert';
import { readFileSync } from 'fs';
import _ = require('lodash');

function main() {
  const input = _.trim(readFileSync(__dirname + '/input.txt', 'utf8'));
  const example = `\
L.LL.LL.LL
LLLLLLL.LL
L.L.L..L..
LLLL.LL.LL
L.LL.LL.LL
L.LLLLL.LL
..L.L.....
LLLLLLLLLL
L.LLLLLL.L
L.LLLLL.LL`;

  assert.strictEqual(37, solveA(example));
  assert.strictEqual(2261, solveA(input));

  assert.strictEqual(26, solveB(example));
  assert.strictEqual(2039, solveB(input));
}

main();

type Grid = (0|1|2)[][]

function parseInput(input:string): Grid{
  return input.split('\n').map(it=>it.split('').map(it=>it === '.' ? 0 : 1));
}

function countNeighborsA(g: Grid, r: number, c: number){
  let result = 0;
  const check = (a:number,b:number)=> {
    if(g[r+a]?.[c+b] === 2) result ++;
  }
  check(-1,-1);
  check(-1,+0);
  check(-1,+1);
  check(+0,-1);

  check(+0,+1);
  check(+1,-1);
  check(+1,+0);
  check(+1,+1);
  return result;
}

function mutateA(grid: Grid){
  return grid.map((row, r)=>
    row.map((val, c)=>{
      if(val === 1 && countNeighborsA(grid, r, c) === 0) return 2;
      if(val === 2 && countNeighborsA(grid, r, c) >= 4) return 1;
      return val;
    })
  )
}

function solveA(input: string) {
  let grid = parseInput(input);
  let gridStr = "";
  while(true){
    const next = mutateA(grid);
    const nextStr = String(next);
    if(nextStr === gridStr){
      break;
    }
    gridStr = nextStr;
    grid = next;
  }
  return _.sumBy(grid, row=> _.sumBy(row, v=> v === 2 ? 1 : 0));
}

function countNeighborsB(g: Grid, r: number, c: number){
  let result = 0;
  const check = (i:number,j:number)=> {
    let r2 = r + i;
    let c2 = c + j;
    while(true){
      const v2 = g[r2]?.[c2];
      r2 += i;
      c2 += j;
      if(v2 === 0) continue;
      if(v2 === 2) result ++;
      break;
    }
  }
  check(-1,-1);
  check(-1,+0);
  check(-1,+1);
  check(+0,-1);

  check(+0,+1);
  check(+1,-1);
  check(+1,+0);
  check(+1,+1);
  return result;
}

function mutateB(grid: Grid){
  return grid.map((row, r)=>
    row.map((val, c)=>{
      if(val === 1 && countNeighborsB(grid, r, c) === 0) return 2;
      if(val === 2 && countNeighborsB(grid, r, c) >= 5) return 1;
      return val;
    })
  )
}

function solveB(input: string) {
  let grid = parseInput(input);
  let gridStr = "";
  while(true){
    const next = mutateB(grid);
    const nextStr = String(next);
    if(nextStr === gridStr){
      break;
    }
    gridStr = nextStr;
    grid = next;
  }
  return _.sumBy(grid, row=> _.sumBy(row, v=> v === 2 ? 1 : 0));
}
