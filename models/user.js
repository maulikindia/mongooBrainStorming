let mongoose = require('mongoose');
let bcrypt = require('bcrypt');
let uSchema = new mongoose.Schema({

    name: { type: String, index: true },
    email: { type: String },
    rollNo: { type: String },
    password: { type: String }
}, { timestamps: true });

uSchema.pre('save', function (next) {

    let user = this;
    if (!user.isModified('password' && !user.password)) {
        {
            next();
        }
    }

    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(user.password, salt, function (err, hash) {
            user.password = hash;
            next();
        });
    });
});



uSchema.post('save', function (doc) {
    console.log('doc id' + doc._id);
});

module.exports = mongoose.model('users', uSchema);