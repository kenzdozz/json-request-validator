## Introduction
This is a simple validator to validate you `req.body` in your express application.

## Example
```
const express = require('express');
const ValidateInputs = require('json-request-validator');

const app = express();

const rules = {
    firstName: 'required',
    lastName: 'required|string',
    age: 'required|number',
    hobbies: 'required|array',
    email: 'required|email',
    password: {
        rules: 'required|minlen',
        minlen: 5,
    },
};

app.post('/signup', ValidateInputs(rules), (req, res) => {

});

app.listen(3033);

```

The above rules defines the following constraints:

firstName and lastName are required.
age is required and must be a number.
hobbies is required and must be an array.
email is required and must be a valid email address.
password is required and must contain at least 5 characters.

## Usage
Usage is a straight process. First, a set of rules is constructed using the provided constraints:

```
const rules = {
    name: 'required',
    age: 'required|number',
}
```

This rule is passed into the Validator as a middleware to the route.

```
app.post('/signup', ValidateInputs(rules), (req, res) => {

});
```

If the input is valid, then the next function will be called, otherwise the request is ended as follows (fields depends on the errors):
```
{
    status: 400,
    error: 'Validation errors.',
    fields: {
        name: 'Name is required',
        age: 'Age must be a number',
    },
}
```

To manually handle the errors, a second function is passed to `ValidateInputs` as follows
```
app.post('/signup', ValidateInputs(rules, false), (req, res) => {
    const { validator } = req;
    if (!validator.isValid) {
        console.log(validator.errors);
    }
});
```

### Rules
 - `required` - field must be present, Default message `{fieldName} is required.`.
 - `array` - field must contain array of items, Default message `{fieldName} must be an array.`.
 - `number` - field must be numeric, Default message `{fieldName} must be a number.`.
 - `string` - field must be a string, Default message `{fieldName} must be a string.`.
 - `email` - field must be a valid email, Default message `{fieldName} must be a valid email address.`.
 - `object` - field must be an object, Default message `{fieldName} must be an object.`.
 - `arrayobject` - field must be an array of object, Default message `{fieldName} must be an array of objects.`.
 - `min` - specify minimum length of field, Default message `{fieldName} must have minimum length of {value}`.
 - `max` - specify maximum length of field, Default message `{fieldName} must have maximum length of {value}`.
 - `belongsto` - specify an array a field must be contained in, Default message `{fieldName} must be one of {arrayValue}`.
 - `eachbelongsto` - specify an array each item in an field must be contained in, Default message `Each of {fieldName} must be one of {arrayValue}`.

Rules that doesn't specify values can be used directly on the field name in the rules object, eg:
```
const rules = {
    email: 'required|email',
    age: 'number',
}
```
These rules includes: `required, number, email, array, object, arrayobject`.

Rules that specify values cannot be used directly on rules field names but as follows:
```
const rules = {
    gender: {
        rules: 'required|belongsto',
        belongsto: ['male', 'female'],
    }
    age: {
        rules: 'number|min|max',
        min: 13,
        max: 48,
    },
}
```
These rules includes: `min, max, belongsto, eachbelongsto`.

The rules `object` and `arrayobject` can specify an optional value which validates the fields of the object, eg:
```
const rules = {
    location: {
        rules: 'object|required',
        object: {
            lat: 'required|number',
            lng: 'required|number',
        },
    },
    experiences: {
        rules: 'required|arrayobject',
        arrayobject: {
            company: 'required',
            years: 'required|number',
        },
    },
};
```
All the validation rules are valid for validating the object fields.
