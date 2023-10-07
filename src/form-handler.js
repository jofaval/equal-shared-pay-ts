const EQUAL_PAY_FORM_ID = "equalPayForm";
const form = document.getElementById(EQUAL_PAY_FORM_ID);

/**
 * @param {SubmitEvent} evt
 */
function handleEqualPayFormSubmit(evt) {
  const event = evt || window.event;
  event.preventDefault();

  const formData = new FormData(document.forms[EQUAL_PAY_FORM_ID]);
  console.log({ formData });

  return false;
}

form.onsubmit = handleEqualPayFormSubmit;
