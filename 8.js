// https://adventofcode.com/2019/day/8

import * as fs from 'fs';

const dataBuffer = fs.readFileSync('8.txt');
const dataString = dataBuffer.toString();
const dataLines = dataString.split(/\r?\n/);

const getLayers = (digitsString, width, height) => {
  const layerStringRegex = new RegExp(`.{${width * height}}`, 'g');
  const digitStringsForLayers = digitsString.match(layerStringRegex);
  const rowStringRegex = new RegExp(`.{${width}}`, 'g');

  const layers = digitStringsForLayers.map(digitStringForLayer => {
    const rowStrings = digitStringForLayer.match(rowStringRegex);
    const rows = rowStrings.map(rowString => rowString.split(''));
    return rows;
  });

  return layers;
};

const getDigitCounts = layer =>
  layer.reduce((digitCounts, row) => {
    for (const digit of row) {
      if (!(digit in digitCounts)) {
        digitCounts[digit] = 1;
      } else {
        digitCounts[digit]++;
      }
    }
    return digitCounts;
  }, {});

const getImage = layers => {
  const combinedLayer = layers.reduce((image, layer) => {
    for (let rowIndex = 0; rowIndex < layer.length; rowIndex++) {
      for (let columnIndex = 0; columnIndex < layer[rowIndex].length; columnIndex++) {
        if (image[rowIndex][columnIndex] === '2') {
          image[rowIndex][columnIndex] = layer[rowIndex][columnIndex];
        }
      }
    }
    return image;
  });

  const image = combinedLayer.map(row => row.join(''));
  return image;
};

// Part 1
const digits = dataLines[0];
const layers = getLayers(digits, 25, 6);
const digitCountsForLayers = layers.map(layer => getDigitCounts(layer));
const digitCountsForLayerWithFewestZeros = digitCountsForLayers.reduce(
  (digitCountsForLayerWithFewestZeros, digitCountsForLayer) =>
    !('0' in digitCountsForLayerWithFewestZeros) || digitCountsForLayer['0'] < digitCountsForLayerWithFewestZeros['0']
      ? digitCountsForLayer
      : digitCountsForLayerWithFewestZeros,
  {}
);
console.log(digitCountsForLayerWithFewestZeros['1'] * digitCountsForLayerWithFewestZeros['2']);

// Part 2
console.log(getImage(layers));
