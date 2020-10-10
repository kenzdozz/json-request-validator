/* eslint-disable func-names */
/* eslint-disable no-throw-literal */
/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */

import Checkers, {
  checkArray, checkObject, checkRequired, checkUnique,
} from './Checkers';

// eslint-disable-next-line no-extend-native
String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

/**
 * Generates error message
 * @param {String} rule
 * @param {Object} item
 * @returns {String}
 */
const getErrorMessage = (rule: Rule, item: RuleItem) => {
  if (item.messages && item.messages[rule]) return item.messages[rule];
  let message = '';
  const field = item.field.capitalize().replace(/_/g, ' ');

  if (rule === 'required') message = `${field} is required.`;
  else if (rule === 'string') message = `${field} must be a string.`;
  else if (rule === 'unique') message = `${field} already exists.`;
  else if (rule === 'image') message = `${field} must be an image.`;
  else if (rule === 'array') message = `${field} must be an array.`;
  else if (rule === 'number') message = `${field} must be a number.`;
  else if (rule === 'object') message = `${field} must be an object.`;
  else if (rule === 'email') message = `${field} must be a valid email address.`;
  else if (rule === 'arrayobject') message = `${field} must be an array of objects.`;
  else if (rule === 'minlen') message = `${field} must have minimum length of ${item.minlen}.`;
  else if (rule === 'maxlen') message = `${field} must have maximum length of ${item.maxlen}.`;
  else if (rule === 'belongsto') message = `${field} must be one of '${item.belongsto.join(', ')}'.`;
  else if (rule === 'eachbelongsto') message = `Each of ${field} must be one of '${item.eachbelongsto.join(', ')}'.`;

  return message;
};

const formatRules = (validationRules: ValidationRules) => {
  let ruleItems: Array<RuleItem> = [];
  if (checkObject(validationRules)) {
    for (const key in validationRules) {
      const ruleItemVal = validationRules[key];
      let ruleItem = <RuleItem>{ field: key };
      if (typeof ruleItemVal === 'string') ruleItem.rules = ruleItemVal;
      else {
        if (!checkObject(ruleItemVal)) throw `Rule ${key} must be an object or a string.`;
        ruleItem = { ...ruleItem, ...ruleItemVal };
      }
      ruleItems.push(ruleItem);
    }
  } else if (!checkArray(ruleItems)) throw 'ruleItems must be an array or an object';
  else ruleItems = <Array<RuleItem>>validationRules;
  return ruleItems;
};

/**
 *
 * @param {Object} body
 * @param {Array} ruleItems
 */
const validator = async (body, validationRules: ValidationRules, arrOuterField = '', arrIndex = null): Promise<ValidationResponse> => {
  if (!checkObject(body)) throw 'body must be an object';
  if (!checkRequired(validationRules)) throw 'validationRules must be provided';

  const ruleItems = formatRules(validationRules);
  let errors = {};
  let hasConflict = false;
  let isValid = true;

  /**
   *
   * @param {Array} inputs
   * @param {RuleItem} ruleItem
   * @returns {Boolean}
   */
  const checkArrayObject = async (inputs: any, ruleItem: RuleItem): Promise<boolean> => {
    if (!checkArray(inputs)) return false;
    if (!checkObject(ruleItem.arrayobject)) throw `${ruleItem.field} arrayobject must be an object`;

    // eslint-disable-next-line no-use-before-define
    for (const index in inputs) {
      const inputBody = inputs[index];
      if (!checkObject(inputBody)) return false;
      const outerField = arrIndex !== null ? `${arrOuterField}.${arrIndex}.${ruleItem.field}` : ruleItem.field;
      const validate = await validator(inputBody, ruleItem.arrayobject, outerField, index);
      if (!validate.isValid) {
        errors = { ...errors, ...validate.errors };
        hasConflict = validate.hasConflict || hasConflict;
      }
    }
    return true;
  };

  /**
   *
   * @param {Object} data
   * @param {Object} ruleItem
   * @param {String} outerField
   * @param {Number} index
   */
  const ruleItemValidator = async (data, ruleItem: RuleItem, outerField = ''): Promise<void> => {
    if (!ruleItem.field || !ruleItem.rules) throw 'Validation Rules must contain "rules and field" properties.';

    let rules = <Array<Rule>>(`${ruleItem.rules}`.toLowerCase()).split('|').filter(item => item);
    if (rules.includes('required') && rules[0] !== 'required') {
      rules = rules.filter(item => item !== 'required');
      rules.unshift('required');
    }

    for (const rule of rules) {
      if (errors[ruleItem.field]) continue;
      let ruleIsValid = true;
      let bodyParam = data[ruleItem.field] ? data[ruleItem.field] : '';
      if (typeof bodyParam === 'string') bodyParam = bodyParam.trim();

      if (rule === 'required') ruleIsValid = checkRequired(bodyParam);
      if (bodyParam) {
        if (rule === 'unique') ruleIsValid = await checkUnique(bodyParam, ruleItem);
        else if (rule === 'arrayobject') {
          ruleIsValid = await checkArrayObject(bodyParam, ruleItem);
        } else if (rule === 'object') {
          if (ruleItem.object && !checkObject(ruleItem.object)) throw `${ruleItem.field} 'object' field value must be an object.`;
          ruleIsValid = checkObject(bodyParam);
          if (ruleIsValid && ruleItem.object) {
            outerField += `${ruleItem.field}.`;
            const objectRules = formatRules(<ValidationRules>ruleItem.object);
            for (const oRule of objectRules) await ruleItemValidator(bodyParam, oRule, outerField);
          }
        } else {
          const checker = Checkers(bodyParam, ruleItem);
          if (!Object.keys(checker).includes(rule)) throw `${rule} does not exist.`;
          ruleIsValid = checker[rule]();
        }
      }

      if (!ruleIsValid) {
        isValid = false;
        if (rule === 'unique') hasConflict = true;
        const preField = arrIndex !== null ? `${arrOuterField}.${arrIndex}.` : '';
        const field = outerField ? `${outerField}${ruleItem.field}` : ruleItem.field;
        errors[preField + field] = getErrorMessage(rule, ruleItem);
      }
    }
  };

  for (const ruleItem of ruleItems) await ruleItemValidator(body, ruleItem);

  return { isValid, hasConflict, errors };
};

/**
 * Validates Request with given rules
 * @param {Array} validationRules
 * @param {Boolean} [endRequest=true]
 */
const validateInputs = (validationRules: ValidationRules, endRequest = true) => async (req, res, next) => {
  const validate = await validator(req.body, validationRules);
  const { errors, hasConflict } = validate;

  if (Object.keys(errors).length) {
    const statusCode = hasConflict ? 409 : 400;
    if (endRequest) {
      return res.status(statusCode).send({
        status: statusCode,
        error: 'Validation errors.',
        fields: errors,
      });
    }
    req.validator = { isValid: false, statusCode, errors };
  }

  return next();
};

export = validateInputs;
