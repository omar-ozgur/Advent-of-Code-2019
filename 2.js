// https://adventofcode.com/2019/day/2

import * as fs from 'fs';

const dataBuffer = fs.readFileSync('2.txt');
const dataString = dataBuffer.toString();
const dataLines = dataString.split(/\r?\n/);

const getProgramOutput = ([...codes], noun, verb) => {
  codes[1] = noun;
  codes[2] = verb;

  for (let i = 0; i < codes.length; i += 4) {
    const opcode = codes[i];
    if (opcode === 99) {
      return codes[0];
    }

    const parameterAddress1 = codes[i + 1];
    const parameter1 = codes[parameterAddress1];

    const parameterAddress2 = codes[i + 2];
    const parameter2 = codes[parameterAddress2];

    const resultAddress = codes[i + 3];
    codes[resultAddress] = opcode === 1 ? parameter1 + parameter2 : parameter1 * parameter2;
  }
};

const codes = dataLines[0].split(',').map(Number);

// Part 1
console.log(getProgramOutput(codes, 12, 2));

// Part 2
for (let noun = 0; noun <= 99; noun++) {
  for (let verb = 0; verb <= 99; verb++) {
    if (getProgramOutput(codes, noun, verb) === 19690720) {
      console.log(100 * noun + verb);
    }
  }
}
