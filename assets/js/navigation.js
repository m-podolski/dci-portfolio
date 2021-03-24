
const conf = {

  root: '.nav-pri',
  breakpoint: '(min-width: 45em)', // Should match @media rules in '_navigation.scss'
  skipLink: '.skip-link',
  menuControl: '.nav-button-menu',
  menuControlMenuStateInd: {
      attr: 'aria-expanded',
      value: 'true'
  },
  menu: '.nav-pri-list',
  menuState: 'nav-menu-closed',
  controls: '.nav-link',
  focusableControls: '.nav-button-menu, .nav-link'
};

function getNodes() {

  const root = document.querySelector(conf.root);
  const menuControl = root.querySelector(conf.menuControl);
  const menu = root.querySelector(conf.menu);
  const skipLink = document.querySelector(conf.skipLink);
  const controls = root.querySelectorAll(conf.controls);

  const focusable = conf.focusableControls;
  const firstFocusable = root.querySelectorAll(focusable)[0];
  const focusableContent = root.querySelectorAll(focusable);
  const lastFocusable = focusableContent[focusableContent.length - 1];

  return {
    menuControl,
    menu,
    skipLink,
    controls,
    firstFocusable,
    lastFocusable
  }
}
// dom object assigned in module scope to allow named event handlers to be declared here as well. Thus making removal of listeners possible while giving them access to dom object.
const dom = getNodes();

function setInitialState(mediaQuery) {

  if (mediaQuery.matches) {

    // Menu-Control-display-state set via
    // media query in navigation.scss
    // Menu-Control-ARIA-state
    dom.menuControl.removeAttribute(conf.menuControlMenuStateInd.attr);
    // Menu-Control-Interaction-state
    dom.menuControl.removeEventListener('click', toggleNavMenu);
    // Controls-display-state
    dom.menu.classList.remove(conf.menuState);
    window.addEventListener('scroll', toggleNavBar);
    // Controls-Interaction-state
    document.removeEventListener('keydown', trapTab);
    for (const control of dom.controls) {
      control.setAttribute('tabindex', '0');
    }
  } else {

    // Menu-Control-display-state set via
    // media query in navigation.scss
    // Menu-Control-ARIA-state
    dom.menuControl.setAttribute(conf.menuControlMenuStateInd.attr, false);
    // Menu-Control-Interaction-state
    dom.menuControl.addEventListener('click', toggleNavMenu);
    // Controls-display-state
    dom.menu.classList.add(conf.menuState);
    window.removeEventListener('scroll', toggleNavBar);
    // Controls-Interaction-state
    document.addEventListener('keydown', trapTab);
    for (const control of dom.controls) {
      control.setAttribute('tabindex', '-1');
    }
  }
}

let prevScrollpos = window.pageYOffset;

function toggleNavBar() {

  // Controls-display-state
  let currentScrollPos = window.pageYOffset;
  if (prevScrollpos > currentScrollPos) {
    dom.menu.classList.remove(conf.menuState);
  } else {
    dom.menu.classList.add(conf.menuState);
  }
  prevScrollpos = currentScrollPos;
}


function toggleNavMenu() {

  // Menu-Control-ARIA-state
  const isExpanded = dom.menuControl.getAttribute(conf.menuControlMenuStateInd.attr) ===
  conf.menuControlMenuStateInd.value ?
  true : false;
  dom.menuControl.setAttribute(conf.menuControlMenuStateInd.attr, !isExpanded);
  // Controls-display-state
  dom.menu.classList.toggle(conf.menuState);
  // Controls-Interaction-state
  for (const control of dom.controls) {
    if (!isExpanded) {
      control.setAttribute('tabindex', '0');
    } else {
      control.setAttribute('tabindex', '-1');
    }
  }
}

function trapTab(e) {

  const isTabPressed = e.key === 'Tab';
  const isEscPressed = e.key === 'Escape';
  const isExpanded = dom.menuControl.getAttribute(conf.menuControlMenuStateInd.attr) ===
    conf.menuControlMenuStateInd.value ?
    true : false;

  const toggle = toggleNavMenu.bind(dom.menuControl);

  if (!isTabPressed) {
    if (isEscPressed && isExpanded) {
      toggle();
      dom.skipLink.focus();
    }
    return;
  }

  if (e.shiftKey) {
    if (document.activeElement === dom.firstFocusable) {
      dom.lastFocusable.focus();
      e.preventDefault();
    }
  } else {
    if (document.activeElement === dom.lastFocusable) {
      dom.firstFocusable.focus();
      e.preventDefault();
    }
  }
}

function init() {

  const mediaQuery = window.matchMedia(conf.breakpoint);

  setInitialState(mediaQuery);

  mediaQuery.addEventListener('change', () => {

    setInitialState(mediaQuery);
  });
}

export { init };
