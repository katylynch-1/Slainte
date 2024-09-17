const express = require('express');
const axios = require('axios');  // Import axios for HTTP requests
const path = require('path');

const app = express();
const port = 3000;  // Define the port

const GOOGLE_API_KEY = 'AIzaSyB7PYP1oKkK-1qkgTus3x0C_uRbqPdfAa0';

// Serve static files
app.use(express.static(path.join(__dirname, '../Slainte/Slainte-App')));

// API route for fetching places
app.get('/api/places', async (req, res) => {
  try {
    const { location, radius, type } = req.query;
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&type=${type}&key=${GOOGLE_API_KEY}`;
    
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while fetching data from Google Places API.');
  }
});

// Catch-all route for serving the Angular app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
