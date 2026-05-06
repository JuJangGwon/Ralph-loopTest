const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const express = require('express');
const cors = require('cors');

const { loadBenefits, getBenefits } = require('./benefits');
const { recommend } = require('./score');

const app = express();
const PORT = parseInt(process.env.PORT, 10) || 3001;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/api/benefits/count', (req, res) => {
  res.status(200).json({ count: getBenefits().length });
});

app.post('/api/recommend', (req, res) => {
  const body = req.body || {};
  const { name, region, job, income } = body;
  const missing = [];
  if (!name) missing.push('name');
  if (!region) missing.push('region');
  if (!job) missing.push('job');
  if (income === undefined || income === null || income === '') missing.push('income');
  if (missing.length) {
    return res.status(400).json({ error: `missing required fields: ${missing.join(', ')}` });
  }
  const recommendations = recommend(getBenefits(), { name, region, job, income });
  return res.status(200).json({ recommendations });
});

if (require.main === module) {
  loadBenefits().finally(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  });
}

module.exports = app;
