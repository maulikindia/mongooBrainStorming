let mongoose = require('mongoose');

let uSchema = new mongoose.Schema({

    name: { type: String },
    email: { type: String },
    rollNo: { type: String }
}, { timestamps: true });


module.exports=mongoose.model('users',uSchema);