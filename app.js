var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var uuid = require('node-uuid');
var routes = require('./routes/index');
var users = require('./routes/users');
var client = require('./routes/client');
var broadcaster = require('./routes/broadcaster');

var app = express();
var socket_io = require('socket.io');

var io           = socket_io();
app.io           = io;

var peers = [];

//io.on('connection', function (socket) {
//  socket.emit('news', { hello: 'world' });
//  socket.on('my other event', function (data) {
//    console.log(data);
//  });
//});

//server.listen(80);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

console.log("yolo");


app.use(function(req, res, next) {
  req.RTC_CLIENTS = peers;
  next();
});


app.use('/', routes);
app.use('/client', client);
app.use('/broadcaster', broadcaster);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});




// keeping track of connections
var sockets = {};

io.sockets.on('connection', function(socket) {
  var id;

  // determine an identifier that is unique for us.

  do {
    id = uuid.v4();
    //id = "100";
  } while (sockets[id]);

  // we have a unique identifier that can be sent to the client

  sockets[id] = socket;
  socket.emit('your-id', id);

  // remove references to the disconnected socket
  socket.on('disconnect', function() {
    sockets[socket] = undefined;
    delete sockets[socket];
  });

  // when a message is received forward it to the addressee
  socket.on('message', function(message) {
    if (sockets[message.to]) {
      sockets[message.to].emit('message', message);
    } else {
      socket.emit('disconnected', message.from);
    }
  });

  // when a listener logs on let the media streaming know about it
  socket.on('logon', function(message) {
    if (sockets[message.to]) {
      sockets[message.to].emit('logon', message);
    } else {
      socket.emit('error', 'Does not exsist at server.');
    }
  });

  socket.on('logoff', function(message) {
    if (sockets[message.to]) {
      sockets[message.to].emit('logoff', message);
    } else {
      socket.emit('error', 'Does not exsist at server.');
    }
  });

});

module.exports = app;
