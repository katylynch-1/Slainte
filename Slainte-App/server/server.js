const express = require('express');
const axios = require('axios');  // Import axios for HTTP requests
const path = require('path');


const app = express();
const port = 3000;  // Define the port

const GOOGLE_API_KEY = 'AIzaSyB7PYP1oKkK-1qkgTus3x0C_uRbqPdfAa0';

// Serve static files
app.use(express.static(path.join(__dirname, '../Slainte/Slainte-App/src/')));

// Serve index.html on the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../Slainte/Slainte-App/src/index.html'));
});

// Catch-all route to handle all other paths (for Angular client-side routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../Slainte/Slainte-App/src/index.html'));
});

// API route for fetching places
app.get('/api/places', async (req, res) => {
  try {
    const { location, radius, type } = req.query;

    // Construct Google Places API URL directly
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&type=bar&key=${GOOGLE_API_KEY}`;

    // Make the API call to Google Places
    const { data } = await axios.get(url);
    
    // Send the response back to the client
    res.json(data);

  } catch (error) {
    console.error('Error fetching data from Google Places API:', error.message);

    // Send generic error message for unexpected issues
    res.status(500).send('An error occurred while fetching data from Google Places API.');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
