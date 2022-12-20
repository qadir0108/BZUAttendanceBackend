const express = require('express');
const cors = require('cors');
require("./db/config");
const Student = require('./db/Student');
const Timetable = require('./db/Timetable');
const Attendance = require('./db/Attendance');
const app = express();
var moment = require('moment');
const QRCode = require('qrcode');
const port = 80;
app.use(cors())
app.use(express.json());

app.get("", async (req, resp) => {
    resp.send(`<h2>Hello from Junaid Qasim!</h2>`)
});
app.get("/qrcode", async (req, resp) => {

    let hours = parseInt(moment().format("HH"));
    let minutes = parseInt(moment().format("mm"));
    let day = parseInt(moment().format("E"));
    // console.log(typeof(hours),typeof(minutes),typeof(day))
    hours += 5;
    var timeSlot = 0;
    if (hours == 8 && minutes > 30 || hours == 9) {
        timeSlot = 1;
    }
    if (hours == 10 || hours == 11 && minutes < 30) {
        timeSlot = 2;
    }
    if (hours == 12 || hours == 13 && minutes < 30) {
        timeSlot = 3;
    }
    if (hours == 13 && minutes > 30 || hours == 14) {
        timeSlot = 4;
    }

    console.log(hours)
    if (timeSlot == 0 || day == 0 && day > 5) {
        resp.send(`<h1>No Lecture is scheduled at this time.</h1>`);
    }
    else {
        var timetables = await Timetable.find({ Session: 1923, TimeSlot: timeSlot, Day: day });
        if (timetables.length == 0) {
            resp.send(`<h1>No Lecture is scheduled at this time.</h1>`);
        }
        else {
            let date = moment().format("YYYYMMDD").toString();
            //  console.log(date);
            let data = date + "_" + timeSlot + "_" + timetables[0].SubjectCode;
            // Converting the data into base64
            QRCode.toDataURL(data, function (err, code) {
                if (err) return console.log("error occurred")
                resp.send(`<img src=${code} width="250px" height="250px">`);
            })
        }

    }
});
app.get("/qrcode/:session", async (req, resp) => {
    var inputSession = req.params.session;
    let hours = parseInt(moment().format("HH"));
    let minutes = parseInt(moment().format("mm"));
    let day = parseInt(moment().format("E"));
    // console.log(typeof(hours),typeof(minutes),typeof(day))
    hours += 5;
    var timeSlot = 0;
    if (hours == 8 && minutes > 30 || hours == 9) {
        timeSlot = 1;
    }
    if (hours == 10 || hours == 11 && minutes < 30) {
        timeSlot = 2;
    }
    if (hours == 12 || hours == 13 && minutes < 30) {
        timeSlot = 3;
    }
    if (hours == 13 && minutes > 30 || hours == 14) {
        timeSlot = 4;
    }

    console.log(hours)
    if (timeSlot == 0 || day == 0 && day > 5) {
        resp.send(`<h1>No Lecture is scheduled at this time.</h1>`);
    }
    else {
        var timetables = await Timetable.find({ Session: inputSession, TimeSlot: timeSlot, Day: day });
        if (timetables.length == 0) {
            resp.send(`<h1>No Lecture is scheduled at this time.</h1>`);
        }
        else {
            let date = moment().format("YYYYMMDD").toString();
            //  console.log(date);
            let data = date + "_" + timeSlot + "_" + timetables[0].SubjectCode;
            // Converting the data into base64
            QRCode.toDataURL(data, function (err, code) {
                if (err) return console.log("error occurred")
                resp.send(`<img src=${code} width="250px" height="250px">`);
            })
        }

    }
});
app.post("/student/register", async (req, resp) => {
    try {
        let data = new Student(req.body);
        data.Password = data.generateHash(req.body.Password);
        console.log(data);
        var result = {};
        await data.save().then(user => {
            if (user) {
                result = user.toObject();
                result = {
                    Success: true
                }
                Object.assign(result, user._doc);
                delete result.Password;
                resp.json(result);
            }
        })
            .catch(err => {
                if (err.code == 11000) {
                    result = {
                        Success: false,
                        RollNumberError: true
                    }
                    Object.assign(result, err);
                    resp.json(result);
                    return;
                }
                result = {
                    Success: false,
                    RollNumberError: false
                }
                Object.assign(result, err);
                resp.json(result);
            })
    } catch (error) {
        result = {
            Success: false,
            RollNumberError: false
        }
        Object.assign(result, error);
        resp.json(result);
    }
});
app.post("/student/login", async (req, resp) => {
    try {
        var rollnumber = req.body['RollNumber'];
        var password = req.body['Password'];
        var result = {};
        if (rollnumber && password) {
            let user = await Student.findOne({ RollNumber: rollnumber });
            if (user) {
                if (!user.validPassword(password)) {
                    //password did not match
                    result = {
                        Success: false,
                        ErrorMessage: "Wrong RollNumber or Password"
                    };
                    resp.status(400).send(result);
                } else {
                    // password matched. proceed forward
                    result = {
                        Success: true,
                        Name: user._doc.Name
                    }
                    // Object.assign(result, user._doc);
                    // delete result.password;
                    resp.json(result);
                }

            }
            else {
                result = {
                    Success: false,
                    ErrorMessage: "No user Found with this rollnumber"
                };
                resp.status(400).send(result);
            }
        }
        else {
            result = {
                Success: false,
                ErrorMessage: "Send Correct Data!"
            };
            resp.status(400).send(result);
        }
    }
    catch (error) {
        resp.status(400).send(error);
    }

});
app.post("/add-timetable", async (req, resp) => {
    try {
        var timetables = await Timetable.find({ Session: req.body.Session, TimeSlot: req.body.TimeSlot, Day: req.body.Day });
        if (timetables.length != 0) {
            result = {
                Success: false,
                ErrorMessage: "Timeslot in this day for this class is in use!"
            }
            resp.json(result);
        }
        else {
            let data = new Timetable(req.body);
            var result = {};
            await data.save().then(time => {
                if (time) {
                    result = time.toObject();
                    result = {
                        Success: true
                    }
                    Object.assign(result, time._doc);
                    resp.json(result);
                }
            })
                .catch(err => {
                    result = {
                        Success: false
                    }
                    Object.assign(result, err);
                    resp.json(result);
                })
        }

    } catch (error) {
        resp.json(error);
    }
});
app.post("/timetable", async (req, resp) => {
    try {
        var rollnumber = req.body['RollNumber'];
        if (rollnumber) {
            var student = await Student.findOne({ RollNumber: rollnumber });
            if (student) {
                var timetables = await Timetable.find({ session: student.session });
                if (timetables) {
                    let day = parseInt(moment().format("E"));
                    let filteredTimetable = timetables.filter(i => i.Day == day);
                    filteredTimetable.sort((a, b) => a.TimeSlot - b.TimeSlot);
                    var res = {
                        Timetable: filteredTimetable
                    }
                    resp.json(res);
                }
                else {
                    resp.status(400).json("Time Table not Found");
                }
            }
            else {
                resp.status(400).json("Student not Found");
            }

        }
        else {
            resp.status(400).json("Give RollNumber!");
        }
    } catch (error) {
        console.log(error);
    }
});
app.get("/timetable/:rollnumber", async (req, resp) => {
    try {
        var rollnumber = req.params.rollnumber;
        if (rollnumber) {
            var student = await Student.findOne({ RollNumber: rollnumber });
            if (student) {
                var timetables = await Timetable.find({ session: student.session });
                if (timetables) {
                    let day = parseInt(moment().format("E"));
                    let filteredTimetable = timetables.filter(i => i.Day == day);
                    filteredTimetable.sort((a, b) => a.TimeSlot - b.TimeSlot);
                    var res = {
                        Timetable: filteredTimetable
                    }
                    resp.json(res);
                }
                else {
                    resp.status(400).json("Time Table not Found");
                }
            }
            else {
                resp.status(400).json("Student not Found");

            }
        }
        else {
            resp.status(400).json("Give RollNumber!");
        }
    } catch (error) {
        console.log(error);
    }
});
app.post("/attendance/mark", async (req, resp) => {
    try {
        var rollnumber = req.body['RollNumber'];
        var status = req.body['Status'];
        var day = req.body['Day'];
        var timeSlot = req.body['TimeSlot'];
        console.log(rollnumber, status, day, timeSlot);
        var student = await Student.findOne({ RollNumber: rollnumber });
        var timetables = await Timetable.find({ Session: student.Session, TimeSlot: timeSlot, Day: day });
        if (timetables.length != 0) {
            if (student) {
                let result = {};
                let tempData = {
                    Date: new Date(),
                    RollNumber: rollnumber,
                    TimeSlot: timeSlot,
                    Teacher: timetables[0].Teacher,
                    SubjectCode: timetables[0].SubjectCode,
                    Subject: timetables[0].Subject,
                    Status: status
                }
                let data = new Attendance(tempData);
                await data.save().then(ret => {
                    if (ret) {
                        result = ret.toObject();
                        result = {
                            Success: true
                        }
                        Object.assign(result, ret._doc);
                        resp.json(result);
                    }
                })
                    .catch(err => {
                        result = {
                            Success: false
                        }
                        Object.assign(result, err);
                        resp.json(result);
                    })
            }
            else {
                result = {
                    Success: false,
                    ErrorMessage: "Send Correct Data!"
                }
                resp.json(result);
            }
        }
        else {
            result = {
                Success: false,
                ErrorMessage: "TimeTable not Found"
            }
            resp.json(result);
        }

    } catch (error) {
        result = {
            Success: false,
            ErrorMessage: "Send correct data!"
        }
        resp.json(result);
    }
});
app.post("/attendance/history", async (req, resp) => {
    try {
        let rollnumber = req.body['RollNumber'];
        if (rollnumber) {
            var attendance = await Attendance.find({ RollNumber: rollnumber });
            if (attendance) {
                attendance.map((item, index) => {
                    // console.log(item);
                    if (item.Status === "0") {
                        item.Status = "Absent";
                    }
                    if (item.Status === "1") {
                        item.Status = "Present";
                    }
                    if (item.Status === "2") {
                        item.Status = "Leave";
                    }
                })
                var res = {
                    AttendanceHistory: attendance
                }
                resp.json(res);
            }
            else {
                resp.json("Attendance not Found");
            }
        }
        else {
            resp.json("Roll Number not Found");
        }
    } catch (error) {
        resp.json({ "Error Caught": true, error });

    }
});
app.get("/attendance/history/:Rollnumber", async (req, resp) => {
    try {
        let rollnumber = req.params.Rollnumber;
        if (rollnumber) {
            var attendance = await Attendance.find({ RollNumber: rollnumber });
            if (attendance) {
                attendance.map((item, index) => {
                    // console.log(item);
                    if (item.Status === "0") {
                        item.Status = "Absent";
                    }
                    if (item.Status === "1") {
                        item.Status = "Present";
                    }
                    if (item.Status === "2") {
                        item.Status = "Leave";
                    }
                })
                var res = {
                    AttendanceHistory: attendance
                }
                resp.json(res);
            }
            else {
                resp.status(400).json("Time Table not Found");
            }
        }
        else {
            resp.status(400).json("Roll Number not Found");
        }
    } catch (error) {
        resp.json({ "Error Caught": true, error });

    }
});

app.listen(port, () => {
    console.log(`App app listening at Port ${port}`)
})
