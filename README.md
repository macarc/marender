# Render

A simple and stupid virtual dom implementation. It's still quite rough around the edges.

## API

### h

- `h(name: string): VElement;`
- `h(name: string, children: Child[]): VElement;`
- `h(name: string, attrs: Attributes): VElement;`
- `h(name: string, attrs: Attributes, children: Child[]): VElement;`
- `h(name: string, attrs: Attributes, events: Events): VElement;`

Create a virtual DOM element.

### hFrom

- `hFrom(element: string | HTMLElement): V`

Takes an empty HTML element, or an ID for an empty element in the document, and creates a virtual DOM element from it. A non-empty element results in undefined behaviour :)

### patch

- `patch(before: VElement, after: VElement)`

Updates the DOM. You may only patch elements that are the same type of element (i.e. have the same tag name).

### svg

Same api as `h`. Creates a virtual DOM SVG element.

## Example Usage

```typescript
import { h, hFrom, patch } from "render/h";

const root = hFrom("some-empty-div-id");
const vdom = h(
  "div",
  { style: "font-size: 1rem" },
  { click: () => alert("hi") },
  [h("p", ["some text"])]
);

patch(root, vdom);

const newVdom = h(
  "div",
  { style: "font-size: 1.1rem" },
  { click: () => alert("hi") },
  [h("p", { style: "color: red" }, ["updated text"])]
);
patch(vdom, newVdom);
```

## Bottlenecks

There will eventually be a more optimised `difflist` - the beginning is in `difflist.ts`.

- add/removeEventListener - this is the main one, since every patch replaces every event listener. Caching/caching list render will help. Is there a way to avoid doing this without caching?
- setAttribute
