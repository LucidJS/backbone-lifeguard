// backbone-lifeguard.js (c) 2012 LucidJS and other contributors
// backbone-lifeguard may be freely distributed under the MIT license.
// For all details and documentation:
// http://lucidjs.github.com/backbone-lifeguard

(function(root) {

  var _ = root._ || require('underscore'),
      Backbone = root.Backbone || require('backbone'),

      // Save original methods to call them later, mostly as a 'super' equivalent.
      originalModel = Backbone.Model,
      originalExtend = originalModel.extend,
      originalModelProto = originalModel.prototype,
      originalSet = originalModelProto.set,
      originalValidate = originalModelProto._validate,
      originalIsValid = originalModelProto.isValid,
      originalToJSON = originalModelProto.toJSON,
      originalCollection = Backbone.Collection,
      
      // misc, shortcut
      toString = Object.prototype.toString;

  /**
  * Checks the validity of the provided value against the type.
  * Uses underscore's "isFooType"-style methods, such as "isString".
  * This is used for all "standard" JS types, since all of them have a method in underscore.
  * This function is invoked during validation and runs in the scope of a field definition.
  */
  function basicTypeCheck(value) {
    var t = this;
    return (value === null) || _['is' + t._type](value);
  }

  /**
  * Checks whether the provided value is null or an instance of a class.
  * This function is invoked during validation and runs in the scope of a field definition.
  */
  function classTypeCheck(value) {
    var t = this;
    return (value === null) || (value instanceof t.type);
  }

  /**
  * Turn an object into a specified class or model instance.
  * If a passed-in value is already an instance of that class,
  * just pass it right through. Otherwise attempt to create a new
  * instance of the class based on the value by calling the class
  * constructor with just the value parameter.
  * If the constructor of your class has a different signature, you will need
  * to create a custom transform method for it.
  * This function is invoked during validation and runs in the scope of a field definition.
  */
  function classTransform(value) {
    var klass = value,
        t = this;
    
    // Don't create a class instance from 'null'.
    if (value === null) {
      return null;
    }

    if (!(value instanceof t.type)) {
      klass = new t.type(value);
    }
    return klass;
  }

  var SUPPORTED_TYPES = {
        'string': {
          _type: 'String',
          _typeCheck: basicTypeCheck
        },
        'number': {
          _type: 'Number',
          _typeCheck: basicTypeCheck
        },
        'array': {
          _type: 'Array',
          _typeCheck: basicTypeCheck
        },
        'object': {
          _type: 'Object',
          _typeCheck: basicTypeCheck
        },
        'boolean': {
          _type: 'Boolean',
          _typeCheck: basicTypeCheck
        },
        'regexp': {
          _type: 'RegExp',
          /**
          * Turn a string into a RegExp object. If the 'value' parameter is a string,
          * it must be in '/pattern/flags' format. We parse that string and create
          * a regexp with 'pattern' and 'flags' as parameters to it.
          * Adds a 'toJSON' method to the returned RegExp object.
          */
          transform: function(value) {
            var re = value,
                parser = /^\/(.*)\/([gimy]*)$/,
                parts;

            if (_.isString(value)) {
              parts = parser.exec(value);
              if (parts) {
                re = new RegExp(parts[1], parts[2]);
              }
            }
            
            // TODO: add a toJSON to this instance
            return re;
          },
          _typeCheck: basicTypeCheck
        },
        'date': {
          _type: 'Date',
          /**
          * Turn a string into a Date object.
          */
          transform: function(value) {
            var date = value;

            if (_.isString(value)) {
              date = new Date(value);

              // If the conversion failed, revert to 'undefined' value.
              if (isNaN(date.valueOf())) {
                date = void 0;
              }
            }

            return date;
          },
          _typeCheck: basicTypeCheck
        },
        
        'integer': {
          _type: 'Number'
          // TODO: fill in the rest: transform, validate (?), _typeCheck
        },
    
        'class': {
          _type: 'class',
          transform: classTransform,
          _typeCheck: classTypeCheck
        },

        // Backbone Model
        'model': {
          _type: 'model',
          transform: classTransform,
          _typeCheck: classTypeCheck
        },
        
        // Backbone Collection
        'collection': {
          _type: 'collection',
          transform: classTransform,
          _typeCheck: classTypeCheck
        }
      },

      RESERVED_TYPES = ['class', 'model', 'collection'];
  
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
          // For each attribute defined in 'fields' do:
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
          
          // All checks passed, so put the (possibly transformed) value back in the attributes array.
          attrs[name] = value;
          
        } else {
          errors.push('Error: Undeclared attribute "' + name + '".');
        }
      });
      
      // Exit if there were errors during transformations/validations.
      if (!_.isEmpty(errors)) {
        if (options && options.error) {
          options.error(t, errors, options);
        } else {
          t.trigger('error', t, errors, options);
        }
        return false;
      }
      
      return originalValidate.call(t, attrs, options);
    },
    
    /**
    *
    */
    toJSON: function(options) {
      var t = this;
      return originalToJSON.call(t, options);
    }
  };
  
  // Extend Backbone.Model.
  originalModel.extend = function(protoProps, classProps) {
    // protoProps will now include 'fields'
    var defaults = (protoProps && protoProps.defaults) || {},
        fields = protoProps && protoProps.fields;

    // Don't do anything special if 'fields' was not defined, since it'll be considered a "normal model".
    if (fields && _.isObject(fields)) {
      // Adjust the protoProps to merge 'fields' and 'defaults'.

      // Iterate over 'fields' and add those back into defaults, if not found.
      _.each(fields, function(definition, name) {
        var originalType,
            internalType,
            typedef;

        // Early exit if a field definition is not an object.
        if (!_.isObject(definition)) {
          throw new Error('Backbone-Lifeguard cannot be initialized: "fields" must contain only objects.');
        }

        // The property is not in defaults, so create an entry for it.
        if (_.has(definition, 'defaultValue') && !_.has(defaults, name)) {
          defaults[name] = definition.defaultValue;
        }

        // Find a supported type based on supplied 'type' property.
        // Apply appropriate default handlers for the data type.
        if (_.has(definition, 'type')) {
          originalType = definition.type;

          if (_.isString(originalType)) {
            internalType = originalType.toLowerCase();
            // Safeguard users from using '_model', '_collection', and '_class' types explicitly
            if (_.contains(RESERVED_TYPES, internalType)) {
              throw new Error('Backbone-lifeguard cannot be initialized: reserved type for attribute "' + name + '".');
            }
          } else if (_.isFunction(originalType)) {
            // 'toString' returns a string in format "[object Foo]", where "Foo" is one of the basic JS types, like "Array" or "Number".
            // We take that and convert it into just string "foo".
            internalType = toString.call(originalType.prototype).slice(8, -1).toLowerCase();
          } else {
            // We only support a string or a class reference for data types.
            throw new Error('Backbone-lifeguard cannot be initialized: unrecognizable type for attribute "' + name + '".');
          }

          // Type "function" can mean either a "class", a Backbone Model, or a Backbone Collection
          if (internalType === 'function') {
            if (originalType.prototype instanceof originalModel) {
              internalType = '_model';
            } else if (originalType.prototype instanceof originalCollection) {
              internalType = '_collection';
            } else {
              internalType = '_class';
            }
          }
          
          // Fill in any missing transformers, validations, _typeChecks.
          typedef = SUPPORTED_TYPES[internalType];
          if (typedef) {
            _.defaults(definition, typedef);
          } else {
            throw new Error('Backbone-lifeguard cannot be initialized: unsupported data type for attribute "' + name + '".');
          }
        }
      });

      // Iterate over 'defaults' and merge those into 'fields'.
      _.each(defaults, function(value, key) {
        var t = this;

        if (!_.has(fields, key)) {
          // This attribute is not defined in 'fields', so create an entry for it.
          fields[key] = {
            defaultValue: value
          };
        } else if (fields[key].defaultValue !== value) {
          // error: a property's default value is different between 'defaults' and 'fields'
          // TODO: figure out the proper error signature and handling here.
          t.trigger('error', t, key);
          return null;
        }
      });

      // Put defaults and fields back in props hash.
      protoProps.defaults = defaults;
      protoProps.fields = fields;

      // Inject lifeguard methods.
      _.extend(originalModelProto, BackboneLifeguard);
    }
    
    return originalExtend.call(originalModel, protoProps, classProps);
  };
  
}(this));