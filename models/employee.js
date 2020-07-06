let mongoose = require('mongoose');

let empSchema = new mongoose.Schema({
    empName: { type: String },
    salary: { type: mongoose.Schema.Types.ObjectId, ref: 'salary' }
});

module.exports = mongoose.model('employee', empSchema);