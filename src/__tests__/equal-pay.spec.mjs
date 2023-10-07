import { getEqualPay } from "../equal-pay.js";

// local tests
const incomes = [1500, 2400, 50_000, 800, 1000];
const r = getEqualPay({ incomes, amount: 50 });
console.log({
  r: `${r * 100}%`,
  incomes: incomes.reduce((acc, curr) => acc + curr * r, 0),
});

// randomized test
const randomizedIncomes = [...Array(50).keys()].map(() =>
  Math.round(Math.random() * 30_000 + 300)
);
const randomizedAmount = Math.round(Math.random() * 20 + 3_000);
const randomizedResult = getEqualPay({
  incomes: randomizedIncomes,
  amount: randomizedAmount,
});
const randomizedTotal = randomizedIncomes.reduce(
  (acc, curr) => acc + curr * randomizedResult,
  0
);

console.log({
  r: `${randomizedResult * 100}%`,
  total: randomizedTotal,
  incomes: randomizedIncomes,
  amount: randomizedAmount,
  error: Math.abs(randomizedAmount - randomizedTotal),
});

// stress test
console.time("stress test");
for (let index = 0; index < 3_000; index++) {
  getEqualPay({
    incomes: randomizedIncomes,
    amount: randomizedAmount,
  });
}
console.timeEnd("stress test");
