backbone-lifeguard
==================

Type Safety for your Backbone Models.

* **Strict typing** on model properties
* **Disallow non-declared properties** in constructor and set
* **Deep JSON** both ways (set internal models with a nested JSON and generate JSON from nested models)
* **Construct nested model** based on an id through constructor and set

## Strict Typing

### Attribute Declaration (replaces or suppliments 'defaults')

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

None of the fields are required.  If you want your default value to be set to null and don't want to set any of the other params, you can simple set the value to `{}`.

```
attrs: {
  propertyName: {}
  }
}
```

### Supported Types

* BackboneModel (reference)
* BackboneCollection (reference)
* 'string' ('foo')
* 'number' (0, 1, 1.2)
* 'integer' (0, 1, 2)
* 'array' ([])
* 'object' ({})
* 'bool' (true, false)
* 'regex' (regex ex: /x/)
* 'date' (date object)

all types accept **null**

### Order of operations

Set/Constructor > model.validate() > attr.tranform() > attr.valid() > attr.typeCheck() > actual set.

### 'valid' parameter

Accepts a function, returns either true or a string/object.  Anything other than true fires the error event.

### 'tranform' parameter

Accepts a function.  Returns the value of the attr.

## Disallow non-declared properties

Only properties that are declared in `attrs` or in the standard `defaults` will be allowed for set and construct, any other values will send an error to the error listener.

## Deep JSON

### Construct and set contained models using JSON and generate output JSON from contained models

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

foo.toJSON():

/*
output:

{
  childModel : {
    childProperty: 'value'
  }
}
*/
```

### Set options to only show id of nested model and not output it all to JSON

```
var foo = new Model();
foo.toJSON({
  nestToID: ['modelName', 'otherModelName.subModel'] //don't really like 'nestToID', but it is descriptive enough for now 
});
```

## Notes

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