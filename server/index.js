// basic Express server
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('PSB Payroll Backend - Open-Source Node.js/Express');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
