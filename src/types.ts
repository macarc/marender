/*
   Copyright (C) 2021 macarc
 */
export interface Attributes {
  [attr: string]: string | number | boolean;
}

export interface Events {
  [event: string]: (e: Event) => void;
}

export interface V {
  name: string;
  attrs: Attributes;
  events: Events;
  children: (V | VString | null)[];
  node: Element | null;
}

export interface VString {
  s: string;
  node: Node | null;
}
