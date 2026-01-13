# Quiz: JavaScript Objects, Reflection, and Proxies

Select the best answer for each question.

1) What does `Object.create(proto)` do?
A. Clones `proto` deeply
B. Creates an object with `proto` as its prototype
C. Creates a class extending `proto`
D. Copies enumerable properties from `proto`

2) Which statement about ES2015 `class` is true?
A. It introduces classical inheritance internally
B. It’s syntactic sugar over prototypes
C. It prevents method overriding
D. It forces private fields

3) Which API reliably checks own properties only?
A. `key in obj`
B. `Object.keys(obj)`
C. `Object.hasOwn(obj, key)`
D. `for...in`

4) Which descriptor flag hides a property from `Object.keys`?
A. `writable`
B. `configurable`
C. `enumerable`
D. `value`

5) What does `Reflect.set(obj, key, value)` return?
A. The new value
B. The previous value
C. A boolean indicating success
D. Nothing (undefined)

6) Which operation traverses the prototype chain?
A. `Object.hasOwn(obj, key)`
B. `Object.getOwnPropertyNames(obj)`
C. `key in obj`
D. `Object.entries(obj)`

7) Which is a safe alternative to `obj.__proto__`?
A. `Object.keys`
B. `Object.getPrototypeOf`
C. `Object.values`
D. `Object.entries`

8) What do proxies intercept?
A. Only `get` operations
B. Only `set` operations
C. Fundamental operations like `get`, `set`, `has`, `ownKeys`
D. Only function calls

9) Which trap would you implement to customize `Object.keys(proxy)`?
A. `get`
B. `set`
C. `ownKeys`
D. `has`

10) Which pattern best hides sensitive fields from `in` operator?
A. `get` trap
B. `has` trap
C. `apply` trap
D. `construct` trap

11) What does `Proxy.revocable(target, handler)` provide?
A. A proxy that auto-expires after time
B. A proxy and a `revoke()` function
C. A singleton proxy instance
D. A deep-cloned proxy

12) Which is true about `for...in`?
A. Lists only own properties
B. Lists own enumerable properties and enumerable ones from the prototype chain
C. Lists non-enumerable properties
D. Ignores the prototype chain

13) What’s the main difference between `Reflect.deleteProperty` and `delete obj.key`?
A. `Reflect.deleteProperty` throws on failure
B. `Reflect.deleteProperty` returns boolean success
C. `delete` returns boolean
D. No difference

14) Which is recommended for map-like objects without inherited keys?
A. `Object.create({})`
B. `Object.create(null)`
C. `new Object()`
D. ES2015 `class`

15) Why avoid arrow functions for class methods needing `this`?
A. Arrow functions are slower
B. Arrow functions capture lexical `this` and can break `this` binding
C. Arrow functions are not supported in classes
D. Arrow functions don’t allow parameters

16) Which pair is best for adapting library APIs safely?
A. `Object.keys` + `for...in`
B. `Reflect` + `Proxy`
C. `Object.values` + `Object.entries`
D. `Object.hasOwn` + `Object.getOwnPropertyNames`
