module.exports.onConnection = redisClient => (socket) => {
  console.log('a user connected');

  socket.on('board:join', ({ boardId }) => {
    console.log('board:join', boardId);
    socket.join(boardId);
    socket.broadcast.to(boardId).emit('board:join', { boardId });
    redisClient.hgetallAsync(`boards:${boardId}`)
      .then((nodes) => {
        console.log(nodes);
        const args = Object.keys(nodes).map(id => JSON.parse(nodes[id]));
        socket.emit('board:update', args);
      });
  });

  socket.on('card:create', (args) => {
    const { id, boardId } = args;
    redisClient.hsetAsync(`boards:${boardId}`, id, JSON.stringify(args))
      .then(() => {
        socket.broadcast.to(args.boardId).emit('card:create', args);
      });
  });

  socket.on('card:dragmove', (args) => {
    const { id, boardId } = args;
    redisClient.hsetAsync(`boards:${boardId}`, id, JSON.stringify(args))
      .then(() => {
        socket.broadcast.to(args.boardId).emit('card:dragmove', args);
      });
  });

  socket.on('card:destroy', (args) => {
    const { id, boardId } = args;
    redisClient.hdelAsync(`boards:${boardId}`, id)
      .then(() => {
        socket.broadcast.to(args.boardId).emit('card:destroy', args);
      });
  });
};
