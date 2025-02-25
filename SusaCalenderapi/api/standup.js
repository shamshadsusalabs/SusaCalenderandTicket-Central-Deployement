const express = require("express");
const router = express.Router();
const { check,validationResult } = require('express-validator');
const StandupSchemas = require('../schema/Standup');
const crypto = require('crypto');

function Str(length) {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex') // Convert to hexadecimal format
        .slice(0, length); // Return required number of characters
}

router.get('/getall',async (req,res) => {
    try{
        let policies = await StandupSchemas.find();
        res.json(policies);
    }
    catch(err){
        res.json({msg:err.message});
    }
});

router.post(
    '/add',
    async (req,res) => {
        try{
          
            holiday = new StandupSchemas(req.body);
            await holiday.save();
            res.json(holiday);  
        } catch (error){
            console.log(error.message);
            return res.status(500).json({ msg : "Server Error....."});
        }
    }
);

router.post(
    '/remove',
    async (req,res) => {
        try{
            let employer = await StandupSchemas.findOne({"_id"  : req.body.id});
            if (!employer) {
                return res.status(401).json("Schedule not found");
            }
            await StandupSchemas.deleteOne({"_id"  : req.body.id});
            return res.status(200).json("Schedule Deleted");
        } catch (error){
            console.log(error.message);
            return res.status(500).json({ msg : error.message});
        }
    }
);

router.post('/update',async (req,res) => {
    try {
        let {id} = req.query;
        let employer = await StandupSchemas.findById(id);
        if (!employer) {
            return res.status(401).json("Employer not found");
        }
        let obj = {
            status : req.body.status
        }
        Object.assign(employer, req.body);
        await employer.save();
        res.json(employer);
    } catch (error) {
        console.log(error.message);
        return res.status(500);
    }
});

router.get('/details',(req,res,next)=>{
    let {id}=req.query;
    StandupSchemas.findById(id).then(result=>
         {res.status(200).json(result)
     }).catch(error=>{
                 console.log(error);
                     res.status(500).json(
                         {error:error}
                     )
     })
 });

 router.post(
    '/addtasks',
    async (req,res) => {
        try{
            
            let employer = await StandupSchemas.findOne({"_id"  : req.body.tid});
            if (!employer) {
                return res.status(401).json("Standup not found");
            }
            const referc = Str(5)  

            employer.tasks.push({
                "sid"  : referc,
                "title"  : req.body.title,
                "date" : req.body.date,
                "isCompleted" : req.body.isCompleted,
                "description" : req.body.description
            });
            await employer.save();
            res.json(employer);
        } catch (error){
            console.log(error.message);
            return res.status(500).json({ msg : error.message});
        }
    }
);

router.post(
    '/deletetasks',
    async (req,res) => {
        try{
            let employer = await StandupSchemas.findOne({"_id"  : req.body.id});
            if (!employer) {
                return res.status(401).json("Work not found");
            }
            StandupSchemas.findOneAndUpdate(
                { _id: req.body.id},
                { $pull: { tasks: { sid: req.body.sid } } },
                { new: true }
              )
                .then(templates =>
                    {
                        res.status(200).json(templates)
                })
                .catch(err =>  {
                    res.status(200).json(err)
            });
        } catch (error){
            console.log(error.message);
            return res.status(500).json({ msg : error.message});
        }
    }
);



router.post('/updatetaskstitle',async (req,res) => {
    try {
        let employer = await StandupSchemas.findOne({"_id"  : req.body.id});
        if (!employer) {
            return res.status(401).json("Work not found");
        }
        StandupSchemas.findOneAndUpdate(
            { _id: req.body.id , "tasks.sid": req.body.sid},
            { $set: { "tasks.$.title": req.body.title } 
        },
        { new: true }
          )
            .then(templates =>
                {
                    res.status(200).json(templates)
            })
            .catch(err =>  {
                res.status(200).json(err)
        });
        
       
    } catch (error) {
        console.log(error.message);
        return res.status(500);
    }
});

router.post('/updatedate',async (req,res) => {
    try {
        let employer = await StandupSchemas.findOne({"_id"  : req.body.id});
        if (!employer) {
            return res.status(401).json("Work not found");
        }
        StandupSchemas.findOneAndUpdate(
            { _id: req.body.id , "tasks.sid": req.body.sid},
            { $set: { "tasks.$.date": req.body.date } 
        },
        { new: true }
          )
            .then(templates =>
                {
                    res.status(200).json(templates)
            })
            .catch(err =>  {
                res.status(200).json(err)
        });
        
       
    } catch (error) {
        console.log(error.message);
        return res.status(500);
    }
});

router.post('/updateisCompleted',async (req,res) => {
    try {
        let employer = await StandupSchemas.findOne({"_id"  : req.body.id});
        if (!employer) {
            return res.status(401).json("Work not found");
        }
        StandupSchemas.findOneAndUpdate(
            { _id: req.body.id , "tasks.sid": req.body.sid},
            { $set: { "tasks.$.isCompleted": req.body.isCompleted } 
        },
        { new: true }
          )
            .then(templates =>
                {
                    res.status(200).json(templates)
            })
            .catch(err =>  {
                res.status(200).json(err)
        });
        
       
    } catch (error) {
        console.log(error.message);
        return res.status(500);
    }
});

router.post('/updatetasksdescription',async (req,res) => {
    try {
        let employer = await StandupSchemas.findOne({"_id"  : req.body.id});
        if (!employer) {
            return res.status(401).json("Work not found");
        }
        StandupSchemas.findOneAndUpdate(
            { _id: req.body.id , "tasks.sid": req.body.sid},
            { $set: { "tasks.$.description": req.body.description } 
        },
        { new: true }
          )
            .then(templates =>
                {
                    res.status(200).json(templates)
            })
            .catch(err =>  {
                res.status(200).json(err)
        });
        
       
    } catch (error) {
        console.log(error.message);
        return res.status(500);
    }
});





module.exports = router;