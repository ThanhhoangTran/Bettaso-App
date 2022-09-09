const dotenv = require('dotenv');
const mongoose = require('mongoose');
//config environment variable from file config.env
dotenv.config({ path: './config.env' });

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('UNCAUGHT Exception! Shutting down...');
  process.exit(1);
});

const app = require('./main'); //create server
const port = process.env.PORT || 8000;

const DB = process.env.DATABASE.replace('<password>', process.env.DB_PASSWORD);
// mongoose.Connection.on('')
const connect = ()=>{
  mongoose
    .connect(DB, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    })
    .then((docs) => {
      console.log('DB connected');
    })
    .catch((err) => {
      console.log('DB error');
    });
}

mongoose.connection.on('disconnected', ()=>{
  console.log('mongoDB disconnected!');
})
mongoose.connection.on('connected', ()=>{
  console.log('mongoDB connected!');
})
const server = app.listen(port, () => {
  connect();
  console.log(`Connected to backend.`);
})
// , io = require('socket.io')(server);
// require('./controllers/chatController')(io);

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  server.close(() => {
    console.log('UNHANDLED REJECTION! Shutting down...');
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('SIGNTERM RECEIVED. SHUTTING DOWN GRACEFULLy');
  server.close(() => {
    console.log('*Process terminated!');
  });
});
