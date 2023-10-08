import { getEqualPay, getTotalDeviation } from "./equal-pay.js";

const EQUAL_PAY_FORM_ID = "equalPayForm";
const form = document.getElementById(EQUAL_PAY_FORM_ID);

/**
 * @param {FormData} formData
 *
 * @returns {[string, number][]}
 */
function parseFormData(formData) {
  const stash = [];

  const entries = Array.from(formData.entries());
  for (let index = 1; index < entries.length; index++) {
    const [, value] = entries[index];

    if (index % 2 !== 0) {
      stash.push([value]);
    } else {
      stash.at(-1).push(value);
    }
  }

  return stash;
}

/**
 * @param {{
 *   amount: number,
 *   deviance: number,
 *   payees: [string, number][],
 *   percentage: number,
 * }}
 */
function printResult({ amount, deviance, payees, percentage }) {
  const result = document.getElementById("result");
  const fixedPercentage = (percentage * 100).toFixed(2);

  result.innerHTML = `<div>
    <p>Wanted to pay ${amount}, everyone will pay ${fixedPercentage}% of their income</p>
    <p>absolute error of ${deviance}</p>

    <h3>Payees</h3>
    <div>
      ${payees
        .map(
          ([name, payout]) => `<p>
        ${name} has to pay ${payout.toFixed(2)}
      </p>`
        )
        .join("")}
    </div>
  </div>`;
}

/**
 * @param {SubmitEvent} evt
 */
function handleEqualPayFormSubmit(evt) {
  const event = evt || window.event;
  event.preventDefault();

  const result = document.getElementById("result");
  result.innerHTML = "Mathematicating...";

  const formData = new FormData(document.forms[EQUAL_PAY_FORM_ID]);
  const parsed = parseFormData(formData);

  const [[, amount]] = formData.entries();
  const incomes = parsed.map(([, income]) => income);

  const percentage = getEqualPay({ amount, incomes });
  const deviance = getTotalDeviation({ amount, incomes, percentage });

  const payeesWithFee = parsed.map(([name, value]) => [
    name,
    value * percentage,
  ]);

  printResult({ amount, deviance, payees: payeesWithFee, percentage });

  return false;
}

form.onsubmit = handleEqualPayFormSubmit;
