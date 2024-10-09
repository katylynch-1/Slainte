const express = require('express');
const axios = require('axios');
const cors = require('cors'); // CORS middleware
const app = express();
const port = 3000;

const GOOGLE_API_KEY = 'AIzaSyB7PYP1oKkK-1qkgTus3x0C_uRbqPdfAa0';

// Enable CORS for all routes
app.use(cors());

app.get('/api/places', async (req, res) => {
    const { lat, lng, radius, type = 'bar,night_club' } = req.query;

    try {
        const response = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', { // https://maps.googleapis.com/maps/api/place/details/json?place_id&fields=
            params: {
                location: `${lat},${lng}`,
                radius: radius,
                type: type,
                keyword: 'pub',                   
                key: GOOGLE_API_KEY,
            },
        });
        res.json(response.data.results);
    } catch (error) {
        console.error('Error fetching from Google Places API:', error.response?.data || error.message);
        res.status(500).send('server error');
    }
});

// New endpoint for place details using place_id
app.get('/api/place/details', async (req, res) => { 
    const { place_id } = req.query;

    if (!place_id) {
        return res.status(400).send('place_id is required');
    }

    try {
        const response = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
            params: {
                place_id: place_id,
                key: GOOGLE_API_KEY,
                fields: 'formatted_address,formatted_phone_number,rating,price_level,current_opening_hours' // Specify all required fields
            },
        });
        res.json(response.data.result);
    } catch (error) {
        console.error('Error fetching place details from Google Places API:', error.response?.data || error.message);
        res.status(500).send('server error');
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});

// http://localhost:3000/api/place?lat=53.3442&lng=-6.2674&radius=1000 - works on Postman
// https://maps.googleapis.com/maps/api/place/nearbysearch/json?&location=53.3567,-6.2682&radius=1000&type=bar,night_club&keyword=pub&key=AIzaSyB7PYP1oKkK-1qkgTus3x0C_uRbqPdfAa0
// This ^ works in browser and returns JSON data displaying a list of pubs/bars only no hotels


