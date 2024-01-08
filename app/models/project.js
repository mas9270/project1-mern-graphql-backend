const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    name: {
        type: String
    },
    desctiption: {
        type: String
    },
    phone: {
        type: String,
        enum: ['Not started', 'In Progress', 'completed']
    },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client'
    }
})


module.exports = mongoose.model("Project", ProjectSchema)