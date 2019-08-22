/* eslint-disable no-undef */
import { expect } from 'chai';
import {
  checkArray, checkBelongsto, checkEachBelongsTo, checkEmail, checkMaxlen, checkMinlen, checkNumber, checkObject, checkRequired, checkUnique,
} from '../Checkers';

describe('Test Checkers', () => {
  it('Should successfully check for array', () => {
    expect(checkArray('')).to.deep.eql(false);
    expect(checkArray([])).to.deep.eql(true);
    expect(checkArray(99)).to.deep.eql(false);
    expect(checkArray([2, '', null])).to.deep.eql(true);
  });

  it('Should successfully check if item belongs to an array', () => {
    expect(checkBelongsto(99, { belongsto: [99] })).to.deep.eql(true);
    expect(checkBelongsto('40', { belongsto: [99] })).to.deep.eql(false);
    expect(checkBelongsto('hello', { belongsto: [99, 'hello'] })).to.deep.eql(true);
    expect(checkBelongsto(true, { belongsto: ['true', 'hi'] })).to.deep.eql(false);
  });

  it('Should successfully check if all items in array belongs to another array', () => {
    expect(checkEachBelongsTo([99], { eachbelongsto: [99] })).to.deep.eql(true);
    expect(checkEachBelongsTo([99, 'oo'], { eachbelongsto: [99, '00'] })).to.deep.eql(false);
    expect(checkEachBelongsTo(['99', 'oo'], { eachbelongsto: ['99', 'oo', '90'] })).to.deep.eql(true);
    expect(checkEachBelongsTo([99, 'oo', 'hello'], { eachbelongsto: [99, 'oo'] })).to.deep.eql(false);
  });

  it('Should successfully check if item is a valid email address', () => {
    expect(checkEmail('Ken@gma.co')).to.deep.eql(true);
    expect(checkEmail('Kengma.co')).to.deep.eql(false);
    expect(checkEmail('Keng@@ma.co')).to.deep.eql(false);
    expect(checkEmail('Keng@ma..co')).to.deep.eql(false);
  });

  it('Should successfully check if item length is not more than specified', () => {
    expect(checkMaxlen('qwerty', { maxlen: 4 })).to.deep.eql(false);
    expect(checkMaxlen('qwerty', { maxlen: 5 })).to.deep.eql(false);
    expect(checkMaxlen('qwerty', { maxlen: 6 })).to.deep.eql(true);
    expect(checkMaxlen('qwerty', { maxlen: 7 })).to.deep.eql(true);
  });

  it('Should successfully check if item length is not less than specified', () => {
    expect(checkMinlen('qwerty', { minlen: 4 })).to.deep.eql(true);
    expect(checkMinlen('qwerty', { minlen: 5 })).to.deep.eql(true);
    expect(checkMinlen('qwerty', { minlen: 8 })).to.deep.eql(false);
    expect(checkMinlen('qwerty', { minlen: 7 })).to.deep.eql(false);
  });

  it('Should successfully check if item is a number', () => {
    expect(checkNumber(66)).to.deep.eql(true);
    expect(checkNumber('66')).to.deep.eql(true);
    expect(checkNumber('66a')).to.deep.eql(false);
    expect(checkNumber('ppp')).to.deep.eql(false);
  });

  it('Should successfully check if item is an object', () => {
    expect(checkObject({})).to.deep.eql(true);
    expect(checkObject('oio')).to.deep.eql(false);
    expect(checkObject(999)).to.deep.eql(false);
    expect(checkObject(null)).to.deep.eql(false);
    expect(checkObject([])).to.deep.eql(false);
  });

  it('Should successfully check if item is provided', () => {
    expect(checkRequired('yes')).to.deep.eql(true);
    expect(checkRequired(true)).to.deep.eql(true);
    expect(checkRequired(false)).to.deep.eql(true);
    expect(checkRequired('')).to.deep.eql(false);
    expect(checkRequired(undefined)).to.deep.eql(false);
    expect(checkRequired(null)).to.deep.eql(false);
  });

  it('Should successfully check if item is provided', async () => {
    const User = { items: [1, 2, 3, 4], exists: item => User.items.includes(item) };

    expect(await checkUnique('yes', { unique: User })).to.deep.eql(true);
    expect(await checkUnique('1', { unique: User })).to.deep.eql(true);
    expect(await checkUnique(1, { unique: User })).to.deep.eql(false);
  });
});
