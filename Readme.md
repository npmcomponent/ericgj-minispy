
# minispy

  Simple test spy utilities, framework agnostic.
  Inspection API similar to [sinon.js][a].

## Installation

    $ component install ericgj/minispy

## Example

###  To use a spy itself as a simple callback function

  ```javascript
  var spy = Spy();
  someFunctionWithCallback("parameter", spy.watch);
  assert(spy.called());
  ```

###  To inject a spy into a callback function 

  ```javascript
  var spy = Spy(callback);
  someFunctionWithCallback("parameter", spy.watch);
  assert.equal(spy.lastCall().returnValue, 1);
  ```

###  To inject a spy into a method call on an existing object

  ```javascript
  var spy = Spy(obj)
  spy.stub("method", function(){
    obj.method();
  });
  assert(spy.called());
  ```

## API

  The API for inspecting spy results is similar to [sinon.js][a],
  except using methods instead of properties (e.g. `spy.called()` vs 
  `spy.called`.
 
  Only the following inspection methods from sinon.js are built-in
  ( _italics indicates methods not yet implemented_ ):

  <tt>
  - callCount
  - called
  - notCalled
  - calledOnce
  - calledExactly({Integer})
  - firstCall
  - lastCall
  - getCall({Integer})
  - calledWith(args...)
  - alwaysCalledWith(args...)
  - calledWithExactly(args...)
  - alwaysCalledWithExactly(args...)
  - neverCalledWith(args...)
  - _threw({null|String|Object})_
  - _alwaysThrew({null|String|Object})_
  - _returned({Object})_
  - _alwaysReturned({Object})_
  - calledBefore({Spy})
  - calledAfter({Spy})
  </tt>

  Note that `spy.calls()` returns an [enumerable][b], allowing for 
  easily defined custom finders and chaining. For example, to select 
  _"the return values from all spied calls with the first argument > 1"_:

  ```javascript
  spy.calls().select('arguments[0] > 1').map('returnValue');
  ```

## License

  MIT

[a]: http://sinonjs.org/docs/#spies
[b]: https://github.com/component/enumerable

