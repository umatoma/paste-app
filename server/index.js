const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const socketIO = require('socket.io');

module.exports.createServer = (http) => {
  const app = express();
  const server = http.Server(app);
  const io = socketIO(server);

  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'ejs');

  app.use(morgan('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));

  app.get('*', (req, res) => {
    res.render('index');
  });

  // catch 404 and forward to error handler
  app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // error handler
  app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });

  // WebSocket
  io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('board:join', ({ boardId }) => {
      console.log('board:join', boardId);
      socket.join(boardId);
      socket.broadcast.to(boardId).emit('board:join', { boardId });
    });
    socket.on('card:create', (args) => {
      socket.broadcast.to(args.boardId).emit('card:create', args);
    });
    socket.on('card:dragmove', (args) => {
      socket.broadcast.to(args.boardId).emit('card:dragmove', args);
    });
    socket.on('card:destroy', (args) => {
      socket.broadcast.to(args.boardId).emit('card:destroy', args);
    });
  });

  return server;
};
