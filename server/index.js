const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const express = require('express');
const cors = require('cors');

const { loadBenefits, getBenefits } = require('./benefits');

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

if (require.main === module) {
  loadBenefits().finally(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  });
}

module.exports = app;
