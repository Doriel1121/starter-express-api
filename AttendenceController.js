const mongo = require('mongoose');
const Attendence = require("./models/Attendence");


exports.getAtendence = async (req , res, callback) =>{
    console.log("here");
    try{
        const attendence = await Attendence.find();
        console.log(attendence);
        callback(attendence);
        res.json(attendence);
    }
    catch {
        error => {
            res.json({message: error})
        }
    }
}
exports.setAtendence = async (req , res, callback) =>{
    console.log("new");
    const newAtendence = new Attendence({
        Name: 'Timna',
        Phone: '0546171451',
        Amount: '1',
        isComming:true
    });
    newAtendence.save()
    .then(data => {
        res.json(data);
    }).catch((error) => {
        callback(error);
    });
}