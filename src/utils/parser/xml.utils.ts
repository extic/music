export function findOne(element: Element, subElement: string): Element {
  return element.querySelector(subElement)!!;
}

export function findAll(element: Element, subElement: string): Element[] {
  return [...element.querySelectorAll(subElement)];
}

export function findAttr(element: Element, attrName: string): string {
  return element.getAttribute(attrName)!!;
}

export function findAttrInt(element: Element, attrName: string): number {
  return parseInt(element.getAttribute(attrName)!!, 10);
}

export function findOptionalOneAsString(element: Element, subElement: string): string | undefined {
  return element.querySelector(subElement)?.textContent ?? undefined;
}

export function findOneAsString(element: Element, subElement: string): string {
  return findOne(element, subElement).textContent!!;
}

export function findOptionalOneAsInt(element: Element, subElement: string): number | undefined {
  const number = element.querySelector(subElement)?.textContent ?? undefined;
  if (number) {
    return parseInt(number, 10);
  }
  return undefined;
}

export function findOneAsInt(element: Element, subElement: string): number {
  return parseInt(findOne(element, subElement).textContent!!, 10);
}

export function findOneAsNumber(element: Element, subElement: string): number {
  return parseFloat(findOne(element, subElement).textContent!!);
}
