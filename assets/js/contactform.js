
const conf = {

  root: '.contactform',
  rootMod: 'novalidate',
  primaryControl: '.button-submit',
  primaryControlDispState: 'button-disabled',
  primaryControlIntState: 'disabled',
  controls: 'input:not(.honey), textarea',
  required: 'input[required], textarea[required]',
  controlsStateInd: {
    valid: 'valid',
    invalid: 'invalid'
  },
  content: '.error-info',
  contentState: {
    property: 'display',
    valid: 'none',
    invalid: 'block'
  },
  contentStateAria: 'aria-hidden'
}

function getNodes() {

  const root = document.querySelector(conf.root);
  const primaryControl = root.querySelector(conf.primaryControl);
  const controls = root.querySelectorAll(conf.controls);
  const required = root.querySelectorAll(conf.required);
  const content = document.querySelectorAll(conf.content);

  return {
    root,
    primaryControl,
    controls,
    required,
    content
  }
}
const dom = getNodes();

function setInitialState() {

  dom.root.setAttribute(conf.rootMod, true);
  // Initial Content-display-state (conf.contentState)
  // is set in CSS to prevent flashing
  for (const node of dom.content) {
    // Content-ARIA-state
    node.setAttribute(conf.contentStateAria, true);
  }
  // primaryControl-display-state
  dom.primaryControl.classList.add(conf.primaryControlDispState);
  // primaryControl-Interaction-state
  dom.primaryControl.setAttribute(conf.primaryControlIntState, true);
}

function validateInput() {
  if (this.validity.valid) {
    // Content-display-state
    this.nextElementSibling.style[conf.contentState.property] = conf.contentState.valid;
    // Content-ARIA-state
    this.setAttribute(conf.contentStateAria, true);
    // Control-display-state
    this.classList.remove(conf.controlsStateInd.invalid);
    this.classList.add(conf.controlsStateInd.valid);
  } else {
    this.nextElementSibling.style[conf.contentState.property] = conf.contentState.invalid;
    this.setAttribute(conf.contentStateAria, false);
    this.classList.remove(conf.controlsStateInd.valid);
    this.classList.add(conf.controlsStateInd.invalid);
  }
  validateForm();
}

function validateForm() {

  let invalidRequiredFields = dom.required.length;

  for (const control of dom.required) {

    if (control.validity.valid) {
      invalidRequiredFields -= 1;
    }
  }
  if (invalidRequiredFields === 0) {
    // primaryControl-display-state
    dom.primaryControl.classList.remove(conf.primaryControlDispState);
    // primaryControl-Interaction-state
    dom.primaryControl.setAttribute(conf.primaryControlIntState, false);
    // display-state set because disappearing button issue
    dom.primaryControl.style.display = 'block';
  } else {
    dom.primaryControl.classList.add(conf.primaryControlDispState);
    dom.primaryControl.setAttribute(conf.primaryControlIntState, true);
    dom.primaryControl.style.display = 'block';
  }
}

function init() {

  setInitialState();

  for (const control of dom.controls) {

    control.addEventListener('blur', validateInput, true);
  }
}

export { init };
