const Attendence = require("./models/Attendence");


exports.getAtendence = async (req , res, callback) =>{
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

exports.getAtendenceByPhone = async (req , res, callback) => {
    const isExist = await Attendence.exists({Phone:req});
    if (!isExist) {
        const attendence = await Attendence.find({Phone:req});
        console.log(attendence);
        callback({isExist:false})
    } else {
        callback({isExist:true})
    }

}
exports.setAtendence = async (req , res, callback) =>{
    const isExist = await Attendence.exists({Phone:req.phone});;
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