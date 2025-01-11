const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

app.get('/fetch-site', async (req, res) => {
  try {
    const response = await axios.get('https://jobs.satvasolutions.com/jobs/Careers');
    res.send(response.data);  
  } catch (error) {
    res.status(500).send('Error fetching website');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
