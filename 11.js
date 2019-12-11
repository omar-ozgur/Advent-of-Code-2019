// https://adventofcode.com/2019/day/11

import * as fs from 'fs';

const dataBuffer = fs.readFileSync('11.txt');
const dataString = dataBuffer.toString();
const dataLines = dataString.split(/\r?\n/);

const getProgramOutputter = ([...instructions]) => {
  let relativeBase = 0;
  let i = 0;

  return inputs => {
    const results = [];

    while (true) {
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
        if (inputs.length === 0) {
          return results;
        }
        const input = inputs.splice(0, 1)[0];
        instructions[parameter1] = Number(input);
        i += 2;
      } else if (opcode === 4) {
        results.push(value1);
        i += 2;
      } else if (opcode === 5 || opcode === 6) {
        i = (opcode === 5 && value1 !== 0) || (opcode === 6 && value1 === 0) ? value2 : i + 3;
      } else if (opcode === 7 || opcode === 8) {
        instructions[parameter3] = (opcode === 7 && value1 < value2) || (opcode === 8 && value1 === value2) ? 1 : 0;
        i += 4;
      } else if (opcode === 9) {
        relativeBase += value1;
        i += 2;
      } else {
        return null;
      }
    }
  };
};

const DIRECTIONS = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1]
];

const COLOR_CODE_TO_COLOR = {
  0: '.',
  1: '#'
};

const COLOR_TO_COLOR_CODE = {
  '.': 0,
  '#': 1
};

const getPaintData = (instructions, boardWidth, startColorCode) => {
  const getProgramOutput = getProgramOutputter(instructions);

  const board = new Array(boardWidth);
  for (let i = 0; i < board.length; i++) {
    board[i] = new Array(boardWidth).fill('.');
  }

  let row = Math.floor(boardWidth / 2);
  let column = Math.floor(boardWidth / 2);

  let directionIndex = 0;
  let paintedCount = 0;
  let input = [startColorCode];

  const seen = new Set();

  while (true) {
    const output = getProgramOutput(input);
    if (output === null) {
      break;
    }

    const locationKey = `${row},${column}`;
    if (!seen.has(locationKey)) {
      seen.add(locationKey);
      paintedCount++;
    }

    const [colorCode, directionCode] = output;

    const color = COLOR_CODE_TO_COLOR[colorCode];
    board[row][column] = color;

    directionIndex = (directionIndex + (directionCode === 0 ? 3 : 1)) % 4;
    row += DIRECTIONS[directionIndex][0];
    column += DIRECTIONS[directionIndex][1];

    const nextColor = board[row][column];
    const nextColorCode = COLOR_TO_COLOR_CODE[nextColor];
    input = [nextColorCode];
  }

  return {
    paintedCount,
    board
  };
};

const instructions = dataLines[0].split(',').map(Number);

// Part 1
const { paintedCount } = getPaintData(instructions, 250, 0);
console.log(paintedCount);

// Part 2
const { board } = getPaintData(instructions, 100, 1);
console.log(board.map(row => row.join('')));
