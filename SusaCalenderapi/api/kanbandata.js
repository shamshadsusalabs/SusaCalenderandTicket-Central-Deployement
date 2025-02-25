const express = require("express");
const router = express.Router();
const { check,validationResult } = require('express-validator');
const KanbanDataSchemas = require('../schema/KanbanData');
const crypto = require('crypto');

function Str(length) {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex') // Convert to hexadecimal format
        .slice(0, length); // Return required number of characters
}

router.get('/getall',async (req,res) => {
    try{
        let policies = await KanbanDataSchemas.find();
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
          
            holiday = new KanbanDataSchemas(req.body);
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
            let employer = await KanbanDataSchemas.findOne({"_id"  : req.body.id});
            if (!employer) {
                return res.status(401).json("Schedule not found");
            }
            await KanbanDataSchemas.deleteOne({"_id"  : req.body.id});
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
        let employer = await KanbanDataSchemas.findById(id);
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
    KanbanDataSchemas.findById(id).then(result=>
         {res.status(200).json(result)
     }).catch(error=>{
                 console.log(error);
                     res.status(500).json(
                         {error:error}
                     )
     })
 });

 router.post(
    '/addsharedKanban',
    async (req,res) => {
        try{
            
            let employer = await KanbanDataSchemas.findOne({"_id"  : req.body.tid});
            if (!employer) {
                return res.status(401).json("Technicial not found");
            }
            const referc = Str(5)  

            employer.sharedKanban.push({
                "sid"  : referc,
                "userName"  : req.body.userName,
                "statusId" : req.body.statusId,
                "statusName" : req.body.statusName,
                "userId" : req.body.userId
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
    '/deletesharedKanban',
    async (req,res) => {
        try{
            let employer = await KanbanDataSchemas.findOne({"_id"  : req.body.id});
            if (!employer) {
                return res.status(401).json("Work not found");
            }
            KanbanDataSchemas.findOneAndUpdate(
                { _id: req.body.id},
                { $pull: { sharedKanban: { sid: req.body.sid } } },
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

router.post(
    '/addsharedKanbanData',
    async (req,res) => {
        try{
            
            let employer = await KanbanDataSchemas.findOne({"_id"  : req.body.tid});
            if (!employer) {
                return res.status(401).json("Technicial not found");
            }
            const referc = Str(5)  

            employer.sharedKanbanData.push({
                "sid"  : referc,
                "userName"  : req.body.userName,
                "userId" : req.body.userId,
                "title" : req.body.title,
                "description" : req.body.description,
                "imageURL" : req.body.imageURL
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
    '/deletesharedKanbanData',
    async (req,res) => {
        try{
            let employer = await KanbanDataSchemas.findOne({"_id"  : req.body.id});
            if (!employer) {
                return res.status(401).json("Work not found");
            }
            KanbanDataSchemas.findOneAndUpdate(
                { _id: req.body.id},
                { $pull: { sharedKanbanData: { sid: req.body.sid } } },
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

router.post(
    '/addkanbanFields',
    async (req,res) => {
        try{
            
            let employer = await KanbanDataSchemas.findOne({"_id"  : req.body.tid});
            if (!employer) {
                return res.status(401).json("Technicial not found");
            }
            const referc = Str(5)  

            employer.kanbanFields.push({
                "sid"  : referc,
                "statusId"  : req.body.statusId,
                "statusName" : req.body.statusName
            });
            await employer.save();
            res.json(employer);
        } catch (error){
            console.log(error.message);
            return res.status(500).json({ msg : error.message});
        }
    }
);

router.post('/updatestatusIdkanbanFields',async (req,res) => {
    try {
        let employer = await KanbanDataSchemas.findOne({"_id"  : req.body.id});
        if (!employer) {
            return res.status(401).json("Work not found");
        }
        KanbanDataSchemas.findOneAndUpdate(
            { _id: req.body.id , "kanbanFields.sid": req.body.sid},
            { $set: { "kanbanFields.$.statusId": req.body.statusId } 
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

router.post('/updatestatusNamekanbanFields',async (req,res) => {
    try {
        let employer = await KanbanDataSchemas.findOne({"_id"  : req.body.id});
        if (!employer) {
            return res.status(401).json("Work not found");
        }
        KanbanDataSchemas.findOneAndUpdate(
            { _id: req.body.id , "kanbanFields.sid": req.body.sid},
            { $set: { "kanbanFields.$.statusName": req.body.statusName } 
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

router.post(
    '/deletekanbanFields',
    async (req,res) => {
        try{
            let employer = await KanbanDataSchemas.findOne({"_id"  : req.body.id});
            if (!employer) {
                return res.status(401).json("Work not found");
            }
            KanbanDataSchemas.findOneAndUpdate(
                { _id: req.body.id},
                { $pull: { kanbanFields: { sid: req.body.sid } } },
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