/* eslint-disable no-throw-literal */
const checkArray = input => Array.isArray(input);

/** Checks if the input exists */
const checkRequired = (input) => {
  if (checkArray(input)) return !!input.length;
  if (input === false) return true;
  return !!input;
};
const checkObject = (input: any) => typeof input === 'object' && input !== null && !checkArray(input);

/** Checks if the input is email */
const checkEmail = (input: any) => /^[\w._]+@[\w]+[-.]?[\w]+\.[\w]+$/.test(input);

/** Checks if the input is a number */
const checkNumber = (input: any) => `${input}`.search(/\D/) < 0;

/** Checks if the input is a number */
const checkString = (input: any) => typeof input === 'string';

/** Checks if the input is unique in DB */
const checkUnique = async (input: any, ruleItem: RuleItem) => {
  if (!ruleItem.unique) throw `${ruleItem.field} rules must include 'unique' fields specifying the unique model.`;
  if (typeof ruleItem.unique.exists !== 'function') throw `${ruleItem.field} rules unique model must implement exists function.`;
  return !(await ruleItem.unique.exists(input));
};

/** Checks if the input minlength with ruleItem */
const checkMinlen = (input: any, ruleItem: RuleItem) => {
  if (!Number.isInteger(ruleItem.minlen)) throw `${ruleItem.field} rules must include 'minlen' fields with integer value.`;
  return input.length >= ruleItem.minlen;
};

/** Checks if the input maxlength with ruleitem */
const checkMaxlen = (input: any, ruleItem: RuleItem) => {
  if (!Number.isInteger(ruleItem.maxlen)) throw `${ruleItem.field} rules must include 'maxlen' fields with integer value.`;
  return input.length <= ruleItem.maxlen;
};

/** Checks if the input belongs to a given array */
const checkBelongsto = (input: any, ruleItem: RuleItem) => {
  if (!checkArray(ruleItem.belongsto)) throw `${ruleItem.field} rules must include 'belongsto' fields with array of items.`;
  const values = ruleItem.belongsto.map(rec => (typeof rec === 'string' ? rec.toLowerCase() : rec));
  return values.includes(typeof input === 'string' ? input.toLowerCase() : input);
};

/** Checks if the each of (array or coma separated) input belongs to a given array */
const checkEachBelongsTo = (input: any, ruleItem: RuleItem) => {
  if (!checkArray(ruleItem.eachbelongsto)) throw `${ruleItem.field} rules must include 'eachbelongsto' fields with array of items.`;
  if (!checkArray(input)) input = `${input || ''}`.split(',').map(a => a.trim());
  const values = ruleItem.eachbelongsto.map(rec => (typeof rec === 'string' ? rec.toLowerCase() : rec));
  let isValid = true;
  for (const eItem of input) {
    isValid = values.includes(typeof eItem === 'string' ? eItem.toLowerCase() : eItem);
    if (!isValid) return isValid;
  }
  return isValid;
};

const Checkers = (data, ruleItem: RuleItem) => ({
  array: () => checkArray(data),
  belongsto: () => checkBelongsto(data, ruleItem),
  eachbelongsto: () => checkEachBelongsTo(data, ruleItem),
  email: () => checkEmail(data),
  maxlen: () => checkMaxlen(data, ruleItem),
  minlen: () => checkMinlen(data, ruleItem),
  number: () => checkNumber(data),
  string: () => checkString(data),
  object: () => checkObject(data),
  required: () => checkRequired(data),
  unique: () => checkUnique(data, ruleItem),
});

export {
  checkArray, checkBelongsto, checkEachBelongsTo, checkEmail, checkMaxlen, checkMinlen, checkNumber, checkString, checkObject, checkRequired, checkUnique,
};
export default Checkers;
