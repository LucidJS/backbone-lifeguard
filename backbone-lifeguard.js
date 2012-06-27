(function(root) {

  var _ = root._ || require('underscore'),
      Backbone = root.Backbone || require('backbone'),

      // save old methods to call them later
      oldModel = Backbone.Model,
      oldExtend = oldModel.extend,
      oldModelProto = oldModel.prototype,
      oldSet = oldModelProto.set,
      oldValidate = oldModelProto._validate,
      oldIsValid = oldModelProto.isValid,
      oldToJSON = oldModelProto.toJSON,
      oldCollection = Backbone.Collection,
      
      // misc
      toString = Object.prototype.toString;

  /**
  * Checks the validity of the provided value against the type.
  * Uses underscore's "isFooType"-style methods, such as "isString".
  * This is used for all "standard" types, since all of them have a method in underscore.
  */
  function basicTypeCheck(value) {
    var t = this;
    return _.isNull(value) || _['is' + t.type](value);
  }

  /**
  * Accepts either null or an instance of specified class or model.
  */
  function classTypeCheck(value) {
    var t = this;
    return _.isNull(value) || (value instanceof t.type);
  }

  /**
  * Coerse an object into a specified class or model instance.
  * If a passed-in value is already an instance of that class,
  * just pass it right through, otherwise attempt to create a new
  * instance of the class based on the values by calling the class
  * constructor with just the value parameter.
  * If the constructor of your class has a different signature, you will need
  * to create a custom transform method for it.
  */
  function classTransform(value) {
    var klass = value,
        t = this;
    
    if (!(value instanceof t.type)) {
      klass = new t.type(value);
    }
    return klass;
  }

  var SUPPORTED_TYPES = {
        'string': {
          type: 'String',
          _typeCheck: basicTypeCheck
        },
        'number': {
          type: 'Number',
          _typeCheck: basicTypeCheck
        },
        'array': {
          type: 'Array',
          _typeCheck: basicTypeCheck
        },
        'object': {
          type: 'Object',
          _typeCheck: basicTypeCheck
        },
        'boolean': {
          type: 'Boolean',
          _typeCheck: basicTypeCheck
        },
        'regexp': {
          type: 'RegExp',
          /**
          * Coerse a string into a regexp object
          */
          transform: function(value) {
            var re = value;
            if (_.isString(value)) {
              re = new RegExp(value);
              // no need for further testing here since most strings will convert to RegExp one way or another
            }
            return re;
          },
          _typeCheck: basicTypeCheck
        },
        'date': {
          type: 'Date',
          /**
          * Coerse a string into a date object
          */
          transform: function(value) {
            var date = value;
            if (_.isString(value)) {
              date = new Date(value);  // try converting it
              if (isNaN(date.valueOf())) {  // if the conversion failed, revert to 'undefined' value
                date = void 0;
              }
            }
            return date;
          },
          _typeCheck: basicTypeCheck
        },
        
        'integer': {  // (?)
          type: 'Number'
        },
    
        '_class': {
          transform: classTransform,
          _typeCheck: classTypeCheck
        },
        '_model': {  // BB Model
          transform: classTransform,
          _typeCheck: classTypeCheck
        },
        '_collection': {  // BB Collection
          transform: classTransform,
          _typeCheck: classTypeCheck
        }
      },
      CLASS_TYPES = ['_class', '_model', '_collection'];
  
  var BackboneLifeguard = {
    /**
    *
    */
    _validate: function(attrs, options) {
      var t = this,
          fields = t.fields,
          errors = [],
          error;

      _.each(attrs, function(attrValue, name) {
        var field = fields[name],
            value = attrValue;

        if (field) {
          // for each attribute defined in 'fields' do
          // * transform
          if (_.isFunction(field.transform)) {
            value = field.transform(value);
          }
          // * validate
          if (_.isFunction(field.validate)) {
            error = field.validate(value);
            if (error) {
              errors.push(error);
              return;
            }
          }
          // * _typeCheck
          if (_.isFunction(field._typeCheck)) {
            error = !field._typeCheck(value);
            if (error) {
              errors.push('Error: Failed type check for attribute "' + name + '".');
              return;
            }
          }
          
          // all checks passed, so put the (possibly transformed) value back in the attributes array
          attrs[name] = value;
          
        } else {
          errors.push('Error: Undeclared attribute "' + name + '".');
        }
      });
      
      // exit if there were errors during transformations/validations
      if (!_.isEmpty(errors)) {
        if (options && options.error) {
          options.error(t, errors, options);
        } else {
          t.trigger('error', t, errors, options);
        }
        return false;
      }
      
      return oldValidate.call(t, attrs, options);
    },
    
    /**
    *
    */
    toJSON: function(options) {
      var t = this;
      return oldToJSON.call(t, options);
    }
  };
  
  // extend BB.Model
  oldModel.extend = function(protoProps, classProps) {
    // protoProps will now include 'fields'
    var broken = false,
        defaults = protoProps && protoProps.defaults || {},
        fields = protoProps && protoProps.fields;

    if (fields && _.isObject(fields)) {  // don't do anything special if 'fields' was not defined, since it'll be considered a "normal model"
      // adjust the protoProps to merge 'fields' and 'defaults'
      // iterate over 'fields' and add those back into defaults, if not found
      _.each(fields, function(definition, name) {
        var type,
            typedef;  // supported type definition from the list (default methods, etc)

        if (!broken) {
          if (!_.isObject(definition)) {
            // early exit if fields' definition is not an object
            console.warn('Backbone-Lifeguard cannot be initialized: "fields" must contain only objects.');
            broken = true;
            return;
          }
          if (_.has(definition, 'value') && !_.has(defaults, name)) {
            // the property is not in defaults, so create an entry for it
            defaults[name] = definition.value;
          }

          // Normalize 'type' property based on the list of supported types.
          // Apply appropriate default handlers for the data type.
          if (_.has(definition, 'type')) {
            type = definition.type;

            if (_.isString(type)) {
              type = type.toLowerCase();
              if (_.contains(CLASS_TYPES, type)) {
                // Safeguard users from using '_model', '_collection', and '_class' types explicitly
                console.warn('Backbone-lifeguard cannot be initialized: reserved type for attribute "' + name + '".');
                broken = true;
                return;
              }
            } else {
              // toString returns a string in format "[object Foo]". We take that and convert it into just "foo".
              type = toString.call(type).slice(8, -1).toLowerCase();
            }

            // type "function" can mean either a "class", a Backbone Model, or a Backbone Collection
            if (type === 'function') {
              if (definition.type.prototype instanceof oldModel) {
                type = '_model';
              } else if (definition.type.prototype instanceof oldCollection) {
                type = '_collection';
              } else {
                type = '_class';
              }
            }
            
            typedef = SUPPORTED_TYPES[type];
            if (typedef) {
              // fill in any missing transformers, validations, _typeChecks
              _.defaults(definition, typedef);
            } else {
              // TODO: error on unsupported data types
              console.warn('Backbone-lifeguard cannot be initialized: unsupported data type for attribute "' + name + '".');
              broken = true;
              return;
            }
          }
        }
      });

      if (!broken) {
        // iterate over defaults and merge those into fields
        _.each(defaults, function(value, key) {
          var t = this;

          if (!_.has(fields, key)) {
            // the property is not in fields, so create an entry for it
            fields[key] = {
              value: value
            };
          } else if (fields[key].value !== value) {
            // error: a property's default value is different between 'defaults' and 'fields'
            t.trigger('error', t, key);
            return null;
          }
        });

        // put defaults and fields back in props hash
        protoProps.defaults = defaults;
        protoProps.fields = fields;

        // inject lifeguard methods
        _.extend(oldModelProto, BackboneLifeguard);
      }
    }
    
    return oldExtend.call(oldModel, protoProps, classProps);
  };
  
}(this));