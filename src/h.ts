/*
   Virtual DOM API
   Copyright (C) 2021 macarc
 */
import { V, Attributes, Events } from "./types";
import { patch } from "./vdom";

type Child = V | string | null;

const toV = (children: Child[]) =>
  children.map((s) => (typeof s === "string" ? { s, node: null } : s));

// Creates a virtual DOM node
function h(name: string): V;
function h(name: string, children: Child[]): V;
function h(name: string, attrs: Attributes): V;
function h(name: string, attrs: Attributes, children: Child[]): V;
function h(name: string, attrs: Attributes, events: Events): V;
function h(
  name: string,
  attrs: Attributes,
  events: Events,
  children: Child[]
): V;
function h(
  name: string,
  a: Attributes | Child[] = {},
  b: Events | Child[] = {},
  c: Child[] = []
): V {
  if (Array.isArray(a))
    return { name, attrs: {}, events: {}, children: toV(a), node: null };

  return Array.isArray(b)
    ? { name, attrs: a, events: {}, children: toV(b), node: null }
    : { name, attrs: a, events: b, children: toV(c), node: null };
}

// Creates a virtual DOM node that is an SVG element
function svg(name: string): V;
function svg(name: string, children: Child[]): V;
function svg(name: string, attrs: Attributes): V;
function svg(name: string, attrs: Attributes, children: Child[]): V;
function svg(name: string, attrs: Attributes, events: Events): V;
function svg(
  name: string,
  attrs: Attributes,
  events: Events,
  children: Child[]
): V;
function svg(
  name: string,
  a: Attributes | Child[] = {},
  b: Events | Child[] = {},
  c: Child[] = []
): V {
  if (Array.isArray(a)) return h(name, { ns: "http://www.w3.org/2000/svg" }, a);

  a.ns = "http://www.w3.org/2000/svg";
  return Array.isArray(b) ? h(name, a, b) : h(name, a, b, c);
}

// Converts an empty element to a virtual DOM element
// If a string is passed, uses that as an id
function hFrom(element: string | HTMLElement): V {
  const el =
    typeof element === "string" ? document.getElementById(element) : element;

  if (!el) throw new Error("Passed an invalid id to marender:hFrom");

  return { name: el.tagName, attrs: {}, events: {}, children: [], node: el };
}

// Functions
export { h, hFrom, patch, svg };
// Types
export { Attributes, Child, Events, V };
