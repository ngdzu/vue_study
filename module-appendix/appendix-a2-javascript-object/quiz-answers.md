# Quiz Answers: JavaScript Objects, Reflection, and Proxies

1) B — `Object.create(proto)` sets the new object’s `[[Prototype]]` to `proto`.
2) B — `class` is syntactic sugar over prototype-based inheritance.
3) C — `Object.hasOwn(obj, key)` checks own properties only.
4) C — `enumerable` controls visibility in `Object.keys`, `for...in`.
5) C — `Reflect.set` returns a boolean indicating success.
6) C — `key in obj` considers the prototype chain.
7) B — Use `Object.getPrototypeOf`/`Object.setPrototypeOf`.
8) C — Proxies can intercept many fundamental operations.
9) C — `ownKeys` customizes the list of own keys.
10) B — `has` can hide properties from the `in` operator.
11) B — Returns `{ proxy, revoke }` to disable later.
12) B — Iterates own and inherited enumerable properties.
13) B — `Reflect.deleteProperty` returns boolean success (uniform API).
14) B — `Object.create(null)` creates an object with no prototype.
15) B — Arrow functions capture lexical `this`, breaking the dynamic `this` of methods.
16) B — `Reflect` + `Proxy` enable uniform operations and interception for adaptation.

## References in Lesson
- Inspecting prototypes: `Object.getPrototypeOf`, `Object.setPrototypeOf`
- Descriptors: `Object.defineProperty`, `Object.getOwnPropertyDescriptors`
- Reflection: `Reflect.get`, `Reflect.set`, `Reflect.ownKeys`
- Proxies: `Proxy`, `Proxy.revocable`, common traps

## Example Recap
```ts
// Hide a field from enumeration and `in` checks
const secret = { token: "SECRET", public: 1 } as any;
const secured = new Proxy(secret, {
  has(t, key) { return key === "token" ? false : Reflect.has(t, key); },
  ownKeys(t) { return Reflect.ownKeys(t).filter(k => k !== "token"); },
});
```
