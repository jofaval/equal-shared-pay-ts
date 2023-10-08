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
 *
 * @param {[string, number, number]}
 */
function printPayeeResult([name, income, payout]) {
  const parsedPayout = Number(payout.toFixed(2));

  const remaining = Number((income - parsedPayout).toFixed(2));
  const remainingColor =
    remaining !== 0 ? `color: ${remaining > 0 ? "green" : "red"};` : "";

  return `<p>
    ${name} has to pay ${boldifyInline(parsedPayout)},
    with ${boldifyInline(remaining, remainingColor)} remaining
  </p>`;
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

  const payeesWithFee = payees.map(([name, value]) => [
    name,
    value,
    value * percentage,
  ]);

  result.innerHTML = `<div>
    <p>Wanted to pay ${boldifyInline(
      amount
    )}, everyone will pay ${boldifyInline(fixedPercentage)}% of their income</p>
    <p>absolute error of ${deviance}</p>

    <h3>Payees</h3>
    <div>
      ${payeesWithFee.map(printPayeeResult).join("")}
    </div>
  </div>`;
}

function processFormData() {
  const formData = new FormData(document.forms[EQUAL_PAY_FORM_ID]);
  const payees = parseFormData(formData);

  const [[, amount]] = formData.entries();
  const incomes = payees.map(([, income]) => income);

  try {
    const percentage = getEqualPay({ amount, incomes });
    const deviance = getTotalDeviation({ amount, incomes, percentage });

    printResult({ amount, deviance, payees, percentage });
  } catch (error) {
    alert(error);
  }
}

/**
 * @param {SubmitEvent} evt
 */
function handleEqualPayFormSubmit(evt) {
  const event = evt || window.event;
  event.preventDefault();

  onResultTabClick();
  const result = document.getElementById("result");
  result.innerHTML = "Mathematicating...";

  setTimeout(processFormData, 0);

  return false;
}

form.onsubmit = handleEqualPayFormSubmit;
