const mongoose = require('mongoose');

const connectDB = async ()=>{
    const conn = await mongoose.connect(process.env.MONGO_URL)
}

module.exports = connectDB