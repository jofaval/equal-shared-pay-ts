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
  const sorted = incomes.sort();

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
    return Big(acc).plus(Big(curr).mul(percentage));
  }, Big(0));

  return Big(amount).minus(Big(totalPayout));
}

const MAX_DEVIATION = Big(1);
const MAX_ITERATION = 1_000;

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

  const difference = Big((highestPercentage - lowestPercentage) / 2);
  const startingPercentage = Big(lowestPercentage).plus(difference);

  let prev = {
    percentage: Big(highestPercentage),
    deviation: Big(Number.MAX_SAFE_INTEGER),
  };

  let curr = {
    percentage: startingPercentage,
    deviation: getTotalDeviation({
      amount,
      incomes,
      percentage: startingPercentage,
    }),
  };

  let step = difference;
  let iteration = 0;
  while (Math.abs(curr.deviation) > MAX_DEVIATION) {
    iteration++;
    if (iteration > MAX_ITERATION) {
      break;
    }

    // console.log({ step }, curr, prev);
    const a = Big(1);
    if (
      Math.abs(curr.deviation.toNumber()) >= Math.abs(prev.deviation.toNumber())
    ) {
      step = Big(0.9).mul(step);
    }

    const aux = { ...curr };
    curr.percentage = Big(lowestPercentage).plus(step);
    prev = aux;

    curr.deviation = getTotalDeviation({
      amount,
      incomes,
      percentage: curr.percentage,
    });
  }

  return curr.percentage.toPrecision();
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

// local tests
const incomes = [1500, 2400, 5000];
const r = getEqualPay({ incomes, amount: 50 });
console.log({ r, incomes: incomes.reduce((acc, curr) => acc + curr * r, 0) });
