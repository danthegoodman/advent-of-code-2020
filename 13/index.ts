import * as assert from 'assert';
import {readFileSync} from 'fs';
import _ = require('lodash');

function main() {
  const input = _.trim(readFileSync(__dirname + '/input.txt', 'utf8'));
  const example = `\
939
7,13,x,x,59,x,31,19`
  assert.strictEqual(295, solveA(example));
  assert.strictEqual(6568, solveA(input));

  assert.strictEqual(1068781, solveB(example));
  assert.strictEqual(3417, solveB('0\n17,x,13,19'));
  assert.strictEqual(754018, solveB('0\n67,7,59,61'));
  assert.strictEqual(779210, solveB('0\n67,x,7,59,61'));
  assert.strictEqual(1261476, solveB('0\n67,7,x,59,61'));
  assert.strictEqual(1202161486, solveB('0\n1789,37,47,1889'));
  assert.strictEqual(554865447501099, solveB(input));
}

main();

type Bus = [bigint,bigint];

function solveA(input: string) {
  const [time, ...ids] = input.match(/(\d+)/g)!.map(Number);
  let idWaits = ids.map(id=> ({id, wait:id - (time % id)}));
  const min = _.minBy(idWaits, it=> it.wait)!;
  return min.id * min.wait;
}

function solveB(input: string){
  const busEntries = input.split('\n')[1].split(',').entries();
  const buses:Bus[] = Array.from(busEntries)
    .filter(it=> it[1] !== 'x')
    .map(([a,b])=> [BigInt(a), BigInt(b)]);

  let a = buses.shift()!;
  while(buses.length){
    let b = buses.shift()!;
    a = alignBuses(a, b);
  }

  return Number(a[0]);
}

// gravy. I'm not skilled enough at math to come up with these on my own.
// Source: https://math.stackexchange.com/questions/2218763/how-to-find-lcm-of-two-numbers-when-one-starts-with-an-offset

function alignBuses(a: Bus, b: Bus): Bus {
  let [period, phase] = combinePhasedRotations(
    a[1], pyMod(-a[0], a[1]),
    b[1], pyMod(-(b[1]-b[0]), b[1])
  )
  return [pyMod(-phase, period), period];
}

function combinePhasedRotations(aPeriod: bigint, aPhase: bigint, bPeriod: bigint, bPhase: bigint){
  let [gcd, s] = extendedGcd(aPeriod, bPeriod);
  let phaseDifference = aPhase - bPhase
  let pdMult = phaseDifference / gcd;
  let pdRemainder = pyMod(phaseDifference, gcd);
  if (pdRemainder){
    throw new Error("Rotation reference points never synchronize.")
  }

  let combinedPeriod = aPeriod / gcd * bPeriod
  let combinedPhase = pyMod(aPhase - s * pdMult * aPeriod, combinedPeriod)
  return [combinedPeriod, combinedPhase]
}

function extendedGcd(a: bigint, b:bigint){
  let old_r = a;
  let old_s = 1n;
  let old_t = 0n;
  let r = b;
  let s = 0n;
  let t = 1n;
  while (r){
    const quotient = old_r / r;
    const remainder = pyMod(old_r,r);
    old_r = r;
    r = remainder;
    ([old_s,s] = [s, old_s - quotient * s]);
    ([old_t,t] = [t, old_t - quotient * t]);
  }
  return [old_r, old_s, old_t]
}

//Modulo, python style
function pyMod(a: bigint, b:bigint){
  if(a < 0n){
    return ((a % b)+b) % b
  } else {
    return a % b;
  }
}
