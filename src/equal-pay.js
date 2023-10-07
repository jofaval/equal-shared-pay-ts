const Big = require("big.js");

/**
 * @param {number[]} incomes
 * @returns {boolean}
 */
function areValidIncomes(incomes) {
  if (incomes.length === 0) {
    throw new Error("No incomes provided");
  }

  if (incomes.some((n) => n <= 0)) {
    throw new Error("Some income is equal or below 0");
  }

  return true;
}

/**
 * @param {number[]} incomes
 *
 * @returns {boolean}
 */
function isEveryIncomeEqual(incomes) {
  return new Set(incomes).size === 1;
}

/**
 * @param {number[]} incomes
 *
 * @returns {{
 *   highest: number,
 *   lowest: number,
 * }}
 */
function getHighestAndLowestIncomes(incomes) {
  const sorted = incomes.sort((a, b) => a - b);

  return { highest: sorted.at(-1), lowest: sorted[0] };
}

/**
 *
 * @param {{
 *   highest: number,
 *   lowest: number,
 *   amount: number,
 * }}
 *
 * @returns {{
 *   highestPercentage: number,
 *   lowestPercentage: number,
 * }}
 */
function getHighestAndLowestPercentages({ highest, lowest, amount }) {
  return {
    highestPercentage: amount / lowest,
    lowestPercentage: amount / highest,
  };
}

/**
 * @param {{
 *   incomes: number[],
 *   percentage: number,
 *   amount: number
 * }}
 *
 * @returns {number}
 */
function getTotalDeviation({ incomes, percentage, amount }) {
  const totalPayout = incomes.reduce((acc, curr) => {
    return acc + curr * percentage;
  }, 0);

  return amount - totalPayout;
}

const MAX_DEVIATION = 0.001;

/**
 * @param {{
 *   rawIncomes: number[],
 *   amount: number
 * }}
 *
 * @returns {{ [k in number]: number }}
 * { [income]: percentage }
 */
function getActualEqualPay({ rawIncomes, amount }) {
  const incomes = Array.from(new Set(rawIncomes));

  const { highest, lowest } = getHighestAndLowestIncomes(incomes);
  const { highestPercentage, lowestPercentage } =
    getHighestAndLowestPercentages({ amount, highest, lowest });

  let prev = {
    percentage: highestPercentage,
    deviation: Number.MAX_SAFE_INTEGER,
  };

  let curr = {
    percentage: 0,
    deviation: getTotalDeviation({
      amount,
      incomes,
      percentage: 0,
    }),
  };

  const increment = 0.0000001;
  let iteration = 0;
  while (
    Math.abs(curr.deviation) > MAX_DEVIATION &&
    curr.percentage < highestPercentage &&
    Math.abs(prev.deviation) > Math.abs(curr.deviation)
  ) {
    iteration++;

    const aux = { ...curr };
    curr.percentage = iteration * increment;
    prev = aux;

    // console.log(prev, curr);
    curr.deviation = getTotalDeviation({
      amount,
      incomes,
      percentage: curr.percentage,
    });
  }

  return curr.percentage;
}

// TODO: implement income-name pairing
// Hashmap, implement that on the result side

/**
 *
 * @param {{
 *   incomes: number[],
 *   amount: number
 * }}
 *
 * @returns {number[] | boolean}
 */
function getEqualPay({ incomes, amount }) {
  const invalidIncomes = !areValidIncomes(incomes);
  if (invalidIncomes) {
    return false;
  }

  if (isEveryIncomeEqual(incomes) || incomes.length === 1) {
    return amount / incomes[0];
  }

  return getActualEqualPay({ amount, rawIncomes: incomes });
}

module.exports = {
  getEqualPay,
};
