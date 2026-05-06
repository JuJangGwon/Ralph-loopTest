'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const {
  isNationwide,
  matchRegion,
  matchJob,
  matchIncome,
  scoreBenefit,
  recommend,
} = require('../score');

function makeBenefit(overrides = {}) {
  return {
    id: '1',
    name: 'Sample',
    region: '서울',
    jobCondition: '대학생',
    incomeCondition: { earnMinAmt: null, earnMaxAmt: null, earnCndSeCd: null, raw: null },
    summary: 'summary',
    applyUrl: 'https://example.com',
    ...overrides,
  };
}

test('isNationwide treats empty/00000/전국 as nationwide', () => {
  assert.equal(isNationwide(''), true);
  assert.equal(isNationwide(null), true);
  assert.equal(isNationwide(undefined), true);
  assert.equal(isNationwide('전국'), true);
  assert.equal(isNationwide('00000'), true);
  assert.equal(isNationwide('서울'), false);
});

test('matchRegion exact match returns 3', () => {
  assert.equal(matchRegion('서울', '서울'), 3);
});

test('matchRegion nationwide benefit returns 1 even when user picks region', () => {
  assert.equal(matchRegion('', '서울'), 1);
  assert.equal(matchRegion('전국', '부산'), 1);
});

test('matchRegion non-match returns 0', () => {
  assert.equal(matchRegion('부산', '서울'), 0);
});

test('matchJob exact token match returns 2', () => {
  assert.equal(matchJob('대학생', '대학생'), 2);
});

test('matchJob comma-separated tokens match returns 2', () => {
  assert.equal(matchJob('대학생,취업준비생', '취업준비생'), 2);
});

test('matchJob no match returns 0', () => {
  assert.equal(matchJob('재직자', '대학생'), 0);
  assert.equal(matchJob('', '대학생'), 0);
  assert.equal(matchJob('대학생', ''), 0);
});

test('matchIncome no constraint returns 2', () => {
  assert.equal(matchIncome({ earnMinAmt: null, earnMaxAmt: null }, 3000), 2);
  assert.equal(matchIncome({}, 3000), 2);
  assert.equal(matchIncome(null, 3000), 2);
});

test('matchIncome within range returns 2', () => {
  assert.equal(matchIncome({ earnMinAmt: 1000, earnMaxAmt: 5000 }, 3000), 2);
  assert.equal(matchIncome({ earnMinAmt: 1000, earnMaxAmt: 5000 }, 1000), 2);
  assert.equal(matchIncome({ earnMinAmt: 1000, earnMaxAmt: 5000 }, 5000), 2);
});

test('matchIncome out of range returns 0', () => {
  assert.equal(matchIncome({ earnMinAmt: 1000, earnMaxAmt: 5000 }, 500), 0);
  assert.equal(matchIncome({ earnMinAmt: 1000, earnMaxAmt: 5000 }, 6000), 0);
});

test('matchIncome only-max constraint', () => {
  assert.equal(matchIncome({ earnMinAmt: null, earnMaxAmt: 5000 }, 3000), 2);
  assert.equal(matchIncome({ earnMinAmt: null, earnMaxAmt: 5000 }, 6000), 0);
});

test('scoreBenefit aggregates region/job/income', () => {
  const benefit = makeBenefit({
    region: '서울',
    jobCondition: '대학생',
    incomeCondition: { earnMinAmt: 0, earnMaxAmt: 5000 },
  });
  const input = { name: 'A', region: '서울', job: '대학생', income: 3000 };
  assert.equal(scoreBenefit(benefit, input), 3 + 2 + 2);
});

test('scoreBenefit nationwide + job match + income ok = 5', () => {
  const benefit = makeBenefit({
    region: '',
    jobCondition: '대학생',
    incomeCondition: { earnMinAmt: 0, earnMaxAmt: 5000 },
  });
  const input = { name: 'A', region: '서울', job: '대학생', income: 3000 };
  assert.equal(scoreBenefit(benefit, input), 1 + 2 + 2);
});

test('recommend filters out score<1 and sorts desc with name tiebreak', () => {
  const benefits = [
    makeBenefit({ id: '1', name: 'B-policy', region: '서울', jobCondition: '대학생' }),
    makeBenefit({ id: '2', name: 'A-policy', region: '서울', jobCondition: '대학생' }),
    makeBenefit({
      id: '3',
      name: 'C-policy',
      region: '부산',
      jobCondition: '재직자',
      incomeCondition: { earnMinAmt: 0, earnMaxAmt: 500 },
    }),
    makeBenefit({ id: '4', name: 'D-nation', region: '전국', jobCondition: '재직자' }),
  ];
  const input = { name: 'X', region: '서울', job: '대학생', income: 3000 };
  const result = recommend(benefits, input);
  assert.equal(result.length, 3);
  assert.equal(result[0].id, '2');
  assert.equal(result[0].score, 7);
  assert.equal(result[1].id, '1');
  assert.equal(result[1].score, 7);
  assert.equal(result[2].id, '4');
  assert.equal(result[2].score, 3);
  assert.ok(!result.find((r) => r.id === '3'));
});

test('recommend response shape contains required fields only', () => {
  const benefits = [makeBenefit({ id: '1', name: 'X', region: '서울', jobCondition: '대학생' })];
  const input = { name: 'X', region: '서울', job: '대학생', income: 3000 };
  const [first] = recommend(benefits, input);
  assert.deepEqual(Object.keys(first).sort(), [
    'applyUrl', 'id', 'name', 'region', 'score', 'summary',
  ].sort());
});
