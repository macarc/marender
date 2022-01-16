import { h, hFrom, patch } from "../src/index";

describe("marender", () => {
  const el = () => hFrom(document.createElement("div"));

  const hello = () => h("div", ["Hello"]);
  const helloEm = () => h("div", [h("em", ["Hello"])]);

  const goodbye = () => h("div", ["Goodbye"]);
  const goodbyeStrong = () => h("div", [h("strong", ["Goodbye"])]);

  test("string -> string", () => {
    const e = el();
    const one = hello();
    const two = goodbye();

    patch(e, one);
    expect(e.node?.innerHTML).toBe("Hello");

    patch(one, two);
    expect(e.node?.innerHTML).toBe("Goodbye");
  });

  test("el -> el", () => {
    const e = el();
    const one = helloEm();
    const two = goodbyeStrong();

    patch(e, one);
    expect(e.node?.innerHTML).toBe("<em>Hello</em>");

    patch(one, two);
    expect(e.node?.innerHTML).toBe("<strong>Goodbye</strong>");
  });

  test("string -> el", () => {
    const e = el();
    const one = hello();
    const two = helloEm();

    patch(e, one);
    expect(e.node?.innerHTML).toBe("Hello");

    patch(one, two);
    expect(e.node?.innerHTML).toBe("<em>Hello</em>");
  });

  test("el -> string", () => {
    const e = el();
    const one = helloEm();
    const two = hello();

    patch(e, one);
    expect(e.node?.innerHTML).toBe("<em>Hello</em>");

    patch(one, two);
    expect(e.node?.innerHTML).toBe("Hello");
  });

  test("adding / removing deeper children", () => {
    const e = el();
    const one = h("div", [h("div")]);
    const two = h("div", [h("div", [h("div")])]);
    const three = h("div");

    patch(e, one);
    expect(e.node?.children[0].children.length).toBe(0);

    patch(one, two);
    expect(e.node?.children[0].children[0].children.length).toBe(0);

    patch(two, three);
    expect(e.node?.children.length).toBe(0);
  });

  test("deleting children", () => {
    const e = el();
    const one = h("div", [h("p", ["Hello"]), h("p", ["There"])]);
    const two = h("div", [h("p", ["There"])]);

    patch(e, one);
    expect(e.node?.children.length).toBe(2);

    patch(one, two);
    expect(e.node?.innerHTML).toBe("<p>There</p>");
  });

  test("identical children are not patched", () => {
    const attr = jest.fn();
    attr.mockReturnValue("foo");
    const shared = h("div", {
      get attr() {
        return attr();
      },
    });
    const e = el();
    const one = h("div", ["Hi, ", shared]);
    const two = h("div", ["Hello, ", shared]);

    patch(e, one);
    const calls = attr.mock.calls.length;

    patch(one, two);
    expect(attr).toHaveBeenCalledTimes(calls);
  });

  test("null children", () => {
    const e = el();
    const one = h("div", [null]);
    const two = h("div", [null, h("p")]);
    const three = h("div", [h("p"), null]);

    patch(e, one);
    expect(e.node?.children.length === 0);

    patch(one, two);
    expect(e.node?.children.length === 1);

    patch(two, three);
    expect(e.node?.children.length === 1);
  });

  test("adding / deleting attributes", () => {
    const e = el();
    const one = h("div", [h("div", { attr: "hello" })]);
    const two = h("div", [h("div", { attr: "world" })]);
    const three = h("div", [h("div")]);

    patch(e, one);
    expect(e.node?.children[0].getAttribute("attr")).toBe("hello");

    patch(one, two);
    expect(e.node?.children[0].getAttribute("attr")).toBe("world");

    patch(two, three);
    expect(e.node?.children[0].hasAttribute("attr")).toBe(false);
  });

  test("boolean attributes", () => {
    const e = el();
    const one = h("div", [h("div", { attr: false })]);
    const two = h("div", [h("div", { attr: true })]);
    const three = h("div", [h("div", { attr: false })]);

    patch(e, one);
    expect(e.node?.children[0].hasAttribute("attr")).toBe(false);

    patch(one, two);
    expect(e.node?.children[0].hasAttribute("attr")).toBe(true);

    patch(two, three);
    expect(e.node?.children[0].hasAttribute("attr")).toBe(false);
  });

  test("adding / deleting event listeners", () => {
    const eventListener1 = jest.fn();
    const eventListener2 = jest.fn();
    const e = el();
    const one = h("div", [h("div", {}, { click: eventListener1 })]);
    const two = h("div", [h("div", {}, { click: eventListener1 })]);
    const three = h("div", [h("div", {}, { click: eventListener2 })]);

    patch(e, one);
    (e.node?.children[0] as HTMLElement).click();
    expect(eventListener1).toHaveBeenCalled();

    patch(one, two);
    (e.node?.children[0] as HTMLElement).click();
    expect(eventListener1).toHaveBeenCalledTimes(2);

    patch(two, three);
    (e.node?.children[0] as HTMLElement).click();
    expect(eventListener2).toHaveBeenCalled();
    expect(eventListener1).toHaveBeenCalledTimes(2);
  });
});
