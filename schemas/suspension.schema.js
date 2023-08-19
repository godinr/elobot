const { Schema } = require('mongoose');

const SuspensionSchema = new Schema({
    suspendedTime: Number,
        suspendedDate: String,
        suspendedReason: String
});

module.exports = SuspensionSchema;