// https://adventofcode.com/2019/day/3

import * as fs from 'fs';

const dataBuffer = fs.readFileSync('3.txt');
const dataString = dataBuffer.toString();
const dataLines = dataString.split(/\r?\n/);

const getStepsForCoordinates = ([...instructions]) => {
  let totalSteps = 0;
  const currentCoordinate = [0, 0];
  const stepsForCoordinate = {};

  for (let i = 0; i < instructions.length; i++) {
    totalSteps++;

    const instruction = instructions[i];
    const direction = instruction[0];
    const instructionSteps = Number(instruction.slice(1));

    currentCoordinate[0] += direction === 'R' ? 1 : direction === 'L' ? -1 : 0;
    currentCoordinate[1] += direction === 'U' ? 1 : direction === 'D' ? -1 : 0;
    const coordinateKey = JSON.stringify(currentCoordinate);
    if (!(coordinateKey in stepsForCoordinate)) {
      stepsForCoordinate[coordinateKey] = totalSteps;
    }

    if (instructionSteps > 1) {
      instructions[i] = `${direction}${instructionSteps - 1}`;
      i--;
    }
  }

  return stepsForCoordinate;
};

const getIntersectionData = instructionsForWires => {
  const intersectionData = { closestDistance: Infinity, fewestSteps: Infinity };

  const [stepsForCoordinatesA, stepsForCoordinatesB] = instructionsForWires.map(instructionsForWire =>
    getStepsForCoordinates(instructionsForWire)
  );

  for (const coordinateKey of Object.keys(stepsForCoordinatesA)) {
    if (coordinateKey in stepsForCoordinatesB) {
      const [x, y] = JSON.parse(coordinateKey);
      const distance = Math.abs(x) + Math.abs(y);
      const steps = stepsForCoordinatesA[coordinateKey] + stepsForCoordinatesB[coordinateKey];
      intersectionData.closestDistance = Math.min(intersectionData.closestDistance, distance);
      intersectionData.fewestSteps = Math.min(intersectionData.fewestSteps, steps);
    }
  }

  return intersectionData;
};

const instructionsForWires = dataLines.map(dataLine => dataLine.split(','));
const intersectionData = getIntersectionData(instructionsForWires);

// Part 1
console.log(intersectionData.closestDistance);

// Part 2
console.log(intersectionData.fewestSteps);
