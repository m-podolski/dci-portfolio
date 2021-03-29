import {
  init as initNav,
} from './navigation.js';
import {
  init as initTabs,
} from './tabs.js';
import {
  placeIcons,
} from './icon-iterator.js';
import {
  init as initTaxfilter,
  enableFilter,
} from './taxonomy-filter.js';

initNav();
initTabs();
placeIcons();
initTaxfilter();
enableFilter();
