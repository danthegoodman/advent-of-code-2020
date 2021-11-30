import * as assert from 'assert';
import {readFileSync} from 'fs';
import _ = require('lodash');

const example = `\
light red bags contain 1 bright white bag, 2 muted yellow bags.
dark orange bags contain 3 bright white bags, 4 muted yellow bags.
bright white bags contain 1 shiny gold bag.
muted yellow bags contain 2 shiny gold bags, 9 faded blue bags.
shiny gold bags contain 1 dark olive bag, 2 vibrant plum bags.
dark olive bags contain 3 faded blue bags, 4 dotted black bags.
vibrant plum bags contain 5 faded blue bags, 6 dotted black bags.
faded blue bags contain no other bags.
dotted black bags contain no other bags.`

function main() {
  const input = _.trim(readFileSync(__dirname + '/input.txt', 'utf8'));

  assert.strictEqual(4, solveA(example));
  assert.strictEqual(169, solveA(input));

  assert.strictEqual(32, solveB(example));
  assert.strictEqual(82372, solveB(input));
}

main();

function parseInput(input: string) {
  return new Map(
    input.split('\n').map(l=> {
      const [, name, insideDesc] = l.match(/(.+) bags contain (.*)\./)!;
      if(insideDesc === 'no other bags'){
        return [name, new Map()];
      }

      const inside = new Map(
        insideDesc.split(', ').map(it=>{
          const [,count,inName] = it.match(/(\d+) (.+) bags?/)!;
          return [inName, Number.parseInt(count, 10)]
        })
      )
      return [name, inside]
    })
  )
}

function solveA(input: string) {
  const rules = parseInput(input);
  const target = 'shiny gold';
  return _.sumBy(
    Array.from(rules.entries()),
    ([name, inside])=> name !== target && canContainTarget(inside) ? 1 : 0
  )

  function canContainTarget(options: Map<string, number>): boolean{
    if(options.get(target)){
      return true;
    }
    let subRules = Array.from(options.keys(), (it)=> rules.get(it)!);
    return subRules.some(canContainTarget);
  }
}

function solveB(input: string) {
  const rules = parseInput(input);
  const target = 'shiny gold';
  return countSelfAndChildren(rules.get(target)!) - 1;

  function countSelfAndChildren(options: Map<string, number>): number {
    return 1 + _.sumBy(
      Array.from(options),
      ([name, count])=> count * countSelfAndChildren(rules.get(name)!)
    )
  }
}
