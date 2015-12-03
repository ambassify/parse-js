# parse-js [![Circle CI](https://circleci.com/gh/bubobox/parse-js.svg?style=svg)](https://circleci.com/gh/bubobox/parse-js)

Utility library for object structure conversion.

## Usage

This library contains parser, reverser and transform methods.

The **parser** methods extract data from an object
and attempt to parse the extracted data.

The **reverser** methods do the reverse of parsers. They transform a value
of the correct datatype back to a serialized form.

`transform` and `reverseTransform` transform an entire object according to the supplied specification.
This specification is defined using parser methods.


### Parser methods

These methods transform input data into the desired format, below is an example that can transform JSON
encoded arrays and lists separated by comma's into an array.

```javascript
var parse = require('parse-js');

var parser = parse.array('key-to-parse');
var result = parser({ 'key-to-parse': 'a,b,c,d' });
console.log(result);
// Result: ['a','b','c','d']
```

### Reverser methods

These methods perform the reverse transformation of the parsers and thus serialize the data into
a format that can be parsed at a later time using the parser methods.

```javascript
var parse = require('parse-js');

var parser = parse.array('key-to-parse');
var result = parser.reverse(['a','b','c','d']);
console.log(result);
// Result: "["a","b","c","d"]"
```

### Defining specifications

A specification is an object representing the outline of the desired output object. As values for each key you either
define the path at which the value for the key can be found or a parser.

```javascript
var specification = {
    id: 'id',
    name: 'user.fullname',
    firstname: 'user.fname',
    lastname: 'user.lname',

    interests: parse.array('interests'),

    activated: parse.boolean('subscription.activated')
}
```

Below is an example of what the transformation of an object does using this specification.

```javascript
var source = {
    id: 123,
    user: {
        fullname: 'John Doe',
        fname: 'John',
        lname: 'Doe'
    }
    interests: 'one,two,three',
    subscription: {
        reference: '1234abcd',
        activated: 'yes'
    }
};

var target = parse.transform(specification, source);
console.log(target);

// Result
{ id: 123,
  name: 'John Doe',
  firstname: 'John',
  lastname: 'Doe',
  interests: [ 'one', 'two', 'three' ],
  activated: true }

```

### Available parsers

- **string**(&lt;path>)

  Convert value at *&lt;path>* to a string.

- **boolean**(&lt;path>)

  Convert value at *&lt;path>* to a boolean. Values `true`, `'1'`, `yes` and `y` will be mapped to true.

- **date**(&lt;path>, &lt;nowOnInvalid>)

  Select value at *&lt;path>* and convert it to a date. If the value is no valid date and *&lt;nowOnInvalid>* is set to true return current time.

- **array**(&lt;path>, &lt;valueParser>)

  Parse value as an array converting comma separated lists and JSON arrays to arrays. Can run *&lt;valueParser>* on each value in the array.

- **equals**(&lt;path>, &lt;shouldEqual>, &lt;notEqualReverseValue>):

  Converts to `true` if value at *&lt;path>* equals *&lt;shouldEqual>*, to false otherwise. If value is `false` it will be reversed to *&lt;notEqualReverseValue>*.

- **multilingual**(&lt;path>, &lt;valueParser>, &lt;group>)

  Merges key with the same prefix and a language suffix into a single key as an object which has a key for each language. Can run *&lt;valueParser>* on each language value. If *&lt;group>* is set to true it will auto detect keys that have a language suffix and group them together correctly.


- **matchKey**(&lt;path>, &lt;key>): Key can be a string or a regular expression. If it is a string any property containing *&lt;key>* will
match.

- **matchPrefixStrip**(&lt;path>, &lt;key>, &lt;restoreCamelCase>)

  Take each key from the object at *&lt;path> that has *&lt;key> as a prefix. If *&lt;reestoreCamelCase>* is set to `true` upper-case the first character of the key before adding the *&lt;key>* during reverse operation.
