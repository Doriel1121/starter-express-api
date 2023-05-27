const Attendence = require("./models/Attendence");
const fs = require('fs')


exports.getAtendence = async (req , res, callback) =>{
    try{
        const attendence = await Attendence.find();
        console.log(attendence);
        const amount = await handleAttendanceList(attendence);
        callback(amount);
        res.json(attendence);
    }
    catch {
        error => {
            res.json({message: error})
        }
    }
}

exports.getAtendenceByPhone = async (req , res, callback) => {
    // const isExist = await Attendence.exists({Phone:req})
    // console.log(isExist);
    // if (!isExist) {
        const attendence = await Attendence.find({Phone:req});
        console.log(attendence);
        callback(attendence)
    // } else {
    //     const attendence = await Attendence.find({Phone:req});
    //     console.log(attendence);
    //     callback(attendence)
    // }

}
exports.setAtendence = async (req , res, callback) => {
    const isExist = await Attendence.exists({Phone:req.phone});
    if (!isExist) {
        const newAtendence = new Attendence({
            Name: req.name,
            Phone: req.phone,
            Amount: req.amount,
            isComming:req.isComming
        });
        newAtendence.save()
        .then(data => {
            res.json(data);
        }).catch((error) => {
            callback(error);
        });
    } else {
        const query = {Phone:req.phone};
        const newvalues = {isComming: req.isComming , Amount: req.amount,Name:req.name , Phone:req.phone};
        Attendence.findOneAndUpdate(query , newvalues, { new: true })
        .then((res) => {
            console.log(res);
            callback(newvalues);
        }).catch(err => {
            console.log(err);
            callback(err)});
    }
}

function handleAttendanceList(list) {
    let summerize = [];
    let comming = 0;
    let notComming = 0;
    list.map((one) => {
        one.isComming ? comming++ : notComming++;
    })
    const text = `כמות אנשים שעידכנו שמגיעים: ${comming} <br/>
     כמות אנשים שעידכנו שלא מגיעים: ${notComming}<br/>
      כמות אנשים שלא עידכנו: ${100 - list.length}`
    return text;
}