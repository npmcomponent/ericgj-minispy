
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


## License

  MIT

[a]: http://sinonjs.org/docs/#spies

