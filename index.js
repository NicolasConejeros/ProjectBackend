require('dotenv').config();
require('./config/mongo');
require('./config/multer');
const express = require('express');
const cors = require('cors');
const app = express();
const notFound = require('./middleware/notFound');

const projectRouter = require('./controllers/projectController');
const requirementRouter = require('./controllers/requirementController');
const epicRouter = require('./controllers/epicController');
const commentRouter = require('./controllers/commentController');
const audioRouter = require('./controllers/audioController');
const roomRouter = require('./controllers/roomController');

const {
    PORT,
    // FRONTEND_DOMAIN_URL
} = process.env;

// Middleware
// const corsOptions = {
//     origin: FRONTEND_DOMAIN_URL,
//     exposedHeaders: 'Authorization',
//     credentials: true,
// };

app.use(cors());

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



// ErrorHandler
app.use(notFound);

app.listen(PORT, () => {
    console.log('Server running on port: %d', PORT);
});

module.exports = {
    app,
};
