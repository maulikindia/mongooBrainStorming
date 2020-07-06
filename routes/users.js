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

//get users by aggregation
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

//post multiple salaries
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


//get top salaries by aggregation
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

//get all salaries
router.get('/getSal', async (req, res) => {
  await sal.find({}, async (err, respo) => {
    if (err) {
      return res.json({ status: false, msg: err, data: [] });
    }
    else if (respo !== null) {
      return res.json({ status: true, msg: ',', data: respo });
    }

  });

});


let emp = require('../models/employee');

//add employee
router.post('/emp', async (req, res) => {
  let bodyData = req.body;
  await emp.create(bodyData, async (err, respo) => {
    if (err) {
      return res.json({ status: false, msg: err, data: [] });
    }
    else if (respo !== null) {
      return res.json({ status: true, msg: ',', data: respo });
    }

  });
});



//get specific employee with their salary  using populate and aggregation

router.get('/empSal', async (req, res) => {
  let mQ = { 'empName': req.query.name };
  let q = req.query.isAgg;
  //q=0 for populate and q=1 for aggregation

  if (q === 0 || q === '0') {
    console.log('in populate')
    await emp.findOne(mQ, async (err, respo) => {
      if (err) {
        return res.json({ status: false, msg: err, data: [] });
      }
      else if (respo !== null) {
        respo = JSON.parse(JSON.stringify(respo));
        respo.amount = respo.salary.amount;
        delete respo.salary;
        return res.json({ status: true, msg: ',', data: respo });
      }

    }).populate({ path: 'salary' });

  }
  else if (q === 1 || q === '1') {

    console.log('in aggregation.')
    let aggre = [];

    aggre = [
      {
        $match: mQ
      },
      {
        $lookup:
        {

          localField: 'salary',
          foreignField: '_id',
          from: 'salaries',
          as: 'empArray'
        }
      },
      // {
      //   $project:
      //   {
      //     empArray: { amount: 1 }
      //   }
      // }
    ];


    await emp.aggregate(aggre, async (err, respo) => {

      if (err) {
        return res.json({ status: false, msg: err, data: [] });
      }
      else if (respo !== null) {
        respo = JSON.parse(JSON.stringify(respo));
        let newArr = []
        for await (let mRespo of respo) {
          let amount;
          for await (let mSal of mRespo.empArray) {
            amount = mSal.amount;
          }

          delete mRespo.salary;
          delete mRespo.empArray;
          mRespo.amount = amount;
          newArr.push(mRespo)
        }
        return res.json({ status: true, msg: ',', data: newArr });
      }
    })

  }

});


//get specific employees  with their salaries  using populate and aggregation

router.get('/salById', async (req, res) => {
  let mongoose = require('mongoose');
  let mQ = { 'salary': mongoose.Types.ObjectId(req.query.id) };
  let q = req.query.isAgg;

  //q=0 for populate and q=1 for aggregation
  if (q === 0 || q === '0') {
    await emp.find(mQ, async (err, respo) => {
      if (err) {
        return res.json({ status: false, msg: err, data: [] });
      }
      else if (respo !== null) {
        respo = JSON.parse(JSON.stringify(respo));
        let newArr = [];
        for await (let mRespo of respo) {

          mRespo.amount = mRespo.salary.amount;
          delete mRespo.salary;
          newArr.push(mRespo);
        }
        return res.json({ status: true, msg: ',', data: newArr });
      }

    }).populate({ path: 'salary' });

  }
  else if (q === 1 || q === '1') {
    let aggre = [];
    aggre = [
      {
        $match: mQ
      },
      {
        $lookup:
        {

          localField: 'salary',
          foreignField: '_id',
          from: 'salaries',
          as: 'empArray'
        }
      },
    ];

    await emp.aggregate(aggre, async (err, respo) => {
      if (err) {
        return res.json({ status: false, msg: err, data: [] });
      }
      else if (respo !== null) {
        respo = JSON.parse(JSON.stringify(respo));
        let newArr = []
        for await (let mRespo of respo) {
          let amount;
          for await (let mSal of mRespo.empArray) {
            amount = mSal.amount;
          }

          delete mRespo.salary;
          delete mRespo.empArray;
          mRespo.amount = amount;
          newArr.push(mRespo);
        }
        return res.json({ status: true, msg: ',', data: newArr });
      }
    });
  }
});



module.exports = router;
