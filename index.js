const express = require('express');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

app.use(express.json());
app.use(express.static('public'));

// Endpoint 1: Fetch a single random dog image from external API
app.get('/api/dog-image/:breed', async (req, res) => {
  const breed = req.params.breed;
  try {
    const response = await fetch(`https://dog.ceo/api/breed/${breed}/images/random`);
    const data = await response.json();
    
    if (data.status === 'success') {
      res.json({ imageUrl: data.message });
    } else {
      res.status(404).json({ error: 'Breed not found' });
    }
  } catch (err) {
    console.error('External API routing error:', err);
    res.status(500).json({ error: 'Failed to fetch dog image' });
  }
});

// Endpoint 2: Grab all bookmarked favorites from database
app.get('/api/favorites', async (req, res) => {
  const { data, error } = await supabase
    .from('favorites')
    .select('*');

  if (error) {
    console.error('Supabase fetch error:', error);
    return res.status(500).json({ error: error.message });
  } 
  
  res.status(200).json(data);
});

// Endpoint 3: Insert a new dog image into favorites table
app.post('/api/favorites', async (req, res) => {
  const { breed_name, image_url } = req.body;

  const { data, error } = await supabase
    .from('favorites')
    .insert({ breed_name, image_url });

  if (error) {
    console.error('Supabase write error:', error);
    return res.status(500).json({ error: error.message });
  } 
  
  res.status(200).json({ message: 'Success', data: data });
});

// Endpoint 4: Fetch entire breed index list for dropdown selection
app.get('/api/breeds-list', async (req, res) => {
  try {
    const response = await fetch('https://dog.ceo/api/breeds/list/all');
    const data = await response.json();
    
    if (data.status === 'success') {
      // Just extract the object keys to form the primary breed names array
      const breedNames = Object.keys(data.message);
      res.json(breedNames);
    } else {
      res.status(500).json({ error: 'Failed to fetch breeds list' });
    }
  } catch (err) {
    console.error('Failed to retrieve breed master list:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running smoothly on http://localhost:${PORT}`);
});