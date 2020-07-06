var express = require('express');
var router = express.Router();

let user = require('../models/user');
let config = require('../config/db');



let bcrypt = require('bcrypt');
router.post('/', async (req, res) => {

  let bodyData = req.body;


  let userArray = [];
  //adding multiple users to db using array


  for (let i = 0; i < 500; i++) {
    let myObj = {};
    myObj.name = bodyData.name + '-' + '0' + i;
    myObj.rollNo = i;
    myObj.email = myObj.name + '@' + 'gmail.com';
    myObj.password = myObj.rollNo + ' ' + myObj.email;
    userArray.push(myObj);
  }


  // let newArr = await encryptPass(userArray);
  await user.insertMany(userArray, async (err, respo) => {
    if (err) {
      return res.json({ status: false, msg: err, data: [] });
    }
    else {
      return res.json({ status: true, msg: 'Users added', data: [] });
    }
  })

});

router.post('/add', async (req, res) => {
  let bodyData = req.body;
  await user.create(bodyData, async (err, respo) => {
    if (err) {
      return res.json({ status: false, msg: err, data: [] });
    }
    else if (respo !== null) {
      return res.json({ status: true, msg: '', data: respo });
    }
  });

})


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
  }).sort({ name: 1 });

})

router.delete('/', async (req, res) => {
  await user.deleteMany({}, async (err, respo) => {
    if (err) {
      return res.json({ status: false, msg: err, data: [] });
    }
    else {

      return res.json({ status: true, msg: 'deleted all users', data: [] });
    }
  });
});

router.put('/', async (req, res) => {
  let bodyData = req.body;
  await user.findOneAndUpdate({ _id: bodyData._id }, bodyData, { new: true }, async (err, respo) => {
    if (err) {
      return res.json({ status: false, msg: err, data: [] });
    }
    else if (respo !== null) {
      return res.json({ status: true, msg: '', data: respo });
    }
  });
});

router.post('/re', async (req, res) => {
  await user.findOneAndDelete({ name: 'maulik bhalala' }, async (err, respo) => {
    if (err) {
      return res.json({ status: false, msg: err, data: [] });
    }
    else {
      return res.json({ status: true, msg: 'Removed ', data: [] });
    }

  })

});



async function encryptPass(arr) {
  for await (let mArr of arr) {
    if (mArr.password !== null) {
      await bcrypt.genSalt(10, async function (err, salt) {
        if (err) {
          return res.json({ status: false, msg: err, data: [] });
        }
        await bcrypt.hash(mArr.password, salt, function (err, hash) {
          if (err) {
            return res.json({ status: false, msg: err, data: [] });
          }
          let hashValue = hash;
          mArr.password = null;
        });
      });
    }
  }
  return arr;
}

router.get('/agg', async (req, res) => {

  let agg = [];
  agg = [
    {
      $group:
      {
        _id: "$email"
      }
    },
    {
      $project:
      {
        _id: 1,
      }
    }

  ];


  await user.aggregate(agg, async (err, respo) => {

    if (err) {
      return res.json({ status: false, msg: err, data: [] });
    }
    else if (respo !== null) {
      return res.json({ status: false, msg: '', data: respo });
    }

  });

});

let sal = require('../models/salary');


router.post('/sal', async (req, res) => {

  let bodyData = req.body;


  let salArray = [];

  for (let i = 1000; i < 2000; i++) {
    let myObj = {};
    myObj.amount = (bodyData.amount) + i;
    salArray.push(myObj);
  }

  await sal.insertMany(salArray, async (err, respo) => {
    if (err) {
      return res.json({ status: false, msg: err, data: [] });
    }
    else {
      return res.json({ status: true, msg: 'Salary added', data: [] });
    }
  });
});

router.get('/salAgg', async (req, res) => {


  let aggre = [];
  aggre = [
    {
      $group:
      {
        _id: "$amount",
        maxSalary: { $max: "$amount" } // top 5 max salary , we can use $avg ,$min for other things also.
      }
    },
    {
      $project:
      {
        maxSalary: 1 //projecting
      }
    },
    { $sort: { maxSalary: -1 } }, //sort by ascending
    { $limit: 5 } //give 5 records
  ];


  await sal.aggregate(aggre, async (err, respo) => {
    if (err) {
      return res.json({ status: false, msg: err, data: [] });
    }
    else if (respo !== null) {
      return res.json({ status: true, msg: ',', data: respo });
    }
  });


});


module.exports = router;
