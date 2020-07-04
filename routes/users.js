var express = require('express');
var router = express.Router();

let user = require('../models/user');
let config = require('../config/db');




router.post('/', async (req, res) => {

  let bodyData = req.body;


  let userArray = [];
  //adding multiple users to db using array


  for (let i = 0; i < 500; i++) {
    let myObj = {};
    myObj.name = bodyData.name + '-' + '0' + i;
    myObj.rollNo = i;
    myObj.email = myObj.name + '@' + 'gmail.com';
    userArray.push(myObj);
  }



  await user.insertMany(userArray, async (err, respo) => {
    if (err) {
      return res.json({ status: false, msg: err, data: [] });
    }
    else {
      return res.json({ status: true, msg: 'Users added', data: [] });
    }
  })

});


router.get('/', async (req, res) => {

  await user.find({}, async (err, respo) => {
    if (err) {
      return res.json({ status: false, msg: err, data: [] });
    }
    else if (respo !== null) {
      // let newRespo = Math.max.apply(Math, respo.map(newObj => newObj.rollNo));
      // console.log(newRespo)

      return res.json({ status: true, msg: '', data: respo });
    }
  }).sort({ name: -1 });

})

router.delete('/', async (req, res) => {

  await user.updateMany({}, { $unset: '' }, async (err, respo) => {
    if (err) {
      return res.json({ status: false, msg: err, data: [] });
    }
    else {

      return res.json({ status: true, msg: 'deleted all users', data: [] });
    }
  }).sort({ name: -1 });


});

module.exports = router;
