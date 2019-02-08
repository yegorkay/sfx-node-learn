const express = require('express');
const server = express();
const data = require('./data');

server.set('port', process.env.PORT || 3000);

//Basic routes
server.get('/', (request, response) => {
  response.sendFile(__dirname + '/index.html');
});

server.get('/about', (request, response) => {
  response.send('About page');
});

server.get('/data', (request, response) => {
  response.json(data);
})

//Express error handling middleware
server.use((request, response) => {
  response.type('text/plain');
  response.status(505);
  response.send('Error page');
});

//Binding to a port
server.listen(3000, () => {
  console.log('Express server started at port 3000');
});