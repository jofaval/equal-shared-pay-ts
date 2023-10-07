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

const MAX_DEVIATION = 5;

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

  const difference = highestPercentage - lowestPercentage;
  const startingPercentage = lowestPercentage + difference / 2;

  const r = getTotalDeviation({
    amount,
    incomes,
    percentage: startingPercentage,
  });

  console.log({ r, startingPercentage });
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
function getEqualPay(incomes, amount) {
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
getEqualPay([1500, 2400, 50_000], 50);
