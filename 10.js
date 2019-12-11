// https://adventofcode.com/2019/day/10

import * as fs from 'fs';

const dataBuffer = fs.readFileSync('10.txt');
const dataString = dataBuffer.toString();
const dataLines = dataString.split(/\r?\n/);

const getDetectedData = (data, subjectRowNum, subjectColNum) => {
  const asteroidsAtAngles = {};
  let detectedCount = 0;

  for (let rowNum = 0; rowNum < data.length; rowNum++) {
    const row = data[rowNum];

    for (let colNum = 0; colNum < row.length; colNum++) {
      const char = row[colNum];

      if (char === '#' && !(rowNum === subjectRowNum && colNum === subjectColNum)) {
        const diffY = subjectRowNum - rowNum;
        const diffX = colNum - subjectColNum;
        const angle = Math.atan2(diffY, diffX);

        if (!(angle in asteroidsAtAngles)) {
          detectedCount++;
          asteroidsAtAngles[angle] = [[rowNum, colNum]];
        } else {
          asteroidsAtAngles[angle].push([rowNum, colNum]);
        }
      }
    }
  }

  return {
    detectedCount,
    asteroidsAtAngles
  };
};

const getMaxDetectedData = data => {
  let maxDetectedCount = 0;
  let maxRowNum = -1,
    maxColNum = -1;

  for (let rowNum = 0; rowNum < data.length; rowNum++) {
    const row = data[rowNum];

    for (let colNum = 0; colNum < row.length; colNum++) {
      const char = row[colNum];

      if (char === '#') {
        const { detectedCount } = getDetectedData(data, rowNum, colNum);

        if (detectedCount >= maxDetectedCount) {
          maxDetectedCount = detectedCount;
          maxRowNum = rowNum;
          maxColNum = colNum;
        }
      }
    }
  }

  return {
    maxDetectedCount,
    maxRowNum,
    maxColNum
  };
};

const getDistance = (x1, y1, x2, y2) => {
  const diffX = x2 - x1;
  const diffY = y2 - y1;

  return Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));
};

const getNthDestroyedAsteroid = (data, subjectRowNum, subjectColNum, n) => {
  const { asteroidsAtAngles } = getDetectedData(data, subjectRowNum, subjectColNum);

  // Sort keys (angles) so the lazer can move in a single direction
  const sortedKeys = Object.keys(asteroidsAtAngles).sort((a, b) => Number(b) - Number(a));

  // Sort values (coordinates) so the closest coordinates are first
  for (const key of sortedKeys) {
    asteroidsAtAngles[key] = asteroidsAtAngles[key].sort(([y1, x1], [y2, x2]) => {
      const distance1 = getDistance(x1, y1, subjectColNum, subjectRowNum);
      const distance2 = getDistance(x2, y2, subjectColNum, subjectRowNum);
      return distance1 - distance2;
    });
  }

  // Find the first key based on the starting angle
  let keyIndex = 0;
  for (let i = 0; i < sortedKeys.length; i++) {
    const key = sortedKeys[i];

    if (Number(key) <= Math.PI / 2) {
      keyIndex = i;
      break;
    }
  }

  // Destroy n asteroids
  let key = sortedKeys[keyIndex];
  let nthDestroyedAsteroid = null;
  while (n > 0) {
    key = sortedKeys[keyIndex];

    if (key in asteroidsAtAngles && asteroidsAtAngles[key].length > 0) {
      nthDestroyedAsteroid = asteroidsAtAngles[key].splice(0, 1)[0];
      n--;
    }

    keyIndex = (keyIndex + 1) % sortedKeys.length;
  }

  return nthDestroyedAsteroid;
};

// Part 1
const data = dataLines.map(row => row.split(''));
const { maxDetectedCount, maxRowNum, maxColNum } = getMaxDetectedData(data);
console.log(maxDetectedCount);

// Part 2
const [destroyedRow, destroyedCol] = getNthDestroyedAsteroid(data, maxRowNum, maxColNum, 200);
console.log(destroyedCol * 100 + destroyedRow);
