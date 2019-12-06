// https://adventofcode.com/2019/day/6

import * as fs from 'fs';

const dataBuffer = fs.readFileSync('6.txt');
const dataString = dataBuffer.toString();
const dataLines = dataString.split(/\r?\n/);

const getOrbitInfo = dataLines => {
  const directOrbit = {};
  const orbitingObjects = {};

  for (const dataLine of dataLines) {
    const [orbited, orbiting] = dataLine.split(')');
    directOrbit[orbiting] = orbited;

    if (orbited in orbitingObjects) {
      orbitingObjects[orbited].push(orbiting);
    } else {
      orbitingObjects[orbited] = [orbiting];
    }
  }

  return {
    directOrbit,
    orbitingObjects
  };
};

const getOrbitCountForObject = (directOrbit, orbiting) => {
  if (!(orbiting in directOrbit)) {
    return 0;
  }

  const orbited = directOrbit[orbiting];
  return 1 + getOrbitCountForObject(directOrbit, orbited);
};

const getOrbitCount = directOrbit =>
  Object.keys(directOrbit).reduce(
    (orbitCount, orbiting) => orbitCount + getOrbitCountForObject(directOrbit, orbiting),
    0
  );

const getMinOrbitalTransfers = (start, end, orbitInfo, seen = new Set()) => {
  const key = `${start},${end}`;

  if (seen.has(key)) {
    return Infinity;
  } else if (start === end) {
    return 0;
  }

  seen.add(key);

  const { directOrbit, orbitingObjects } = orbitInfo;

  const inTransferResult =
    start in directOrbit ? 1 + getMinOrbitalTransfers(directOrbit[start], end, orbitInfo, seen) : Infinity;

  const outTransferResult =
    start in orbitingObjects
      ? orbitingObjects[start].reduce(
          (outResult, orbiting) => Math.min(outResult, 1 + getMinOrbitalTransfers(orbiting, end, orbitInfo, seen)),
          Infinity
        )
      : Infinity;

  seen.delete(key);

  return Math.min(inTransferResult, outTransferResult);
};

// Part 1
const orbitInfo = getOrbitInfo(dataLines);
console.log(getOrbitCount(orbitInfo.directOrbit));

// Part 2
const start = orbitInfo.directOrbit['YOU'];
const end = orbitInfo.directOrbit['SAN'];
console.log(getMinOrbitalTransfers(start, end, orbitInfo));
