/*
   Virtual DOM implementation - still needs work
   Copyright (C) 2021 macarc
 */
import { V, VString } from "./types";

const isVString = (a: V | VString): a is VString =>
  (a as VString).s !== undefined;
const isVElement = (a: V | VString): a is V => (a as V).name !== undefined;

function unreachable(): never {
  throw new Error("marender: Unreachable");
}

// Create a new element from a virtual node
// Uses DocumentFragment for good-ish performance
function patchNew(v: V, topLevel = true): Element {
  const newElement = v.attrs.ns
    ? document.createElementNS(v.attrs.ns.toString(), v.name)
    : document.createElement(v.name);

  for (const attr in v.attrs) {
    const isFalse = typeof v.attrs[attr] === "boolean" && !v.attrs[attr];
    if (!isFalse) {
      newElement.setAttribute(attr, v.attrs[attr].toString());
    }
  }
  for (const event in v.events) {
    newElement.addEventListener(event, v.events[event]);
  }

  const parent = topLevel ? new DocumentFragment() : newElement;

  for (const child of v.children) {
    if (child === null) continue;

    if (isVString(child)) {
      const d = document.createTextNode(child.s);
      parent.appendChild(d);
      child.node = d;
    } else {
      const d = patchNew(child, false);
      parent.appendChild(d);
    }
  }
  if (topLevel) newElement.appendChild(parent);
  v.node = newElement;
  return newElement;
}
// Patches after onto before
// Compares both virtual DOM and efficiently updates the real DOM (actual DOM mutation is slow)
// Returns true if after.node !== before.node (i.e. the node needs to be replaced)
export function patch(before: V, after: V): boolean {
  if (
    before.node === null ||
    before.name.toLowerCase() !== after.name.toLowerCase()
  ) {
    patchNew(after);
    return true;
  }
  after.node = before.node;

  for (const attr in { ...before.attrs, ...after.attrs }) {
    if (before.attrs[attr] !== after.attrs[attr]) {
      if (
        after.attrs[attr] === null ||
        after.attrs[attr] === undefined ||
        after.attrs[attr] === false
      ) {
        before.node.removeAttribute(attr);
      } else {
        before.node.setAttribute(attr, after.attrs[attr].toString());
      }
    }
  }
  for (const event in { ...before.events, ...after.events }) {
    if (before.events[event] !== after.events[event]) {
      after.node.removeEventListener(event, before.events[event]);
      after.node.addEventListener(event, after.events[event]);
    }
  }

  after.children = after.children.filter((a) => a !== null);

  const childrenDiffLength = before.children.length - after.children.length;
  for (let i = 0; i < childrenDiffLength; i++)
    before.node.removeChild(
      before.node.childNodes[before.node.childNodes.length - 1]
    );

  for (let child = 0; child < after.children.length; child++) {
    const aft = after.children[child];
    const bef = before.children[child] || null;
    const oldNode: Node | null = bef && bef.node;

    if (aft === null) {
      // Child needs to be removed
      if (bef && oldNode) after.node.removeChild(oldNode);
    } else if (!bef || !oldNode || child >= before.children.length) {
      // Child needs to be added
      if (isVElement(aft)) {
        after.node.insertBefore(
          patchNew(aft),
          before.node.children[child] || null
        );
      } else if (isVString(aft)) {
        aft.node = document.createTextNode(aft.s);
        after.node.insertBefore(aft.node, before.node.children[child] || null);
      } else {
        unreachable();
      }
    } else {
      // Child needs to be changed
      if (isVString(bef) && isVString(aft)) {
        if (aft !== bef) {
          oldNode.nodeValue = aft.s;
          aft.node = oldNode;
        }
      } else if (isVElement(bef) && isVElement(aft)) {
        const isNewNode = patch(bef, aft);
        if (isNewNode && aft.node && bef.node)
          after.node.replaceChild(aft.node, bef.node);
      } else if (isVString(aft)) {
        aft.node = document.createTextNode(aft.s);
        after.node.replaceChild(aft.node, oldNode);
      } else if (isVString(bef)) {
        after.node.replaceChild(patchNew(aft), oldNode);
      } else {
        unreachable();
      }
    }
  }
  return false;
}
