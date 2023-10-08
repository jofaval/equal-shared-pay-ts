let payeeIndex = 0;

function getPayeeNameId() {
  return `payee-name-${payeeIndex}`;
}

function getPayeeIncomeId() {
  return `payee-income-${payeeIndex}`;
}

/**
 *
 * @param {HTMLElement} section
 * @param {string} id
 */
function fillPayeeSection(section, id) {
  section.querySelector("label").htmlFor = id;
  const input = section.querySelector("input");
  input.id = id;
  input.name = id;
}

/**
 *
 * @param {HTMLElement} template
 * @returns {HTMLElement}
 */
function generatePayeeNative(template) {
  /** @type HTMLElement */
  const cloned = template.content.cloneNode(true);

  cloned.querySelector(".payee").prepend(
    generateButton({
      id: `remove-payee-${payeeIndex}`,
      innerHTML: "Remove Payee",
      /**
       * @param {Parameters<HTMLButtonElement["onclick"]>[0]} evt
       */
      onclick(evt) {
        evt.preventDefault();
        this.parentElement.remove();
        return false;
      },
    })
  );

  // name
  fillPayeeSection(
    cloned.querySelector(".payee-name__container"),
    getPayeeNameId()
  );

  // income
  fillPayeeSection(
    cloned.querySelector(".payee-income__container"),
    getPayeeIncomeId()
  );

  return cloned;
}

function generatePayeeCustom() {
  throw new Error("Unsupported, templates are not supported on this browser");
}

function generatePayee() {
  /** @type HTMLElement */
  const template = document.getElementById("payee-template");

  let payee;
  if ("content" in template) {
    payee = generatePayeeNative(template);
  } else {
    payee = generatePayeeCustom(template);
  }
  payeeIndex++;

  return payee;
}

function appendPayee() {
  const form = document.getElementById("equalPayFormPayees");
  form.appendChild(generatePayee());
}

function formGeneration() {
  appendPayee();
  appendPayee();

  const addPayeeButton = document.getElementById("addPayeeButton");
  addPayeeButton.onclick = appendPayee;
}

(() => {
  formGeneration();
})();
