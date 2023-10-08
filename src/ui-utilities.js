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

/**
 * @param {string?} style
 */
function boldifyInline(content, style) {
  return `<span style="font-weight: bold; ${style}">${content}</span>`;
}
