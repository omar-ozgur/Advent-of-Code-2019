// https://adventofcode.com/2019/day/13

import * as fs from 'fs';

const EXTRA_SPACE_LENGTH = 1000;

const dataBuffer = fs.readFileSync('13.txt');
const dataString = dataBuffer.toString();
const dataLines = dataString.split(/\r?\n/);

const getProgramOutput = ([...instructions]) => {
  const extraSpace = new Array(EXTRA_SPACE_LENGTH).fill(0);
  instructions = [...instructions, ...extraSpace];
  let relativeBase = 0;
  const outputs = [];

  for (let i = 0; i < instructions.length; ) {
    const instruction = instructions[i].toString();

    const opcode = instruction.length <= 2 ? Number(instruction) : Number(instruction.slice(instruction.length - 2));
    const firstMode = instruction.length >= 3 ? Number(instruction[instruction.length - 3]) : 0;
    const secondMode = instruction.length >= 4 ? Number(instruction[instruction.length - 4]) : 0;
    const thirdMode = instruction.length >= 5 ? Number(instruction[instruction.length - 5]) : 0;

    const parameter1 = instructions[i + 1] + (firstMode === 2 ? relativeBase : 0);
    const parameter2 = instructions[i + 2] + (secondMode === 2 ? relativeBase : 0);
    const parameter3 = instructions[i + 3] + (thirdMode === 2 ? relativeBase : 0);

    const value1 = firstMode === 1 ? parameter1 : instructions[parameter1];
    const value2 = secondMode === 1 ? parameter2 : instructions[parameter2];

    if (opcode === 1 || opcode === 2) {
      instructions[parameter3] = opcode === 1 ? value1 + value2 : value1 * value2;
      i += 4;
    } else if (opcode === 3) {
      instructions[parameter1] = 0;
      i += 2;
    } else if (opcode === 4) {
      outputs.push(value1);
      i += 2;
    } else if (opcode === 5 || opcode === 6) {
      i = (opcode === 5 && value1 !== 0) || (opcode === 6 && value1 === 0) ? value2 : i + 3;
    } else if (opcode === 7 || opcode === 8) {
      instructions[parameter3] = (opcode === 7 && value1 < value2) || (opcode === 8 && value1 === value2) ? 1 : 0;
      i += 4;
    } else if (opcode === 9) {
      relativeBase += value1;
      i += 2;
    } else if (opcode === 99) {
      return outputs;
    } else {
      return null;
    }
  }
};

const getTileCount = (outputs, tile) => {
  const sequences = [];
  for (let i = 0; i < outputs.length; i += 3) {
    sequences.push(outputs.slice(i, i + 3));
  }

  let count = 0;
  for (let i = 0; i < sequences.length; i++) {
    if (sequences[i][2] === tile) {
      count++;
    }
  }

  return count;
};

// Part 1
const instructions = dataLines[0].split(',').map(Number);
const outputs1 = getProgramOutput(instructions);
console.log(getTileCount(outputs1, 2));

// Part 2 (change the board within the intcode first to make a giant paddle)
instructions[0] = 2;
const outputs2 = getProgramOutput(instructions);
console.log(outputs2[outputs2.length - 1]);
