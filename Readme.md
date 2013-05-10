
# minispy

  Simple test spy, framework agnostic

## Installation

    $ component install ericgj/minispy

## API

  The API for inspecting spy results is similar to [sinon.js][a]'.

  To create a spy on an existing object's method:

### var spy = Spy( object, "method", fn )

  Creates a spy for `object.method` and executes the given function `fn`,
  which is the body of your test.

  Then you can `assert( spy.calledWith(message) )`, or any of the other
  inspection methods.

  The spy is detached from the method call after `fn` completes, so no need to
  manually `spy.restore()`, etc.


  To use a generic spy function (for callbacks, etc.):

### var spy = Spy(); obj.asyncMethod('message', spy.watch);

  Then you can `assertTrue( spy.called )`, or any other inspection method, to
  confirm the callback fired correctly.


## Example

## License

  MIT

[a]: http://sinonjs.org/docs/#spies

