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
 * @param {SubmitEvent} evt
 */
function handleEqualPayFormSubmit(evt) {
  const event = evt || window.event;
  event.preventDefault();

  const formData = new FormData(document.forms[EQUAL_PAY_FORM_ID]);
  const parsed = parseFormData(formData);

  const [[, amount]] = formData.entries();
  const incomes = parsed.map(([, income]) => income);

  const result = getEqualPay({ amount, incomes });
  const deviance = getTotalDeviation({ amount, incomes, percentage: result });

  return false;
}

form.onsubmit = handleEqualPayFormSubmit;
