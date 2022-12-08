const express = require('express')
const app = express()
const port = 80

app.use(express.json());

app.post('/students/register', (req, res) => {
  console.log('request recived');
  console.log(req.body);
  res.json(req.body);
  console.log('response sent');

})

app.post('/students/login', (req, res) => {
  console.log('request recived');
  console.log(req.body);
  
  var rollnumber = req.body['RollNumber'];
  var password = req.body['Password'];
  var result = {};
  if(rollnumber == 'LDBTT-1923-01' && password == 'pass123') {
    result = {
      Success: true,
      Name: "Rana Akram",
    };
  } else {
    result = {
      Success: false,
      ErrorMessage: "Wrong RollNumber or Password"
    };
  }
  
  res.json(result);
  console.log('response sent');

})

app.post('/timetable', (req, res) => {
  console.log('request recived');

  var result = 
  [
    {
      "Date": "20221125",
      "TimeSlot": 1,
      "SubjectCode": "IT205",
      "Subject": "Data Structure",
      "Teacher": "Kamran Qadir"
    },
    {
      "Date": "20221125",
      "TimeSlot": 2,
      "SubjectCode": "IT307",
      "Subject": "Visual Programming",
      "Teacher": "Kamran Qadir"
    },
    {
      "Date": "20221125",
      "TimeSlot": 3,      
      "SubjectCode": "IT403",
      "Subject": "Mobile App Development",
      "Teacher": "Kamran Qadir"
    }
  ];

  res.json(result);
  console.log('response sent');
})

app.post('/attendance/history', (req, res) => {
  console.log('request recived');

  var result = {
    "AttendanceHistory" : [
      {
        "Date": "20221125",
        "TimeSlot": "1",
        "SubjectCode": "IT205",
        "Subject": "Data Structure",
        "Teacher": "Kamran Qadir",
        "Status": "PRESENT",
      },
      {
        "Date": "20221125",
        "TimeSlot": "2",
        "SubjectCode": "IT307",
        "Subject": "Visual Programming",
        "Teacher": "Kamran Qadir",
        "Status": "PRESENT",
      },
      {
        "Date": "20221125",
        "TimeSlot": "3",
        "SubjectCode": "IT403",
        "Subject": "Mobile App Development",
        "Teacher": "Kamran Qadir",
        "Status": "ABSENT",
      },
    ]
  } 
;
  res.json(result);
  console.log('response sent');
})

app.post('/attendance/mark', (req, res) => {
  console.log('request recived');
  console.log(req.body);
  res.json(req.body);
  console.log('response sent');

})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})