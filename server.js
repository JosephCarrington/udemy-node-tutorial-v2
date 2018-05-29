const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

let app = express();
let maintenanceMode = false;

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

// Log stuff
app.use((req, res, next) => {
  let now = new Date().toString();
  let log = `${now}: ${req.method} ${req.url}`;
  fs.appendFile('server.log', log + '\n', (err) => {
    if(err) {
      console.log('Unable to append to server.log');
    }
  })
  next();
});

// Maintenance mode
app.use((req, res, next) => {
  if(maintenanceMode) {
    res.render('maintenance.hbs');
  }
  else next();
});

app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});

// Default route
app.get('/', (req, res) => {
  res.render('home.hbs', {
    pageTitle: 'Horsecock',
    welcomeMessage: 'Welcome to the machine',
  })
});

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'About Page',
  });
});

app.get('/bad', (req, res) => {
  res.send({errorMessage: 'You fucked up bad this time'});
})

app.listen(3000, () => {
  console.log('Server is up on port 3000');
});
