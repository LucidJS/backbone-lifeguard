backbone-lifeguard
==================

Type Safety for your Backbone Models.

# Opening description

# Installation

# Usage


* **Strict typing** on model properties
* **Disallow undeclared properties** in constructor and set
* **Deep JSON** both ways (set internal models with a nested JSON and generate JSON from nested models)

## Strict typing

### Attribute declaration (replaces or suppliments 'defaults')

`structure` does not replace defaults, but runs in addition to it.

```javascript
structure: {
  propertyName: {
    type: 'string',
    value: 'defaultValue',
    validate: function() {
      //run validation check
    },
    transform: function() {
      //return changed value
    }
  },
  anotherPropertyName: {
    type: 'number',
    value: 3.1416,  // default value
    validate: function() {
      // run validation check
    },
    transform: function() {
      // return changed value
    }
  }
}
```

None of the `structure` fields are required.

```javascript
structure: {
  propertyName: {}
}
```

### Supported Types

* BackboneModel (reference)
* BackboneCollection (reference)
* SpecificClass (reference)
* 'string' || String ('foo')
* 'number' || Number (0, 1, 3.14159)
* 'integer' (-7, 1, 2, 42)
* 'array' || Array ([])
* 'object' || Object ({})
* 'boolean' || Boolean (true, false)
* 'regexp' || RegExp (/foo.*bar/g)
* 'date' || Date (date object)

All types accept **null** as their value.

## Automatic coersion

### Backbone models

.set() accepts either a BackboneModel of the correct type or an object literal that validates when creating an instance of that type.  Any set completely overrides prior value. 

### Backbone Collections

.set() accepts either a BackboneCollection of the correct type reference or an array containing object literals or backbone models.  Any set completely overrides prior value.  

### Date

.set() accepts either a string or a Date object in JSON date format ('2012-06-14T22:42:42.229Z') or a Date.toString() format ('Thu Jun 14 2012 15:50:31 GMT-0700 (PDT)'). If it's a string, we convert it into a Date object.

### RegExp

.set() accepts either a string of a regexp or a RegExp object. If it is a regexp string, we convert it into a RegExp object.

## Order of operations

set/constructor > model._validate():
 * attr.tranform()
 * attr.validate()
 * attr._typeCheck()

If both `validate` and `_typeCheck` pass, continue with normal execution (actually set the attr value).

### 'validate' parameter

Accepts a function, which returns either nothing or an error string/object, just like Backbone's `validate` method. If `validate` returns an error, `set` and `save` will not continue, and the model attributes will not be modified. Failed validations trigger an "error" event.

### 'tranform' parameter

Accepts a function.  Returns the converted value of the attr.
Used to convert passed-in value into the data type appropriate for this attribute, such as converting a string "123" into a number 123. If the value cannot be converted, the function will return 'undefined'.

### '_typeCheck'

This is an internal method to test validity of the attribute value after all other conversions and validations have been done.  Do not overwrite.

## Disallow undeclared properties

Only properties that are declared in `structure` or in the standard `defaults` will be allowed for set and constructor. Any other values will trigger an "error" event.

This only happens if `structure` is declared in the model.

Here are the possible scenarios for interaction between properties set in `structure` and `defaults`:

1. If a property is defined in `defaults` but **not** in `structure` or if `structure` entry for that property does not contain `value`, it will be automatically added to the `structure` hash.
2. If a property is defined in `structure`, but **not** in `defaults`, it will be automatically added to the `defaults` hash.
3. If a property is defined in both the `defaults` and `structure` with a `value` parameter set **and** the value is different between the two, an "error" event will get triggered during construction.

Examples:
```javascript
defaults: {
  title: 'FooBar'
}
// is the same as
structure: {
  title: {
    value: 'FooBar'
  }
}

// This will cause an "error" event to trigger during construction
// due to conflict in setting default value:
defaults: {
  title: 'FooBar'
},
structure: {
  title: {
    value: 'BarBaz'
  }
}
```

## Deep JSON

### Construct and set contained models using JSON

```javascript
var ChildModel = Backbone.Model.extend({
  structure: {
    childProperty: {
      type: 'string'
    }
  }
});

var Foo = Backbone.Model.extend({
  structure: {
    childModel: {
      type: ChildModel
    }
  }
});

var foo = new Foo({
  childModel: {
    childProperty: 'value'
  }
});
```

### toJSON options

```javascript
foo.toJSON({
  noDefaults: true,
  include: ['id', 'title']
});
```

#### 'noDefaults' parameter

If the `noDefaults` parameter is set to `true`, the output from `toJSON` will exclude any attributes whose values are the same as the default values of that model.

#### 'include' parameter

A whitelist array of attributes to include in the JSON output.

NOTE: Will add support for nesting in the future:

```javascript
foo.toJSON({
  include: ['id', 'title', 'attrModel.id']
});
```

## Notes

Add toJSON method to each attr that is of type regexp.

A useful pattern is to have the default value for a collection be an empty collection, that way when you do:

```javascript
modelInstance.get('collectionName').each(function() { ... })
```

you won't have to check to see if the collection is set or not.  Though you can still check length.

Model methods that will be overwritten:

* constructor (?)
* get (?)
* set
* _validate
* toJSON