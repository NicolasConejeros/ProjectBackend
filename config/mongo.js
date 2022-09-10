const mongoose = require('mongoose');

const {
    MONGO_DB_URI,
} = process.env;

// MongoDB connection
mongoose.connect(MONGO_DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

db.on('connecting', () => {
    console.log('connecting to MongoDB...');
});

db.on('error', (error) => {
    console.error(`Error in MongoDb connection: ${error}`);
    mongoose.disconnect();
});
db.on('connected', () => {
    console.log('MongoDB connected!');
});
db.once('open', () => {
    console.log('MongoDB connection opened!');
});
db.on('reconnected', () => {
    console.log('MongoDB reconnected!');
});
db.on('disconnected', () => {
    console.log('MongoDB disconnected!');
    mongoose.connect(MONGO_DB_URI, { server: { auto_reconnect: true } });
});
mongoose.connect(MONGO_DB_URI, { server: { auto_reconnect: true } });
