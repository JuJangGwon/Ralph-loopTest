'use strict';

const axios = require('axios');

const DEFAULT_API_URL = 'https://www.youthcenter.go.kr/go/ythip/getPlcy';
const PAGE_SIZE = 100;
const MAX_PAGES = 50;
const REQUEST_TIMEOUT_MS = 15000;

let BENEFITS = [];

function pickFirst(...values) {
  for (const v of values) {
    if (v !== undefined && v !== null && v !== '') return v;
  }
  return '';
}

function normalize(item) {
  return {
    id: String(pickFirst(item.plcyNo, item.bizId, item.policyId, item.id)),
    name: pickFirst(item.plcyNm, item.polyBizSjnm, item.name),
    region: pickFirst(item.zipCd, item.rgtrInstCdNm, item.sprvsnInstCdNm, item.region),
    jobCondition: pickFirst(item.jobCd, item.jobCdNm, item.empmSttsCd, item.jobCondition),
    incomeCondition: {
      earnMinAmt: item.earnMinAmt ?? null,
      earnMaxAmt: item.earnMaxAmt ?? null,
      earnCndSeCd: item.earnCndSeCd ?? null,
      raw: item.earnCndSeCdNm ?? item.incomeCondition ?? null,
    },
    summary: pickFirst(item.plcyExplnCn, item.polyItcnCn, item.summary),
    applyUrl: pickFirst(item.aplyUrlAddr, item.rfcSiteUrla1, item.applyUrl),
  };
}

async function fetchPage(pageNum, apiKey, apiUrl) {
  const params = {
    apiKeyNm: apiKey,
    pageNum,
    pageSize: PAGE_SIZE,
    rtnType: 'json',
  };
  const { data } = await axios.get(apiUrl, { params, timeout: REQUEST_TIMEOUT_MS });
  const result = data && data.result ? data.result : {};
  const list = result.youthPolicyList || result.policyList || [];
  const pagging = result.pagging || result.paging || {};
  const totCount = Number(pagging.totCount ?? pagging.totalCount ?? list.length) || list.length;
  return { list, totCount };
}

async function loadBenefits() {
  const apiKey = process.env.YOUTH_API_KEY;
  const apiUrl = process.env.YOUTH_API_URL || DEFAULT_API_URL;

  if (!apiKey) {
    console.warn('[benefits] YOUTH_API_KEY is not set; using empty benefits list');
    BENEFITS = [];
    return BENEFITS;
  }

  try {
    const aggregate = [];
    const first = await fetchPage(1, apiKey, apiUrl);
    aggregate.push(...first.list);

    const totalPages = Math.min(
      MAX_PAGES,
      Math.max(1, Math.ceil((first.totCount || aggregate.length) / PAGE_SIZE))
    );

    for (let pageNum = 2; pageNum <= totalPages; pageNum += 1) {
      const next = await fetchPage(pageNum, apiKey, apiUrl);
      if (!next.list.length) break;
      aggregate.push(...next.list);
    }

    BENEFITS = aggregate.map(normalize);
    console.log(`[benefits] loaded ${BENEFITS.length} benefits across ${totalPages} page(s)`);
  } catch (err) {
    console.error('[benefits] failed to load benefits:', err.message);
    BENEFITS = [];
  }

  return BENEFITS;
}

function getBenefits() {
  return BENEFITS;
}

function _setBenefitsForTest(list) {
  BENEFITS = Array.isArray(list) ? list : [];
}

module.exports = { loadBenefits, getBenefits, normalize, _setBenefitsForTest };
