// https://adventofcode.com/2019/day/5

import * as fs from 'fs';
import readlineSync from 'readline-sync';

const dataBuffer = fs.readFileSync('5.txt');
const dataString = dataBuffer.toString();
const dataLines = dataString.split(/\r?\n/);

const getProgramOutput = ([...instructions]) => {
  for (let i = 0; i < instructions.length; ) {
    const instruction = instructions[i].toString();

    const opcode = instruction.length <= 2 ? Number(instruction) : Number(instruction.slice(instruction.length - 2));
    const firstMode = instruction.length >= 3 ? Number(instruction[instruction.length - 3]) : 0;
    const secondMode = instruction.length >= 4 ? Number(instruction[instruction.length - 4]) : 0;

    if (instruction === 99) {
      return instructions[0];
    }

    if (opcode === 1 || opcode === 2) {
      const parameter1 = instructions[i + 1];
      const value1 = firstMode === 0 ? instructions[parameter1] : parameter1;

      const parameter2 = instructions[i + 2];
      const value2 = secondMode === 0 ? instructions[parameter2] : parameter2;

      const parameter3 = instructions[i + 3];
      instructions[parameter3] = opcode === 1 ? value1 + value2 : value1 * value2;

      i += 4;
    } else if (opcode === 3) {
      const parameter = instructions[i + 1];

      const input = readlineSync.question('input: ');
      const value = Number(input);
      instructions[parameter] = value;

      i += 2;
    } else if (opcode === 4) {
      const parameter = instructions[i + 1];
      const value = instructions[parameter];

      console.log(value);

      i += 2;
    } else if (opcode === 5 || opcode === 6) {
      const parameter1 = instructions[i + 1];
      const value1 = firstMode === 0 ? instructions[parameter1] : parameter1;

      if ((opcode === 5 && value1 !== 0) || (opcode === 6 && value1 === 0)) {
        const parameter2 = instructions[i + 2];
        const value2 = secondMode === 0 ? instructions[parameter2] : parameter2;

        i = value2;
      } else {
        i += 3;
      }
    } else if (opcode === 7 || opcode === 8) {
      const parameter1 = instructions[i + 1];
      const value1 = firstMode === 0 ? instructions[parameter1] : parameter1;

      const parameter2 = instructions[i + 2];
      const value2 = secondMode === 0 ? instructions[parameter2] : parameter2;

      const parameter3 = instructions[i + 3];
      instructions[parameter3] = (opcode === 7 && value1 < value2) || (opcode === 8 && value1 === value2) ? 1 : 0;

      i += 4;
    } else {
      return;
    }
  }
};

const instructions = dataLines[0].split(',').map(Number);

getProgramOutput(instructions);
