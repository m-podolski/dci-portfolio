
const conf = {

  root: '.tax-filter',
  controls: '.tax-filter-cat-btn',
  controlsState: 'button-disabled',
  controlsStateInd: 'selected',
  controlsMenuStateInd: {
    attr: 'aria-expanded',
    val: 'true',
  },
  subcontrolsList: '.tax-filter-taglist',
  subcontrolsListState: 'tax-filter-taglist-closed',
  subcontrols: '.tax-filter-tag-btn',
  subcontrolsStateInd: 'tax-filter-tag-btn-selected',
  targetsRoot: '.cards-list',
  target: '.card',
  targetState: 'card-hidden',
  url: `${ document.location.pathname }.json`,
};

function getNodes() {

  const root = document.querySelector(conf.root);
  const controls = root.querySelectorAll(conf.controls);
  const subcontrols = root.querySelectorAll(conf.subcontrols);
  const subcontrolsList = root.querySelectorAll(conf.subcontrolsList);

  const targetsRoot = document.querySelector(conf.targetsRoot);
  const target = targetsRoot.querySelectorAll(conf.target);

  return {
    controls,
    subcontrols,
    subcontrolsList,
    target,
  };
}

const dom = getNodes();

function setInitialState() {

  for (const control of dom.controls) {
    // Control-display-state
    control.classList.add(conf.controlsState);
    // Control-ARIA-state
    control.setAttribute(conf.controlsMenuStateInd.attr, false);
    // Control-Interaction-state
    control.setAttribute('tabindex', '-1');
    control.disabled = true;
  }

  for (const subcontrol of dom.subcontrols) {
    // Initial Subcontrols-display-state (conf.subcontrolsListState)
    // is set in template to prevent flashing
    // Subcontrols-Interaction-state
    subcontrol.setAttribute('tabindex', '-1');
  }
}

function toggle(e, subcontrolsList, subcontrols) {

  // Control-display-state
  e.target.classList.toggle(conf.controlsStateInd);
  // Control-ARIA-state
  const isExpanded = e.target.getAttribute(conf.controlsMenuStateInd.attr) ===
    conf.controlsMenuStateInd.val;
  e.target.setAttribute(conf.controlsMenuStateInd.attr, !isExpanded);
  // Subcontrols-display-state
  subcontrolsList.classList.toggle(conf.subcontrolsListState);
  // Subcontrols-Interaction-state
  for (const subcontrol of subcontrols) {
    if (!isExpanded) {
      subcontrol.setAttribute('tabindex', '0');
    } else {
      subcontrol.setAttribute('tabindex', '-1');
    }
  }
}

// Fetch taxonomy collection of all children pages
async function fetchTaxonomy() {

  const response = await fetch(conf.url);

  if (response.ok) {
    const data = await response.json();
    return Promise.resolve(data);

  } else {
    const message = `Resource not found: ${ response.status }`;
    return Promise.reject(message);
  }
}

let taxonomyObj = {};

function enableFilter(taxObj) {

  for (const control of dom.controls) {
    // Control-display-state
    control.classList.remove(conf.controlsState);
    // Control-Interaction-state
    control.setAttribute('tabindex', '0');
    control.disabled = false;
  }

  taxonomyObj = taxObj;
}

// Create list of tags to be filtered
let filterTags = [];

function selectFilters(e) {

  const taxTagClicked = e.target.dataset.taxtag !== undefined ?
    e.target.dataset.taxtag :
    false;

  // Add tag for every button selected
  if (!filterTags.includes(taxTagClicked) && taxTagClicked !== false) {
    filterTags.push(taxTagClicked);
    // Remove tag for every button deselected
  } else if (taxTagClicked !== false) {
    filterTags = filterTags.filter((tag) => {
      return tag !== taxTagClicked;
    });
  }

  // Trigger search function
  if (filterTags.length !== 0) {
    searchTaxonomies(taxonomyObj, filterTags, dom);
  } else {
    // Reset to complete list
    displayResults(false, dom);
  }
  if (e.target.tagName === 'BUTTON') {
    e.target.classList.toggle(conf.subcontrolsStateInd);
  }
}

// Search Function: Create list of resulting URLs
function searchTaxonomies(taxonomyObj, filterTags) {

  let urls = [];
  for (const taxonomy of taxonomyObj.taxonomies) {

    let tags = [];
    // Gather all tags of taxonomy
    for (const [key, value]of Object.entries(taxonomy.tax)) {

      if (Array.isArray(value)) {
        tags.push(...value);
      } else {
        tags.push(value);
      }
    }

    // Find entries that match selected taxtags
    const matches = tags.filter((val) => {
      return filterTags.includes(val);
    });
    // Add URL to results
    if (matches.length !== 0) {
      urls.push(taxonomy.url);
    }
  }

  // When finished, trigger display function
  displayResults(urls, dom);
}

// Display Function: Hide all list items with different URLs
function displayResults(targets) {

  if (targets === false) {

    // Reset all list items to visible
    for (const node of dom.target) {

      node.classList.remove(conf.targetState);
    }

  } else if (targets.length !== 0) {

    for (const node of dom.target) {

      // Compare contained link with result-array
      let match = targets.filter((target) => {
        return node.firstElementChild.href.includes(target);
      });

      // Add hidden state to every element that does not match
      if (match.length === 0) {
        node.classList.add(conf.targetState);
      } else {
        node.classList.remove(conf.targetState);
      }
    }
  }
}

function init() {

  setInitialState();

  fetchTaxonomy().then((taxObj) => {
    enableFilter(taxObj);
  });

  for (const control of dom.controls) {

    control.addEventListener('click', (e) => {

      const currentSubcontrolsList = e.target.parentElement.nextElementSibling.firstElementChild;
      const currentSubcontrols = currentSubcontrolsList.querySelectorAll(conf.subcontrols);
      toggle(e, currentSubcontrolsList, currentSubcontrols);
    });
    control.parentElement.nextElementSibling.addEventListener('click', selectFilters);
  }
}

export { init, fetchTaxonomy, enableFilter };
