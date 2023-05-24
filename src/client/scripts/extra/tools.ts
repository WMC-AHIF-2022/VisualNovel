export function removeAllEventListeners(element: HTMLElement): HTMLElement {
  const newElement = <HTMLElement>element.cloneNode(true);
  element.replaceWith(newElement);
  return newElement;
}
