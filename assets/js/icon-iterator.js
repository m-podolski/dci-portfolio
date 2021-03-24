
/* Inserts (SVG)-Icons which are provided inline by the backend into their places within the markup by looking for markers like "{{name-name.svg}}" or "{{name-name-name.svg}}". SVGs must contain a classname that equals the files base-name (without braces and extension) */

const scope = document.querySelector('body');
const icons = scope.querySelectorAll('svg.icon'); // svg prefixed for more performance

const markerPattern = /\{\{(?:[a-z]+-){1,2}(?:[a-z]+)\.[a-z]{3}\}\}/gu;

function placeIcons() {

  if (icons.length !== 0) {

    const iterator = document.createNodeIterator(
      scope,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          if (markerPattern.test(node.data)) {
            return NodeFilter.FILTER_ACCEPT;
          }
        },
      },
    );

    let node;
    let register = [];

    while (iterator.nextNode()) {

      let nodeText = node.textContent;
      // Dont forget to adjust slice-limits to changes of the marker pattern!
      let iconName = nodeText.match(markerPattern).toString().slice(2, -6);

      let curParent = node.parentElement;
      let grandparent = node.parentElement.parentElement;
      let nextSibling = curParent.nextElementSibling;
      let newParent = document.createElement('div');
      newParent.classList.add('icon-container');

      grandparent.removeChild(curParent);
      grandparent.insertBefore(newParent, nextSibling);

      for (let icon of icons) {

        if (icon.classList.contains(iconName)) {

          if (register.includes(iconName)) {
            let child = icon.cloneNode(true);
            child.style.display = 'inline';
            newParent.appendChild(child, node);
          } else {
            let child = icon;
            child.style.display = 'inline';
            newParent.appendChild(child, node);
          }
        }
      }

      register.push(iconName);
    }
  }
}

export { placeIcons };
