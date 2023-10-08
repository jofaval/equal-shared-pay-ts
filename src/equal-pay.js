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
export function getTotalDeviation({ incomes, percentage, amount }) {
  const totalPayout = incomes.reduce((acc, curr) => {
    return acc + curr * percentage;
  }, 0);

  return amount - totalPayout;
}

const MAX_DEVIATION = 0.001;
const INCREMENT_STEP = 0.0000001;

/**
 *
 * @param {{
 *   curr: { deviation: number, percentage: number },
 *   highestPercentage: number,
 *   prev : { deviation: number, percentage: number }
 * }}
 *
 * @returns
 */
function isProcessing({ curr, highestPercentage, prev }) {
  const reachable = curr.percentage < highestPercentage;
  const hasNotOverpassedDeviation = Math.abs(curr.deviation) > MAX_DEVIATION;
  const isImproving = Math.abs(prev.deviation) > Math.abs(curr.deviation);

  return reachable && hasNotOverpassedDeviation && isImproving;
}

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
  const { highestPercentage } = getHighestAndLowestPercentages({
    amount,
    highest,
    lowest,
  });

  let prev = {
    percentage: highestPercentage,
    deviation: Number.MAX_SAFE_INTEGER,
  };

  const curr = {
    percentage: 0,
    deviation: getTotalDeviation({
      amount,
      incomes,
      percentage: 0,
    }),
  };

  let iteration = 0;
  while (isProcessing({ curr, highestPercentage, prev })) {
    iteration++;
    prev = { ...curr };

    curr.percentage = iteration * INCREMENT_STEP;
    curr.deviation = getTotalDeviation({
      amount,
      incomes,
      percentage: curr.percentage,
    });
  }

  return curr.percentage;
}

/**
 *
 * @param {{
 *   incomes: number[],
 *   amount: number
 * }}
 *
 * @returns {number[] | boolean}
 */
export function getEqualPay({ incomes, amount }) {
  const invalidIncomes = !areValidIncomes(incomes);
  if (invalidIncomes) {
    return false;
  }

  if (isEveryIncomeEqual(incomes) || incomes.length === 1) {
    return amount / incomes[0];
  }

  return getActualEqualPay({ amount, rawIncomes: incomes });
}

// module.exports = {
//   getEqualPay,
// };
