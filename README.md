# Macarc's Virtual DOM Render

A simple and stupid virtual dom implementation. It's still quite rough around the edges.

## Features

- Simple - 186 loc, but all the work is done in `src/vdom.ts` which is 110 loc. 4 public functions.
- Stupid - I have no idea how virtual DOM works! I just made it up :P It has worked just fine for [my use case](https://github.com/macarc/PipeScore)
- No dependencies

### What is virtual DOM?

Editing the DOM by hand is hard if you wish to use 'functional' techniques, due to its procedural nature. The virtual DOM is a wrapper over the DOM API to provide a functional equivalent. Using a virtual DOM library, you create two JS objects that represent the old state of the page and the new state of the page, and then perform a patch. The objects can be created using 'pure' code, which is nice :)

The patching algorithm simply goes through the differences and applies them to the real DOM. This is ostensibly more efficient than hand-written code since a naïve approach would delete everything and start again, and the DOM API is pretty slow, while a decent patching algorithm will skip over parts that are the same. Of course, using procedural code is the fastest, but undesirable for (most) programmers, and programmers are the people writing the code (for better or for worse).

## API

### Functions

#### h

- `h(name: string): V`
- `h(name: string, children: Child[]): V`
- `h(name: string, attrs: Attributes): V`
- `h(name: string, attrs: Attributes, children: Child[]): V`
- `h(name: string, attrs: Attributes, events: Events): V`

Create a virtual DOM element.

#### hFrom

- `hFrom(element: string | HTMLElement): V`

From an empty HTML element, or an ID for an empty element in the document, create a virtual DOM element. A non-empty element results in undefined behaviour :)

#### patch

- `patch(before: V, after: V)`

Update the DOM. You may only patch elements that are the same type of element (i.e. that have the same tag name).

#### svg

Same api as `h`. Create a virtual DOM SVG element.

### Types

#### Attributes

```ts
interface Attributes {
  [attr: string]: string | number | boolean;
}
```

A set of HTML attributes, which can be added using `setAttribute`.

#### Child

```ts
type Child = V | string | null;
```

A child element. A child element that is `null` will not be rendered.

#### Events

```ts
interface Events {
  [event: string]: (e: Event) => void;
}
```

A set of events, which can be added using `addEventListener`.

#### V

A virtual DOM element.

## Example Usage

```ts
import { h, hFrom, patch } from "marender";

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
