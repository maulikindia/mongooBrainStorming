let mongoose = require('mongoose');

let salSchema = new mongoose.Schema({
    amount: { type: Number }

}, { timestamps: true });

module.exports=mongoose.model('salary',salSchema);