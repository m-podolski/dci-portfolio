
const conf = {

  root: '.tab-list',
  controlsList: '.tab-list-item',
  controls: '.tab',
  controlsState: 'tab-list-item-open',
  controlsStateInd: {
    attr: 'aria-selected',
    val: 'true',
    query() {
      return `[${this.controlsStateInd.attr}="${this.controlsStateInd.val}"]`
    }
  },
  content: '.tab-panel',
  contentState: 'tab-panel-closed'
}

function getNodes() {

  const root = document.querySelector(conf.root);
  const controlsList = root.querySelectorAll(conf.controlsList);
  const controls = root.querySelectorAll(conf.controls);
  const content = document.querySelectorAll(conf.content);

  return {
    root,
    controlsList,
    controls,
    content
  }
}
const dom = getNodes();

function setInitialState() {

  // Initial Content-display-state (conf.contentState)
  // is set in template to prevent flashing
  // Content-display-state (show 1st content-element)
  dom.content[0].classList.remove(conf.contentState);
  // Control-display-state
  dom.controlsList[0].classList.add(conf.controlsState);
  // Control-ARIA-state
  dom.controls[0].setAttribute(conf.controlsStateInd.attr, true);
  // Control-Interaction-state
  for (const node of dom.controls) {
    node.setAttribute('tabindex', '-1');
  }
  dom.controls[0].setAttribute('tabindex', '0');
}

function toggle(currentControl, targetControl) {

  // Content-display-state
  for (const node of dom.content) {
    if (targetControl.dataset.tab === node.dataset.tab) {
      node.classList.remove(conf.contentState);
    } else {
      node.classList.add(conf.contentState);
    }
  }
  // Control-display-state
  currentControl.parentElement.classList.remove(conf.controlsState);
  targetControl.parentElement.classList.toggle(conf.controlsState);

  // Control-ARIA-state
  currentControl.setAttribute(conf.controlsStateInd.attr, false);
  targetControl.setAttribute(conf.controlsStateInd.attr, true);

  // Control-Interaction-state
  currentControl.setAttribute('tabindex', '-1');
  targetControl.setAttribute('tabindex', '0');
}

function handleKeys(e, currentControl) {

  let index = [].indexOf.call(dom.controls, currentControl);
  let targetControl = null;

  // Control-Keyboard-function
  switch (e.key) {
    // Switch tabs via left/right arrow
    case 'ArrowLeft':
      index = index - 1;
      targetControl = index >= 0 ?
        dom.controls[index] :
        dom.controls[dom.controls.length - 1];
      toggle(currentControl, targetControl);
      break;
    case 'ArrowRight':
      index = index + 1;
      targetControl = index <= dom.controls.length - 1 ?
        dom.controls[index] :
        dom.controls[0];
      toggle(currentControl, targetControl);
      break;
    // Focus to content on down-arrow
    case 'ArrowDown':
      for (const node of dom.content) {
        if (currentControl.dataset.tab === node.dataset.tab) {
          node.focus();
          node.scrollIntoView();
        }
      }
      break;
    default:
      return;
  }
}

function init() {

  setInitialState();

  document.addEventListener('keydown', (e) => {

    const current = dom.root.querySelector(conf.controlsStateInd.query.call(conf));
    handleKeys(e, current);
  });

  for (const control of dom.controls) {

    control.addEventListener('click', () => {

      const current = dom.root.querySelector(conf.controlsStateInd.query.call(conf));
      const target = control;
      if (current !== target) {
        toggle(current, target);
      }
    });
  }
}

export { init };
