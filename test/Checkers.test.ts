/* eslint-disable no-undef */
import { expect } from 'chai';
import {
  checkArray, checkBelongsto, checkEachBelongsTo, checkEmail, checkMaxlen, checkMinlen, checkNumber, checkString, checkObject, checkRequired, checkUnique,
} from '../src/Checkers';

describe('Test Checkers', () => {
  it('Should successfully check for array', () => {
    expect(checkArray('')).to.deep.equal(false);
    expect(checkArray([])).to.deep.equal(true);
    expect(checkArray(99)).to.deep.equal(false);
    expect(checkArray([2, '', null])).to.deep.equal(true);
  });

  it('Should successfully check if item belongs to an array', () => {
    expect(checkBelongsto(99, <RuleItem>{ belongsto: [99] })).to.deep.equal(true);
    expect(checkBelongsto('40', <RuleItem>{ belongsto: [99] })).to.deep.equal(false);
    expect(checkBelongsto('hello', <RuleItem>{ belongsto: [99, 'hello'] })).to.deep.equal(true);
    expect(checkBelongsto(true, <RuleItem>{ belongsto: ['true', 'hi'] })).to.deep.equal(false);
  });

  it('Should successfully check if all items in array belongs to another array', () => {
    expect(checkEachBelongsTo([99], <RuleItem>{ eachbelongsto: [99] })).to.deep.equal(true);
    expect(checkEachBelongsTo([99, 'oo'], <RuleItem>{ eachbelongsto: [99, '00'] })).to.deep.equal(false);
    expect(checkEachBelongsTo(['99', 'oo'], <RuleItem>{ eachbelongsto: ['99', 'oo', '90'] })).to.deep.equal(true);
    expect(checkEachBelongsTo([99, 'oo', 'hello'], <RuleItem>{ eachbelongsto: [99, 'oo'] })).to.deep.equal(false);
  });

  it('Should successfully check if item is a valid email address', () => {
    expect(checkEmail('Ken@gma.co')).to.deep.equal(true);
    expect(checkEmail('Kengma.co')).to.deep.equal(false);
    expect(checkEmail('Keng@@ma.co')).to.deep.equal(false);
    expect(checkEmail('Keng@ma..co')).to.deep.equal(false);
  });

  it('Should successfully check if item length is not more than specified', () => {
    expect(checkMaxlen('qwerty', <RuleItem>{ maxlen: 6 })).to.deep.equal(true);
    expect(checkMaxlen('qwerty', <RuleItem>{ maxlen: 5 })).to.deep.equal(false);
    expect(checkMaxlen('qwerty', <RuleItem>{ maxlen: 4 })).to.deep.equal(false);
    expect(checkMaxlen('qwerty', <RuleItem>{ maxlen: 7 })).to.deep.equal(true);
  });

  it('Should successfully check if item length is not less than specified', () => {
    expect(checkMinlen('qwerty', <RuleItem>{ minlen: 4 })).to.deep.equal(true);
    expect(checkMinlen('qwerty', <RuleItem>{ minlen: 5 })).to.deep.equal(true);
    expect(checkMinlen('qwerty', <RuleItem>{ minlen: 8 })).to.deep.equal(false);
    expect(checkMinlen('qwerty', <RuleItem>{ minlen: 7 })).to.deep.equal(false);
  });

  it('Should successfully check if item is a number', () => {
    expect(checkNumber(66)).to.deep.equal(true);
    expect(checkNumber('66')).to.deep.equal(true);
    expect(checkNumber('66a')).to.deep.equal(false);
    expect(checkNumber('ppp')).to.deep.equal(false);
  });

  it('Should successfully check if item is a number', () => {
    expect(checkString(66)).to.deep.equal(false);
    expect(checkString('66')).to.deep.equal(true);
    expect(checkString({ foo: 'bar' })).to.deep.equal(false);
    expect(checkString('ppp')).to.deep.equal(true);
  });

  it('Should successfully check if item is an object', () => {
    expect(checkObject({})).to.deep.equal(true);
    expect(checkObject('oio')).to.deep.equal(false);
    expect(checkObject(999)).to.deep.equal(false);
    expect(checkObject(null)).to.deep.equal(false);
    expect(checkObject([])).to.deep.equal(false);
  });

  it('Should successfully check if item is provided', () => {
    expect(checkRequired('yes')).to.deep.equal(true);
    expect(checkRequired(true)).to.deep.equal(true);
    expect(checkRequired(false)).to.deep.equal(true);
    expect(checkRequired('')).to.deep.equal(false);
    expect(checkRequired(undefined)).to.deep.equal(false);
    expect(checkRequired(null)).to.deep.equal(false);
  });

  it('Should successfully check if item is provided', async () => {
    const User = { items: [1, 2, 3, 4], exists: item => User.items.includes(item) };

    expect(await checkUnique('yes', <RuleItem>{ rules: null, unique: User })).to.deep.equal(true);
    expect(await checkUnique('1', <RuleItem>{ rules: null, unique: User })).to.deep.equal(true);
    expect(await checkUnique(1, <RuleItem>{ rules: null, unique: User })).to.deep.equal(false);
  });
});
