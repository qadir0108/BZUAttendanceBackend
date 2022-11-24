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
  
  var rollnumber = req.body['rollnumber'];
  var password = req.body['password'];
  var result = {};
  if(rollnumber == 'LDBTT-1923-01' && password == 'pass123') {
    result = {
      success: true,
    };
  } else {
    result = {
      success: false,
      errorMessage: "Wrong username or password"
    };
  }
  
  res.json(result);
  console.log('response sent');

})

app.get('/timetable', (req, res) => {
  console.log('request recived');

  var result = 
  [
    {
      "Date": "20221125",
      "Slot": 1,
      "SubjectCode": "IT205",
      "Subject": "Data Structure",
      "Teacher": "Kamran Qadir"
    },
    {
      "Date": "20221125",
      "Slot": 2,
      "SubjectCode": "IT307",
      "Subject": "Visual Programming",
      "Teacher": "Kamran Qadir"
    },
    {
      "Date": "20221125",
      "Slot": 3,      
      "SubjectCode": "IT403",
      "Subject": "Mobile App Development",
      "Teacher": "Kamran Qadir"
    },
  ] 
  ;

  res.json(result);
  console.log('response sent');
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})