backbone-lifeguard
==================

Type Safety for your Backbone Models.

* **Strict typing** on model properties
* **Disallow non-declared properties** in constructor and set
* **Deep JSON** both ways (set internal models with a nested JSON and generate JSON from nested models)
* **Construct nested model** based on an id through constructor and set

```
model : {
  keys: 'propertyName',
  type: 'string'
  default: 'defaultValue'
}
```

## Strict Typing

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





