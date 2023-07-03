require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.urlencoded({ extended: false }));

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/shorturl', function(req, res) {
  res.json('Not found');
});

// create a database to store the URLs
let urlDatabase = {
  1: 'https://www.freecodecamp.org'
};

// redirect to the original URL
app.get('/api/shorturl/:short_url', function(req, res) {
  let shortUrl = req.params.short_url;
  let url = urlDatabase[shortUrl];
  if (url) {
    res.redirect(url);
  } else {
    res.json({ error: 'No short URL found for the given input' });
  }
});

// use a body parsing middleware to handle the POST requests
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.post('/api/shorturl', function(req, res) {
  let originalUrl = req.body.url;
  // check if the url is valid
  if (!originalUrl.match(/(http|https):\/\/.+/)) {
    return res.json({ error: 'invalid url' });
  }
  let shortUrl = generateShortUrl();
  urlDatabase[shortUrl] = originalUrl;
  res.json({ original_url: originalUrl, short_url: shortUrl });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

// Helper function to generate a dynamic short URL
function generateShortUrl() {
  return Object.keys(urlDatabase).length + 1;
}

/*

Object.keys(urlDatabase) retrieves an array of all the keys (short URLs) in the urlDatabase object.
Object.keys(urlDatabase).length returns the number of keys (short URLs) currently stored in the urlDatabase.
"+ 1" adds 1 to the length of the urlDatabase. This ensures that the generated short URL is unique and not overlapping with any existing short URLs.
The generated value is then returned as the dynamic short URL for the new URL.

For example, if the urlDatabase currently has 3 entries,
the function will return 4 as the next available short URL. 
This ensures that each new URL added through the POST request will have a unique and sequential short URL.

*/