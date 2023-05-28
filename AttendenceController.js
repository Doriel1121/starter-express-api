const Attendence = require("./models/Attendence");
const https = require('https');
const fs = require('fs');
const path = require('path');

exports.getAtendence = async (req , res, callback) =>{
    try{
        const attendence = await Attendence.find();
        console.log(attendence);
        const amount = await handleAttendanceList(attendence);
        const newLocal = 'https://vivacious-tweed-jacket-jay.cyclic.app/arrival/attendances.html';
        downloadFile(newLocal , attendence);
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
    let comming = 0;
    let notComming = 0;
    list.map((one) => {
        one.isComming ? comming++ : notComming++;
    })
    const text = `כמות אנשים שעידכנו שמגיעים: ${comming} <br/>
     כמות אנשים שעידכנו שלא מגיעים: ${notComming}<br/>
      כמות אנשים שלא עידכנו: ${100 - list.length}<br/>
      `
    return text;
}


function downloadFile(url , attendence) {
    console.log('-------------------------------------------------------------');
    const filename = path.basename(url);
    console.log(filename);
    https.get('https://vivacious-tweed-jacket-jay.cyclic.app/arrival', (res) => {
        const fileStream = fs.createWriteStream('/tmp/attendances.txt');
        console.log(url);
        fileStream.write('מגיעים:' + '\n');
        attendence.forEach(function(v) { 
            console.log(v.Name);
            fileStream.write(v.isComming ? v.Name + ' - ' + v.Phone +  '\n' : ''); 
        });

        // res.pipe(fileStream);

        fileStream.on('finish', () => {
            fileStream.close();
            console.log('Download finished')
        });
    })
}