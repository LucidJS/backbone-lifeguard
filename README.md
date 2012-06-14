backbone-lifeguard
==================

Type Safety for your Backbone Models.

# Opening Description

# Installation

# Usage



* **Strict typing** on model properties
* **Disallow non-declared properties** in constructor and set
* **Deep JSON** both ways (set internal models with a nested JSON and generate JSON from nested models)

## Strict Typing

### Attribute Declaration (replaces or suppliments 'defaults')

attrs does not replace defaults, but runs in addition.

```
attrs: {
  propertyName: {
    type: 'string',
    default: 'defaultValue',
    valid: function(){
      //run validation check
    },
    transform: function(){
      //return changed value
    }
  },
  anotherPropertyName: {
    type: 'string',
    default: 'defaultValue',
    valid: function(){
      //run validation check
    },
    transform: function(){
      //return changed value
    }
  }
}
```

None of the attrs fields are required.

```
attrs: {
  propertyName: {}
}
```

### Supported Types

* BackboneModel (reference)
* BackboneCollection (reference)
* SpecificClass (reference)
* 'string' || String ('foo')
* 'number' || Number (0, 1, 1.2)
* 'integer' (0, 1, 2)
* 'array' || Array ([])
* 'object' || Object ({})
* 'boolean' || Boolean (true, false)
* 'regexp' || RegExp (regex ex: /x/)
* 'date' || Date (date object)

all types accept **null**

## Automatic Coersion

### Backbone Models

.set() accepts either a backbonemodel of the correct type or an object literal that validates when creating an instance of that type.  Any set completely overrides prior value. 

### Backbone Collections

.set() accepts either a backbonecollection of the correct type reference or an array containing object literals or backbone models.  Any set completely overrides prior value.  

### Date

.set() accepts either a string or a date object in JSON date format ('2012-06-14T22:42:42.229Z') or a date.toString() format ('Thu Jun 14 2012 15:50:31 GMT-0700 (PDT)'), if it a string, we converts it into a date object.

### RegExp

.set() accepts either a string of a regexp or a regexp object, if it is a regexp string, we convert it into a regexp object. 

## Order of operations

Set/Constructor > model.validate() > attr.tranform() > attr.valid() > attr.typeCheck() > actual set.

### 'valid' parameter

Accepts a function, returns either true or a string/object.  Anything other than true fires the error event.

### 'tranform' parameter

Accepts a function.  Returns the value of the attr.

## Disallow non-declared properties

Only properties that are declared in `attrs` or in the standard `defaults` will be allowed for set and construct, any other values will send an error to the error listener.

This only runs if `attrs` is declared in the model.

## Deep JSON

### Construct and set contained models using JSON

```
var ChildModel = Backbone.Model.extend({
  attrs : {
    childProperty : {
      type : 'string'
    }
  }
});

var Foo = Backbone.Model.extend({
  attrs : {
    childModel : {
      type : ChildModel
    }
  }
});

var foo = new Foo({
  childModel :{
    childProperty: 'value'
  }
});
```

### toJSON options

```
foo.toJSON({
  noDefaults: true,
  include: []
});
```

#### noDefaults

set to try to not include any of the values that are the same as their default

#### include

a whitelist array of `attrs` to include in the JSON output

```
foo.toJSON({
  noDefaults: true,
  include: ['id', 'title']
});
```

NOTE: Will add support for nesting in the future

```
foo.toJSON({
  noDefaults: true,
  include: ['id', 'title', 'attrModel.id']
});
```

## Notes

add toJSON method to each attr that is of type regex.

A useful pattern is to have the default value for a collection be an empty collection, that way when you do:

```
modelInstance.get('collectionName').each(function(){ ... })
```

you won't have to check to see if the collection is set or not.  Though you can still check length.  

Model methods to overwrite:

* constructor (?)
* get (?)
* set
* toJSON