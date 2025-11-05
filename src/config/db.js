// // src/config/db.js
// const mongoose = require('mongoose');

// const connectDB = async () => {
//     try {
//         const conn = await mongoose.connect(process.env.MONGO_URI, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//         });

//         console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

//         // Handle connection events
//         mongoose.connection.on('error', (err) => {
//             console.error('❌ MongoDB connection error:', err);
//         });

//         mongoose.connection.on('disconnected', () => {
//             console.warn('⚠️ MongoDB disconnected');
//         });

//     } catch (error) {
//         console.error(`❌ Error connecting to MongoDB: ${error.message}`);
//         process.exit(1);
//     }
// };

// module.exports = connectDB;


const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000, // Timeout after 5s
        });

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

        mongoose.connection.on('error', (err) => {
            console.error('❌ MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('⚠️ MongoDB disconnected, retrying...');
            setTimeout(connectDB, 5000);
        });

    } catch (error) {
        console.error(`❌ Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
