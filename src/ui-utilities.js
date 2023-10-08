/**
 * @param {Partial<HTMLButtonElement>}
 */
function generateButton(props) {
  const button = document.createElement("button");

  button.classList.add("button");
  for (const [key, value] of Object.entries(props)) {
    console;
    button[key] = value;
  }

  return button;
}
