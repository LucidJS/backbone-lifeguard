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
      //run validation or coersion code before type check
    }
  },
  anotherPropertyName: {
    type: 'string',
    default: 'defaultValue',
    valid: function(){
      //run validation or coersion code before type check
    }
  }
}
```

### Supported Types

* backboneModel/Collection (ModelName, CollectionName)
* string ('foo')
* number (0, 1, 1.2)
* integer (0, 1, 2)
* array ([])
* object ({})
* bool (true, false)
* regex (regex ex: /x/)
* date (date object)

all types accept **null**

### 'valid' parameter

Valid can be either an array of allowed values or a function.  The 'valid' check will run before the check against type, so it can be used for coersion as well as validation.

## Disallow non-declared properties

## Deep JSON

### Ensure that we can .get() sub modules all the way

```
var foo = new Model({
  subModel: {
    subModelAttr: 'value' 
  }
});

foo.get('subModel').get('subModelAttr'); //returns 'value'
```

## Construct nested model

### Set options to only show id of nested model and not output it all to JSON

```
var foo = new Model();
foo.toJSON({
  nestToID: ['modelName', 'otherModelName.subModel'] //don't really like 'nestToID', but it is descriptive enough for now 
});
```

## Notes

Model methods to overwrite:

* constructor (?)
* get (?)
* set
* toJSON





