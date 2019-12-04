// https://adventofcode.com/2019/day/4

const repeatNumberTwiceRegex = /^\d*(\d)\1\d*$/;
const repeatNumberExactlyTwiceRegex = /^((\d)\2(?!\2)\d*|\d*(\d)(?!\3)(\d)\4(?!\4)\d*)$/;
const increasingRegex = /^0*1*2*3*4*5*6*7*8*9*$/;

const start = 307237;
const end = 769058;

const range = [...Array(end + 1).keys()].slice(start);

// Part 1
console.log(range.filter(number => repeatNumberTwiceRegex.test(number) && increasingRegex.test(number)).length);

// Part 1
console.log(range.filter(number => repeatNumberExactlyTwiceRegex.test(number) && increasingRegex.test(number)).length);
