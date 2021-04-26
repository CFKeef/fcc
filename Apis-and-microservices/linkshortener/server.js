require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Basic Configuration
const port = process.env.PORT || 3000;

const isValidURL = (string) => {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const linkSchema = new mongoose.Schema({
  original_url: String,
  short_url: String
})

const Link = mongoose.model('Link', linkSchema);

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', async (req, res) => {
  const { url } = req.body;
  const link = await Link.findOne({ original_url: url });
  
  if (!isValidURL(url)) res.json({
    error: 'invalid URL',
  });

  if (link) {
    res.json({ original_url: link.original_url, short_url: link.short_url })
  } else {
    const newLink = new Link({ original_url: url, short_url: parseInt(Math.floor(100000000 + Math.random() * 900000000)) });
    await newLink.save();

    res.json({ original_url: newLink.original_url, short_url: newLink.short_url })
  }
});

app.get('/api/shorturl/:url', async (req, res) => {
  const url = req.params.url;

  const link = await Link.findOne({ short_url: url });

  if (link) res.redirect(link.original_url);
  else {
    res.json({ "error": "No url found" })
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
