// https://adventofcode.com/2019/day/1

import * as fs from 'fs';

const dataBuffer = fs.readFileSync('1.txt');
const dataString = dataBuffer.toString();
const dataLines = dataString.split(/\r?\n/);

const getFuelRequirementsForMass = (mass, fuelRequiresFuel) => {
  const fuelRequirements = Math.floor(mass / 3) - 2;

  if (!fuelRequiresFuel) {
    return fuelRequirements;
  } else if (fuelRequirements <= 0) {
    return 0;
  }

  return fuelRequirements + getFuelRequirementsForMass(fuelRequirements, fuelRequiresFuel);
};

const getFuelRequirementsForMasses = (masses, fuelRequiresFuel) =>
  masses.reduce((fuelRequirements, mass) => fuelRequirements + getFuelRequirementsForMass(mass, fuelRequiresFuel), 0);

const masses = dataLines.map(Number);

// Part 1
console.log(getFuelRequirementsForMasses(masses, false));

// Part 2
console.log(getFuelRequirementsForMasses(masses, true));
