# JavaScript Objects: Constructors, Prototypes, Reflection, and Proxies

This lesson explores how JavaScript objects work under the hood: creation patterns, prototypal inheritance, property descriptors, reflection with `Reflect`, and metaprogramming with `Proxy`.

> 💡 IMPORTANT: JavaScript uses prototypal inheritance, not classical inheritance. ES2015 `class` syntax is syntactic sugar over prototypes.

## 1) Creating Objects

### 1.1 Object literals
```ts
const user = { name: "Ada", role: "admin" };
user.email = "ada@example.com";
```

### 1.2 Spread operator for cloning and merging
```ts
const original = { a: 1, b: 2 };
const cloned = { ...original }; // shallow clone
const merged = { ...original, c: 3 }; // add properties
const overridden = { ...original, a: 99 }; // override existing
const combined = { ...original, ...{ b: 20, d: 4 } }; // merge two objects
```

### 1.3 Object destructuring for unpacking
```ts
const user = { name: "Ada", role: "admin", email: "ada@ex.com" };
const { name, role } = user; // extract properties
const { name: userName, role: userRole } = user; // rename
const { name, ...rest } = user; // rest operator to capture remaining
```

### 1.4 `Object.assign(target, ...sources)`
Copies enumerable own properties from sources into target (mutates target).
```ts
const base = { a: 1, b: 2 };
const ext = { c: 3, a: 99 }; // overrides base.a
const result = Object.assign({}, base, ext); // result = { a: 99, b: 2, c: 3 }
Object.assign(base, ext); // mutates base directly
```

> 💡 IMPORTANT: Both spread (`{...obj}`) and `Object.assign({}, obj)` create shallow copies. Nested objects are still referenced, not cloned deeply.

### 1.5 `Object.create(proto)`
Creates a new object with a specified prototype.
```ts
const personProto = { greet() { return `Hello, ${this.name}`; } };
const ada = Object.create(personProto);
ada.name = "Ada";
```

### 1.6 Constructor functions
```ts
function Person(name: string) {
  this.name = name;
}
Person.prototype.greet = function () {
  return `Hello, ${this.name}`;
};
const p = new (Person as any)("Ada");
```

### 1.7 ES2015 Classes (sugar over prototypes)
```ts
class PersonClass {
  name: string;
  constructor(name: string) { this.name = name; }
  greet() { return `Hello, ${this.name}`; }
}
const pc = new PersonClass("Ada");
```

> ⚠️ CRITICAL: Avoid arrow functions for class methods that use `this`; arrow functions capture lexical `this` and can lead to unexpected behavior.

## 2) Prototypes & Inheritance

Every object has an internal `[[Prototype]]` link forming a chain. Property lookups traverse up this chain.

### 2.1 Inspecting and setting prototypes
```ts
const proto = { kind: "base" };
const obj = Object.create(proto);
Object.getPrototypeOf(obj) === proto; // true
Object.setPrototypeOf(obj, null); // removes the chain (use sparingly)
```

> ⚠️ CRITICAL: Avoid `obj.__proto__` in production—prefer `Object.getPrototypeOf`/`Object.setPrototypeOf`.

### 2.2 Inheritance via classes
```ts
class Animal {
  name: string;
  constructor(name: string) { this.name = name; }
  speak() { return `${this.name} makes a noise.`; }
}
class Dog extends Animal {
  constructor(name: string) { super(name); }
  speak() { return `${super.speak()} Woof!`; }
}
const d = new Dog("Rex");
d.speak(); // "Rex makes a noise. Woof!"
```

> 💡 IMPORTANT: `super` resolves to methods on the parent prototype. Overridden methods can call `super.method()` as shown above.

## 3) Property Descriptors

Each property has attributes: `value`, `writable`, `enumerable`, `configurable`, or getter/setter.

```ts
const obj = {} as any;
Object.defineProperty(obj, "id", {
  value: 42,
  writable: false,
  enumerable: true,
  configurable: false,
});

Object.getOwnPropertyDescriptor(obj, "id");
Object.getOwnPropertyDescriptors(obj);
```

> 💡 IMPORTANT: Non-configurable properties cannot be deleted or reconfigured. Non-writable but enumerable properties are visible yet immutable.

### Getters and setters
```ts
const account = {
  _balance: 0,
  get balance() { return this._balance; },
  set balance(v: number) {
    if (v < 0) throw new Error("negative not allowed");
    this._balance = v;
  }
};
```

## 4) Object Inspection Utilities

- `Object.keys(obj)`: own enumerable string keys
- `Object.values(obj)`: own enumerable values
- `Object.entries(obj)`: `[key, value]` pairs
- `Object.getOwnPropertyNames(obj)`: own keys including non-enumerable
- `Object.getOwnPropertySymbols(obj)`: own symbol keys
- `Object.hasOwn(obj, key)`: checks own property presence (ES2022)
- `key in obj`: checks in prototype chain as well
- `for...in`: iterates enumerable keys including proto chain

