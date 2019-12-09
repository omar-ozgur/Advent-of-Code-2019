// https://adventofcode.com/2019/day/7

import * as fs from 'fs';

const dataBuffer = fs.readFileSync('7.txt');
const dataString = dataBuffer.toString();
const dataLines = dataString.split(/\r?\n/);

const getPermutations = input => {
  if (input.length <= 1) {
    return [input];
  }

  const permutations = [];
  for (let i = 0; i < input.length; i++) {
    const element = input[i];
    const remainingInput = [...input.slice(0, i), ...input.slice(i + 1)];
    const newPermutations = getPermutations(remainingInput).map(permutation => [element, ...permutation]);
    permutations.push(...newPermutations);
  }
  return permutations;
};

const getProgramOutput = ([...instructions], [...inputs]) => {
  for (let i = 0; i < instructions.length; ) {
    const instruction = instructions[i].toString();

    const opcode = instruction.length <= 2 ? Number(instruction) : Number(instruction.slice(instruction.length - 2));
    const firstMode = instruction.length >= 3 ? Number(instruction[instruction.length - 3]) : 0;
    const secondMode = instruction.length >= 4 ? Number(instruction[instruction.length - 4]) : 0;

    if (opcode === 99) {
      return { opcode, value: instructions[0] };
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
      if (inputs.length === 0) {
        return { opcode, value: null };
      }

      const input = inputs.splice(0, 1)[0];
      const parameter = instructions[i + 1];

      instructions[parameter] = input;

      i += 2;
    } else if (opcode === 4) {
      const parameter = instructions[i + 1];
      const value = instructions[parameter];

      if (inputs.length === 0) {
        return { opcode, value };
      }

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
      return { opcode, value: null };
    }
  }
};

const getResultFromAmplifiers = (instructions, phaseSettings, shouldLoop) => {
  const amplifiers = {};
  const numAmplifiers = phaseSettings.length;

  for (let amplifierId = 0; amplifierId < numAmplifiers; amplifierId++) {
    const amplifier = { data: [phaseSettings[amplifierId]] };
    amplifiers[amplifierId] = amplifier;
  }

  amplifiers[0].data.push(0);

  let nextAmplifierId = 0;
  while (true) {
    const currentAmplifierId = nextAmplifierId;
    const currentAmplifier = amplifiers[currentAmplifierId];
    const { opcode, value } = getProgramOutput(instructions, currentAmplifier.data);

    const isResultOpcode = opcode === 99 || (!shouldLoop && opcode === 4);
    if (isResultOpcode && currentAmplifierId === numAmplifiers - 1) {
      return opcode === 99 ? currentAmplifier.lastValue : value;
    }

    nextAmplifierId = currentAmplifierId < numAmplifiers - 1 ? currentAmplifierId + 1 : 0;
    amplifiers[nextAmplifierId].data.push(value);
    currentAmplifier.lastValue = value;
  }
};

const getHighestResultFromAmplifiers = (instructions, initialPhaseSettings, shouldLoop) => {
  const phaseSettingPermutations = getPermutations(initialPhaseSettings);
  const resultsFromAmplifiers = phaseSettingPermutations.map(phaseSettings =>
    getResultFromAmplifiers(instructions, phaseSettings, shouldLoop)
  );
  return Math.max(...resultsFromAmplifiers);
};

// Part 1
const instructions = dataLines[0].split(',').map(Number);
console.log(getHighestResultFromAmplifiers(instructions, [0, 1, 2, 3, 4], false));

// Part 2
console.log(getHighestResultFromAmplifiers(instructions, [5, 6, 7, 8, 9], true));
