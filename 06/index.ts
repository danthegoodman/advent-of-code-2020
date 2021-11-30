import * as assert from 'assert';
import { readFileSync } from 'fs';
import _ = require('lodash');

function main() {
  const input = _.trim(readFileSync(__dirname + '/input.txt', 'utf8'));
  const example = `\
abc

a
b
c

ab
ac

a
a
a
a

b`

  assert.strictEqual(11, solveA(example));
  assert.strictEqual(6590, solveA(input));

  assert.strictEqual(6, solveB(example));
  assert.strictEqual(3288, solveB(input));
}

main();

function solveA(input: string) {
  const sections = input.split('\n\n');
  return _.sumBy(sections, s=> new Set(s.match(/[a-z]/g)!).size)
}

function solveB(input: string) {
  const sections = input.split('\n\n');
  return _.sumBy(sections, s=> {
    const counts = _.countBy((s + '\n').split(''));
    const lines = counts['\n'];
    const matching = _.sumBy(
      Object.values(counts),
      it=> it === lines ? 1 : 0
    );
    return matching - 1
  })
}
