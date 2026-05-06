'use strict';

const NATIONWIDE_TOKENS = new Set(['', '전국', '00000', '003001']);

function isNationwide(region) {
  if (region === null || region === undefined) return true;
  return NATIONWIDE_TOKENS.has(String(region).trim());
}

function matchRegion(benefitRegion, userRegion) {
  const a = String(benefitRegion ?? '').trim();
  const b = String(userRegion ?? '').trim();
  if (a && b && a === b) return 3;
  if (isNationwide(benefitRegion)) return 1;
  return 0;
}

function matchJob(benefitJob, userJob) {
  const cond = String(benefitJob ?? '').trim();
  const job = String(userJob ?? '').trim();
  if (!cond || !job) return 0;
  const tokens = cond.split(/[,/|]/).map((t) => t.trim()).filter(Boolean);
  if (tokens.includes(job)) return 2;
  if (cond.includes(job)) return 2;
  return 0;
}

function toFiniteNumber(value) {
  if (value === null || value === undefined || value === '') return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function matchIncome(incomeCondition, userIncome) {
  const inc = toFiniteNumber(userIncome);
  if (inc === null) return 0;
  const cond = incomeCondition || {};
  const min = toFiniteNumber(cond.earnMinAmt);
  const max = toFiniteNumber(cond.earnMaxAmt);
  if (min === null && max === null) return 2;
  if (min !== null && inc < min) return 0;
  if (max !== null && inc > max) return 0;
  return 2;
}

function scoreBenefit(benefit, input) {
  let score = 0;
  score += matchRegion(benefit.region, input.region);
  score += matchJob(benefit.jobCondition, input.job);
  score += matchIncome(benefit.incomeCondition, input.income);
  return score;
}

function recommend(benefits, input) {
  return benefits
    .map((b) => ({ benefit: b, score: scoreBenefit(b, input) }))
    .filter((entry) => entry.score >= 1)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return String(a.benefit.name).localeCompare(String(b.benefit.name));
    })
    .map(({ benefit, score }) => ({
      id: benefit.id,
      name: benefit.name,
      region: benefit.region,
      summary: benefit.summary,
      applyUrl: benefit.applyUrl,
      score,
    }));
}

module.exports = {
  isNationwide,
  matchRegion,
  matchJob,
  matchIncome,
  scoreBenefit,
  recommend,
};