```ts
const user = Object.create({ protoKey: true });
Object.defineProperty(user, "hidden", { value: 1, enumerable: false });
user.visible = 2;

Object.keys(user); // ["visible"]
"protoKey" in user; // true (via prototype)
Object.hasOwn(user, "protoKey"); // false
```

> ⚠️ CRITICAL: Prefer `Object.hasOwn(obj, key)` or `Object.prototype.hasOwnProperty.call(obj, key)` when you only want own properties.

## 5) Reflection with `Reflect`

`Reflect` provides function-style, consistent equivalents to object operations.

```ts
const o: Record<string, unknown> = { a: 1 };
Reflect.get(o, "a"); // 1
Reflect.set(o, "b", 2); // true
Reflect.has(o, "a"); // true
Reflect.deleteProperty(o, "a"); // true
Reflect.defineProperty(o, "c", { value: 3, writable: true });
Reflect.getOwnPropertyDescriptor(o, "c");
Reflect.ownKeys(o); // names + symbols
```

> 💡 IMPORTANT: `Reflect.set` returns a boolean (success) rather than throwing; some ops are easier to compose with booleans.

Other useful methods:
- `Reflect.apply(fn, thisArg, args)` — call functions
- `Reflect.construct(Ctor, args, newTarget?)` — construct instances
- `Reflect.getPrototypeOf`, `Reflect.setPrototypeOf`
- `Reflect.preventExtensions`, `Reflect.isExtensible`

## 6) Metaprogramming with `Proxy`

Proxies wrap a target object and intercept operations via "traps".

### 6.1 Basic logging proxy
```ts
const target = { x: 1 };
const handler: ProxyHandler<any> = {
  get(t, prop, recv) {
    console.log("get", String(prop));
    return Reflect.get(t, prop, recv);
  },
  set(t, prop, value, recv) {
    console.log("set", String(prop), value);
    return Reflect.set(t, prop, value, recv);
  }
};
const proxy = new Proxy(target, handler);
proxy.x; // logs get
proxy.y = 2; // logs set
```

### 6.2 Validation proxy
```ts
type User = { id: number; name: string };
const userTarget: Partial<User> = {};
const validator: ProxyHandler<Partial<User>> = {
  set(t, prop, value) {
    if (prop === "id" && typeof value !== "number")
      throw new TypeError("id must be number");
    if (prop === "name" && typeof value !== "string")
      throw new TypeError("name must be string");
    return Reflect.set(t, prop, value);
  }
};
const safeUser = new Proxy(userTarget, validator);
safeUser.id = 1; // ok
// safeUser.id = "1"; // throws
```

### 6.3 Access control via `has` and `ownKeys`
```ts
const secret = { token: "SECRET", public: 1 } as any;
const secured = new Proxy(secret, {
  has(t, key) {
    if (key === "token") return false; // hide from `in`
    return Reflect.has(t, key);
  },
  ownKeys(t) {
    return Reflect.ownKeys(t).filter(k => k !== "token");
  },
});
("token" in secured); // false
Object.keys(secured); // ["public"]
```

### 6.4 Revocable proxies
```ts
const { proxy: revProxy, revoke } = Proxy.revocable({ x: 1 }, {
  get: (t, p) => Reflect.get(t, p)
});
revoke();
// revProxy.x; // TypeError: Cannot perform 'get' on a proxy that has been revoked
```

> ⚠️ CRITICAL: Proxies may introduce performance overhead. Avoid wrapping hot-path objects like large arrays in tight loops.

### Common traps (partial list)
- `get`, `set`, `has`, `deleteProperty`
- `ownKeys`, `getOwnPropertyDescriptor`, `defineProperty`
- `apply` (for functions), `construct` (for constructors)
- `getPrototypeOf`, `setPrototypeOf`, `isExtensible`, `preventExtensions`

## 7) Patterns & Guidance

- Prefer plain objects for simple data; use classes when you need instance methods, invariants, or inheritance.
- Use `Object.create(null)` for map-like objects with no prototype.
- For read-only views, combine non-writable descriptors with proxies that block writes.
- When interoperating with libraries, `Reflect` + proxies can implement flexible adapters.

> 💡 IMPORTANT: If you need to virtualize or lazily load properties (e.g., remote data), proxies can surface an object-like API while deferring work until access.

## 8) Practice Ideas

- Build a validated model using descriptors (required fields, read-only IDs).
- Create a logging proxy that counts property reads/writes.
- Implement access control that hides internal fields (`_private`).
