const mongoose = require('mongoose');

const SubscriberSchema = new mongoose.Schema({
    sub: {
        type: Object,
        unique: true
    }
})

module.exports = mongoose.model("Subscribe", SubscriberSchema)