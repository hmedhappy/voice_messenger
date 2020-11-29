const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    }
   
   
});

module.exports = mongoose.model('voice', newsSchema);