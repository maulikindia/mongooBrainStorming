let mongoose = require('mongoose');
let dbUrl = 'mongodb://localhost:27017/mongoBrainStorm';


    mongoose.connect(dbUrl, { useNewUrlParser: true }, async (err) => {
        if (!err) {
            return console.log('DB connected at url' + ' ' + `${dbUrl}`);
        }
        else if (err) {
            return console.log('Error in mongoose connection \t', err);
        }

    });

