const express = require('express');
const app = express();
require('dotenv').config();
const dbConfig = require('./config/dbConfig');
const port = process.env.PORT || 5000;
app.use(express.json());

const usersRoute = require('./routes/usersRoute');
const baglogsRoute = require('./routes/baglogsRoute');
const bookingsRoute = require('./routes/bookingsRoute');

app.use('/api/users', usersRoute);
app.use('/api/baglogs', baglogsRoute);
app.use('/api/bookings', bookingsRoute);
const path = require('path');
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client/build/index.html'));
  });
}

app.listen(port, () => console.log(`Node server listening on port ${port}!`));
