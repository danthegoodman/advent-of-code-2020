import * as assert from 'assert';
import { readFileSync } from 'fs';
import _ = require('lodash');

const example = `\
ecl:gry pid:860033327 eyr:2020 hcl:#fffffd
byr:1937 iyr:2017 cid:147 hgt:183cm

iyr:2013 ecl:amb cid:350 eyr:2023 pid:028048884
hcl:#cfa07d byr:1929

hcl:#ae17e1 iyr:2013
eyr:2024
ecl:brn pid:760753108 byr:1931
hgt:179cm

hcl:#cfa07d eyr:2025 pid:166559648
iyr:2011 ecl:brn hgt:59in`;

function main() {
  const input = _.trim(readFileSync(__dirname + '/input.txt', 'utf8'));

  assert.strictEqual(2, solveA(example));
  assert.strictEqual(202, solveA(input));

  assert.strictEqual(0, solveB(`\
eyr:1972 cid:100
hcl:#18171d ecl:amb hgt:170 pid:186cm iyr:2018 byr:1926

iyr:2019
hcl:#602927 eyr:1967 hgt:170cm
ecl:grn pid:012533040 byr:1946

hcl:dab227 iyr:2012
ecl:brn hgt:182cm pid:021572410 eyr:2020 byr:1992 cid:277

hgt:59cm ecl:zzz
eyr:2038 hcl:74454a iyr:2023
pid:3556412378 byr:2007`));
  assert.strictEqual(4, solveB(`\
pid:087499704 hgt:74in ecl:grn iyr:2012 eyr:2030 byr:1980
hcl:#623a2f

eyr:2029 ecl:blu cid:129 byr:1989
iyr:2014 pid:896056539 hcl:#a97842 hgt:165cm

hcl:#888785
hgt:164cm byr:2001 iyr:2015 cid:88
pid:545766238 ecl:hzl
eyr:2022

iyr:2010 hgt:158cm hcl:#b6652a ecl:blu byr:1944 eyr:2021 pid:093154719`));
  assert.strictEqual(137, solveB(input));
}

main();

function parseInput(input: string){
  return input.split('\n\n').map(s =>
    Object.fromEntries(
      s.replace(/\n/g, ' ').split(' ').map(it=> it.split(':'))
    )
  );
}

function hasFields(d: any){
  return d.byr && d.iyr && d.eyr && d.hgt && d.hcl && d.ecl && d.pid;
}

function solveA(input: string) {
  return _.sumBy(
    parseInput(input),
    d=> hasFields(d) ? 1 : 0
  )
}

function solveB(input: string) {
  return _.sumBy(
    parseInput(input),
    d=> {
      console.log(d, isFullValid(d));
      return isFullValid(d) ? 1 : 0;
    }
  )
}

function isFullValid(d: any) {
  if (!hasFields(d)) return false;

  if (!d.byr.match(/^\d{4}$/)) return false;
  const byr = Number.parseInt(d.byr, 10);
  if (byr < 1920 || 2002 < byr) return false;

  if (!d.iyr.match(/^\d{4}$/)) return false;
  const iyr = Number.parseInt(d.iyr, 10);
  if (iyr < 2010 || 2020 < iyr) return false;

  if (!d.eyr.match(/^\d{4}$/)) return false;
  const eyr = Number.parseInt(d.eyr, 10);
  if (eyr < 2020 || 2030 < eyr) return false;

  const hgt = d.hgt.match(/^(\d+)(cm|in)$/);
  if (!hgt) return false;
  if (hgt[2] === 'cm' && (hgt[1] < 150 || 193 < hgt[1])) return false;
  if (hgt[2] === 'in' && (hgt[1] < 59 || 76 < hgt[1])) return false;

  if (!d.hcl.match(/^#[0-9a-f]{6}$/)) return false;

  if (!['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].includes(d.ecl)) return false;

  if (!d.pid.match(/^\d{9}$/)) return false;

  return true;
}
