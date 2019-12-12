// https://adventofcode.com/2019/day/12

import * as fs from 'fs';

const dataBuffer = fs.readFileSync('12.txt');
const dataString = dataBuffer.toString();
const dataLines = dataString.split(/\r?\n/);

const simulate = (planets, steps, { stopOnRepeat = false, specificAxis = null } = {}) => {
  planets = planets.map(planet => [...planet]);
  const velocities = new Array(planets.length).fill(0).map(_ => [0, 0, 0]);
  const seen = new Set();

  let step;
  for (step = 0; step < steps; step++) {
    if (stopOnRepeat) {
      const key = JSON.stringify(planets) + JSON.stringify(velocities);
      if (seen.has(key)) {
        break;
      }
      seen.add(key);
    }

    for (let i = 0; i < planets.length; i++) {
      for (let j = i + 1; j < planets.length; j++) {
        const planet1 = planets[i];
        const planet2 = planets[j];

        for (let axis = specificAxis || 0; axis < 3; axis++) {
          const planet1Value = planet1[axis];
          const planet2Value = planet2[axis];

          const planet1Diff = planet1Value < planet2Value ? 1 : planet1Value > planet2Value ? -1 : 0;

          velocities[i][axis] += planet1Diff;
          velocities[j][axis] -= planet1Diff;

          if (specificAxis !== null) {
            break;
          }
        }
      }
    }

    for (let i = 0; i < planets.length; i++) {
      for (let axis = specificAxis || 0; axis < 3; axis++) {
        planets[i][axis] += velocities[i][axis];

        if (specificAxis !== null) {
          break;
        }
      }
    }
  }

  return { planets, velocities, step };
};

const planets = dataLines.map(dataLine => dataLine.match(/-?\d+/g).map(Number));

const getTotalEnergy = planets => {
  const { planets: endPlanets, velocities: endVelocities } = simulate(planets, 1000);

  let totalEnergy = 0;

  for (let i = 0; i < endPlanets.length; i++) {
    const planet = endPlanets[i];
    const velocity = endVelocities[i];

    const potential = planet.reduce((potential, value) => potential + Math.abs(value), 0);
    const kinetic = velocity.reduce((kinetic, value) => kinetic + Math.abs(value), 0);

    totalEnergy += potential * kinetic;
  }

  return totalEnergy;
};

const lcm = (a, b) => {
  const largest = Math.max(a, b);
  const smallest = Math.min(a, b);

  let total = largest;
  while (total % smallest !== 0) {
    total += largest;
  }

  return total;
};

const getMinimumStepsToRepeat = planets => {
  let minimumSteps = 1;

  for (let axis = 0; axis < 3; axis++) {
    const { step } = simulate(planets, Infinity, { stopOnRepeat: true, specificAxis: axis });
    minimumSteps = lcm(minimumSteps, step);
  }

  return minimumSteps;
};

// Part 1
console.log(getTotalEnergy(planets));

// Part 2
console.log(getMinimumStepsToRepeat(planets));
