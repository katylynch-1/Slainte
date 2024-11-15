/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
const functions = require("firebase-functions");
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

const GOOGLE_API_KEY = 'AIzaSyB7PYP1oKkK-1qkgTus3x0C_uRbqPdfAa0';

// Define routes
app.get('/api/places', async (req, res) => {
  const { lat, lng, radius, type = 'bar,night_club' } = req.query;

  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
      params: { location: `${lat},${lng}`, radius, type, keyword: 'pub', key: GOOGLE_API_KEY },
    });
    res.json(response.data.results);
  } catch (error) {
    console.error('Error fetching from Google Places API:', error);
    res.status(500).send('Server error');
  }
});

// Place details endpoint
app.get('/api/place/details', async (req, res) => {
  const { place_id } = req.query;
  if (!place_id) return res.status(400).send('place_id is required');

  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
      params: { place_id, key: GOOGLE_API_KEY, fields: 'name,formatted_address,formatted_phone_number,rating,price_level,current_opening_hours,photos' },
    });
    const venueDetails = response.data.result;
    if (venueDetails.photos) {
      venueDetails.photos = venueDetails.photos.map(photo => ({
        photoUrl: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${GOOGLE_API_KEY}`
      }));
    }
    res.json(venueDetails);
  } catch (error) {
    console.error('Error fetching place details:', error);
    res.status(500).send('Server error');
  }
});

// Geocoding endpoint
app.get('/api/geocode', async (req, res) => {
  const address = req.query.address;
  try {
    const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_API_KEY}`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching geocode:', error);
    res.status(500).send('Error fetching geocode');
  }
});

// Export as a Firebase Function
exports.api = functions.https.onRequest(app);

