require('dotenv').config();
require('./config/mongo');
require('./config/multer');
const express = require('express');
const cors = require('cors');
const { createServer } = require('http');

const notFound = require('./middleware/notFound');
const projectRouter = require('./controllers/projectController');
const requirementRouter = require('./controllers/requirementController');
const epicRouter = require('./controllers/epicController');
const commentRouter = require('./controllers/commentController');
const audioRouter = require('./controllers/audioController');
const roomRouter = require('./controllers/roomController');
const transcriptionRouter = require('./controllers/transcriptionController');
const userRouter = require('./controllers/userController');
const teamRouter = require('./controllers/teamController');
const signupRouter = require('./controllers/signupController');
const loginRouter = require('./controllers/loginController');


const app = express();
const httpServer = createServer(app);
const io = require('./socket').init(httpServer);

io.on('connection', (socket) => {
    console.log('Socket connected');
    // socket.on('joinRoom',({userId,room}) =>{
    //     socket.join(room);
    //     //Welcome user
    //     socket.broadcast.to(room).emit('message', `${userId} has joined`);
    // });
});

const {
    PORT,
    FRONTEND_DOMAIN_URL
} = process.env;

// Middleware
const corsOptions = {
    origin: FRONTEND_DOMAIN_URL,
    exposedHeaders: 'Authorization',
    credentials: true,
};

app.use(cors(corsOptions));

// For POST and PUT requests
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Router Middleware
app.get('/', (req, res) => {
    res.send('Welcome to the API');

});
app.use('/uploads', express.static('uploads'));
app.use('/api/projects', projectRouter);
app.use('/api/requirements', requirementRouter);
app.use('/api/epics', epicRouter);
app.use('/api/comments', commentRouter);
app.use('/api/audios', audioRouter);
app.use('/api/rooms', roomRouter);
app.use('/api/transcribe', transcriptionRouter);
app.use('/api/users', userRouter);
app.use('/api/signup', signupRouter);
app.use('/api/login', loginRouter);
app.use('/api/team', teamRouter);


// ErrorHandler
app.use(notFound);

httpServer.listen(PORT, () => console.log('Server listening on PORT ', PORT));
// app.listen(PORT, () => {
//     console.log('Server running on port: %d', PORT);
// });

module.exports = {
    app,
};
