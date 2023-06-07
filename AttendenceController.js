const Attendence = require("./models/Attendence");
const https = require('https');
const fs = require('fs');
const path = require('path');
// const AWS = require("aws-sdk");
// const s3 = new AWS.S3()

exports.getAtendence = async (req , res, callback) =>{
    try{
        const attendence = await Attendence.find();
        console.log(attendence);
        // const amount = handleAttendanceList(attendence);
        const newLocal = 'https://easy-cyan-lizard-robe.cyclic.app/arrival/attendances.txt';

        let counter = 0;
        attendence.forEach((single) => counter = counter + Number(single.Amount));
        let text = ['<h1 style="direction:rtl; margin:0"> כמות המגיעים סך הכל: ' + counter +  '</h1><br/>' + ' <h2 style="direction:rtl; margin:0"> רשימת מאשרי הגעה: ' +  '</h2><br/>'];
        attendence.forEach((v, index) => { 
            console.log(v.Name);
            v.isComming ? text.push( '<p style="direction:rtl; margin:0">' + 'שם: '+v.Name + ' - ' + 'טלפון: '+ v.Phone + ' - ' + 'כמות: '+ v.Amount + '</p><br/>') : null;
            // fileStream.write(v.isComming ? v.Name + ' - ' + v.Phone + ' - ' + v.Amount + '\n' : ''); 
        });
        res.send(text.join(' '))

        // downloadFile(newLocal , attendence , res);
        // res.send(amount);
        // callback(amount);
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

//     function handleAttendanceList(list) {
//     let comming = 0;
//     let notComming = 0;
//     list.map((one) => {
//         one.isComming ? comming++ : notComming++;
//     })
//     const text = `כמות אנשים שעידכנו שמגיעים: ${comming} <br/>
//      כמות אנשים שעידכנו שלא מגיעים: ${notComming}<br/>
//       כמות אנשים שלא עידכנו: ${113 - list.length}<br/>
//       `
//     return text;
// }


function downloadFile (url , attendence , response ) {
    console.log('-------------------------------------------------------------');
    const filename = path.basename(url);
    console.log(filename);
    https.get('https://easy-cyan-lizard-robe.cyclic.app/arrival', (res) => {
        const fileStream = fs.createWriteStream('attendances.txt',{flags: 'w'});
        res.pipe(fileStream);
        let counter = 0;
        let text = [' כמות המגיעים סך הכל: ' + counter +  '\n' + ' רשימת מאשרי הגעה: ' +  '\n'];
        attendence.forEach((single) => counter = counter + Number(single.Amount));
        fileStream.write(' כמות המגיעים סך הכל: ' + counter +  '\n' + ' רשימת מאשרי הגעה: ' +  '\n');
        attendence.forEach((v, index) => { 
            console.log(v.Name);
            v.isComming ? text.push( v.Name + ' - ' + v.Phone + ' - ' + v.Amount + '\n') : null;
            // fileStream.write(v.isComming ? v.Name + ' - ' + v.Phone + ' - ' + v.Amount + '\n' : ''); 
        });
        fileStream.write(text.join()); 
        console.log(text.join());
        // // res.pipe(fileStream);
        fileStream.on('error', (err) => {
            console.log('some error occured')
            console.log(err);
        }); 

        fileStream.on('finish', () => {
            console.log('Download finished')
            response.download('attendances.txt', err => console.log(err))
            fileStream.close();
        });        
    })
}