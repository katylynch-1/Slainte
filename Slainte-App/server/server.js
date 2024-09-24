const express = require('express');
<<<<<<< Updated upstream
const axios = require('axios');  // Import axios for HTTP requests
const path = require('path');

=======
const axios = require('axios')
const app = express();
const port = 3000;
const cors = require('cors');
const path = require('path');

const GOOGLE_API_KEY = 'AIzaSyB7PYP1oKkK-1qkgTus3x0C_uRbqPdfAa0';

// const corsOptions = {
//     origin:'http://localhost:3000', 
//     credentials:true,            
//     optionSuccessStatus:200
// };
>>>>>>> Stashed changes

const app = express();
const port = 3000;  // Define the port

const GOOGLE_API_KEY = 'AIzaSyB7PYP1oKkK-1qkgTus3x0C_uRbqPdfAa0';

// Serve static files
app.use(express.static(path.join(__dirname, '../Slainte/Slainte-App/src/')));

<<<<<<< Updated upstream
// Serve index.html on the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../Slainte/Slainte-App/src/index.html'));
=======
app.use(cors({
    origin: 'http://localhost:8100' // Allow requests only from this origin
}));

// app.use((req, res, next) => {
// res.header('Access-Control-Allow-Origin', 'http://localhost:8100/');
// next();
// });

app.get('/api/place', async (req, res) => { // Use "places" when looking for multiple locations and "place" for singular search?
    const { lat, lng, radius } = req.query; 

    try {
        const response = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?`, { // `https://maps.googleapis.com/maps/api/place/details/json?place_id` (The Details API that requires the place_id parameter is specifically for retrieving details about a certain place)
            params: {
                location: `${lat},${lng}`,
                radius: radius || 1000,
                type: 'bar',
                key: GOOGLE_API_KEY
            },
        });
        res.json(response.data.results); 
    } catch (error) {
        res.status(500).send('Server Error');
    }
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
=======

// https://maps.googleapis.com/maps/api/place/nearbysearch/json?&location=53.3442,-6.2674&radius=1000&type=bar&key=AIzaSyB7PYP1oKkK-1qkgTus3x0C_uRbqPdfAa0
// 24/09 this url definitely works in the browser and returns JSON Data

// http://localhost:3000/api/place?lat=53.3442&lng=-6.2674&radius=1000 
// This works in postman
>>>>>>> Stashed changes
