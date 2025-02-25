const express = require("express");
const router = express.Router();
const { check,validationResult } = require('express-validator');
const ScheduleSchemas = require('../schema/Schedule');
const crypto = require('crypto');

function Str(length) {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex') // Convert to hexadecimal format
        .slice(0, length); // Return required number of characters
}

router.get('/getall',async (req,res) => {
    try{
        let policies = await ScheduleSchemas.find();
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
          
            holiday = new ScheduleSchemas(req.body);
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
            let employer = await ScheduleSchemas.findOne({"_id"  : req.body.id});
            if (!employer) {
                return res.status(401).json("Schedule not found");
            }
            await ScheduleSchemas.deleteOne({"_id"  : req.body.id});
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
        let employer = await ScheduleSchemas.findById(id);
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
    ScheduleSchemas.findById(id).then(result=>
         {res.status(200).json(result)
     }).catch(error=>{
                 console.log(error);
                     res.status(500).json(
                         {error:error}
                     )
     })
 });

 router.post(
    '/addschedules',
    async (req,res) => {
        try{
            
            let employer = await ScheduleSchemas.findOne({"_id"  : req.body.tid});
            if (!employer) {
                return res.status(401).json("Technicial not found");
            }
            const referc = Str(5)  

            employer.schedules.push({
                "sid"  : referc,
                "start"  : req.body.start,
                "end" : req.body.end,
                "details" : req.body.details
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
    '/deleteschedules',
    async (req,res) => {
        try{
            let employer = await ScheduleSchemas.findOne({"_id"  : req.body.id});
            if (!employer) {
                return res.status(401).json("Work not found");
            }
            ScheduleSchemas.findOneAndUpdate(
                { _id: req.body.id},
                { $pull: { schedules: { sid: req.body.sid } } },
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

module.exports = router;