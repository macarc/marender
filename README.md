# Render

A stupid and simple virtual dom implementation. It's still quite rough around the edges and there are cases I haven't handled yet, as they haven't come up yet.

## API

`h` and `svg` create virtual HTML elements and SVG elements respectively. They are overloaded with the following options:


* `h(name: string): VElement;`
* `h(name: string, children: Child[]): VElement;`
* `h(name: string, attrs: Attributes): VElement;`
* `h(name: string, attrs: Attributes, children: Child[]): VElement;`
* `h(name: string, attrs: Attributes, events: Events): VElement;`

To turn an empty element on the page to a virtual DOM element use `hFrom`:

`hFrom(element: string | HTMLElement): V` 

If a string is passed, it is used as an ID.

To update the page, use the `patch` function:

`patch(before: VElement, after: VElement)`

You an only patch elements that are the same type of element (i.e. have the same tag name).

## Example Usage

```typescript
import { h, hFrom, patch } from 'render/h';

const root = hFrom('some-empty-div-id');
const vdom = h(
  'div',
  { style: 'font-size: 1rem' },
  { click: () => alert('hi') },
  [h('p', ['some text'])]
);

patch(root, vdom);

const newVdom = h(
  'div',
  { style: 'font-size: 1.1rem' },
  { click: () => alert('hi') },
  [h('p', { style: 'color: red' }, ['updated text'])]
);
patch(vdom, newVdom);
```

## Bottlenecks

There will eventually be a more optimised `difflist` - the beginning is in `difflist.ts`.

- add/removeEventListener - this is the main one, since every patch replaces every event listener. Caching/caching list render will help. Is there a way to avoid doing this without caching?
- setAttribute
