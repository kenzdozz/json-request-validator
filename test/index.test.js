/* eslint-disable no-undef */
import { expect } from 'chai';
import validateInputs2 from '../index';

const request = async (rules, body = {}) => {
  const req = {
    body,
  };
  const res = {
    status: () => res,
    send: data => data,
  };
  const next = () => ({ status: 200 });
  const validate = await validateInputs2(rules)(req, res, next);
  return validate;
};
const User = { items: ['kenzdozz', 'kenzie'], exists: item => User.items.includes(item) };

const rules = {
  firstName: 'required',
  lastName: {
    rules: 'required|maxlen',
    maxlen: 6,
  },
  username: {
    rules: 'required|unique',
    unique: User,
  },
  age: 'required|number',
  hobbies: 'required|array',
  email: 'required|email',
  password: {
    rules: 'required|minlen',
    minlen: 5,
  },
  gender: {
    rules: 'belongsto|required',
    belongsto: ['Male', 'Female'],
  },
  skills: {
    rules: 'required|array|eachbelongsto',
    eachbelongsto: ['Javascript', 'PHP', 'CSS', 'HTML'],
  },
  skillLevels: 'required|object',
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

describe('Test index', () => {
  it('Should validate failing rules, all rules covered', async () => {
    const body = {
      lastName: 'qwertyuiop',
      username: 'kenzdozz',
      age: 'Ten',
      hobbies: 'Swimming',
      email: 'Kenny',
      password: 't54r',
      gender: 'Malet',
      skills: ['PHP', 'Nodejs'],
      skillLevels: 5,
      location: { lat: '', lng: '5t' },
      experiences: [
        { company: 'ITEX', years: 'one' },
        { company: '', years: 3 },
      ],
    };

    const res = await request(rules, body);

    expect(res.error).to.deep.eql('Validation errors.');
    expect(res.fields.firstName).to.deep.eql('FirstName is required.');
    expect(res.fields.lastName).to.deep.eql('LastName must have maximum length of 6.');
    expect(res.fields.username).to.deep.eql('Username already exists.');
    expect(res.fields.age).to.deep.eql('Age must be a number.');
    expect(res.fields.hobbies).to.deep.eql('Hobbies must be an array.');
    expect(res.fields.email).to.deep.eql('Email must be a valid email address.');
    expect(res.fields.password).to.deep.eql('Password must have minimum length of 5.');
    expect(res.fields.gender).to.deep.eql("Gender must be one of 'Male, Female'.");
    expect(res.fields.skills).to.deep.eql("Each of Skills must be one of 'Javascript, PHP, CSS, HTML'.");
    expect(res.fields.skillLevels).to.deep.eql('SkillLevels must be an object.');
    expect(res.fields['location.lat']).to.deep.eql('Lat is required.');
    expect(res.fields['location.lng']).to.deep.eql('Lng must be a number.');
    expect(res.fields['experiences.0.years']).to.deep.eql('Years must be a number.');
    expect(res.fields['experiences.1.company']).to.deep.eql('Company is required.');
  });

  it('Should validate passing rules, all rules covered', async () => {
    const body = {
      firstName: 'Kenneth',
      lastName: 'Onah',
      username: 'KenzDozz',
      age: 90,
      hobbies: ['Swimming', 'Video Games'],
      email: 'KenzDozz@gmail.com',
      password: 't54r4rjf',
      gender: 'Male',
      skills: ['PHP', 'Javascript'],
      skillLevels: { PHP: 5, Javascript: 4 },
      location: { lat: 4454, lng: 9823 },
      experiences: [
        { company: 'ITEX', years: 1 },
        { company: 'Gigasec', years: 2 },
      ],
    };

    const res = await request(rules, body);

    expect(res.status).to.deep.eql(200);
  });
});
