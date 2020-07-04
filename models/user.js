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

//This pre hook will call before the calling of  find method of mongoose
uSchema.pre('find', function (next) {
    console.log('query hook');
    next();
});


//This post hook will call after calling of find method of mongoose
uSchema.post('find', function (doc) {
    console.log('length is' + '' + doc.length);
});

//demo func to test post hook after creating data
// async function updateDoc(id) {

//     let data = id + 'mj';

//     return data;
// };


uSchema.pre('findOneAndUpdate', function (next) {
    console.log('call before findone and update method');
    next();
});


uSchema.post('findOneAndUpdate', function (doc) {

    console.log('call after findone and update method');
    console.log('updated id is', doc._id);
    // console.log('updated data \t',doc)

});



module.exports = mongoose.model('users', uSchema);