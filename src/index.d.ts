// Marender API

// Types

export interface Attributes {
  [attr: string]: string | number | boolean;
}

export type Child = V | string | null;

export interface Events {
  [event: string]: (e: Event) => void;
}
interface VString {
  s: string;
  node: Node | null;
}
export interface V {
  name: string;
  attrs: Attributes;
  events: Events;
  children: (V | VString | null)[];
  node: Element | null;
}

// Functions

export function h(name: string): V;
export function h(name: string, children: Child[]): V;
export function h(name: string, attrs: Attributes): V;
export function h(name: string, attrs: Attributes, children: Child[]): V;
export function h(name: string, attrs: Attributes, events: Events): V;
export function h(
  name: string,
  attrs: Attributes,
  events: Events,
  children: Child[]
): V;

export function hFrom(element: string | HTMLElement): V;

export function patch(before: V, after: V): boolean;

export function svg(name: string): V;
export function svg(name: string, children: Child[]): V;
export function svg(name: string, attrs: Attributes): V;
export function svg(name: string, attrs: Attributes, children: Child[]): V;
export function svg(name: string, attrs: Attributes, events: Events): V;
export function svg(
  name: string,
  attrs: Attributes,
  events: Events,
  children: Child[]
): V;
