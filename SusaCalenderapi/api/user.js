const express = require("express");
const router = express.Router();
const { check,validationResult } = require('express-validator');
const UserSchemas = require('../schema/User');

router.post(
    '/login',
    
    async (req,res) => {
        try {
            let {email,password} = req.body;
            console.log(req.body);
            const errors = validationResult(req);
            let employer = await UserSchemas.findOne({email})
            
            if(!errors.isEmpty()){
                return res.status(401).json({errors : errors.array})
            
            }
            if(!employer){
                return res.status(401).json("Not Found");
            }
            
                 res.json(employer);     
           
       } catch (error){
            console.log(error.message);
            return res.status(500);
       }
    }
);

router.get('/details/:id',(req,res,next)=>{
    UserSchemas.findById(req.params.id).then(result=>
        {res.status(200).json(result)
    }).catch(error=>{
                console.log(error);
                    res.status(500).json(
                        {error:error}
                    )
    })
});

router.post(
    '/signup',
    async (req,res) => {
        try{
            let holiday = await UserSchemas.findOne({userName:req.body.userName});
            const errors = validationResult(req);
            if(!errors.isEmpty())
            {
                return res.status(401).json({errors : errors.array()});
            }
            if(holiday){
                return res.status(401).json({ msg : "Username already present"})
            }
            holiday = new UserSchemas(
                {"userName": req.body.userName,
                "password": req.body.password,
                "email" : req.body.email,
            "isVerified" : req.body.isVerified }
                );
             await holiday.save();
            res.json(holiday);
        } catch (error){
            console.log(error.message);
            return res.status(500).json({ msg : error.message});
        }
    }
);

router.get('/getall', async (req, res) => {
    try {
        // Get the current user's ID from the request query parameters
        const currentUserId = req.query.currentUserId; // Expecting it to be sent as a query parameter
        
        // Find all users except the current user
        let policies = await UserSchemas.find({ _id: { $ne: currentUserId } });

        res.json(policies);
    } catch (err) {
        res.json({ msg: err.message });
    }
});


router.post(
    '/remove',
    async (req,res) => {
        try{
            let employer = await UserSchemas.findOne({"_id"  : req.body.id});
            if (!employer) {
                return res.status(401).json("Event not found");
            }
            await UserSchemas.deleteOne({"_id"  : req.body.id});
            return res.status(200).json("Event Deleted");
        } catch (error){
            console.log(error.message);
            return res.status(500).json({ msg : error.message});
        }
    }
);

router.post('/update',async (req,res) => {
    try {
        let {id} = req.query;
        let employer = await UserSchemas.findById(id);
        if (!employer) {
            return res.status(401).json("Employer not found");
        }
        
        Object.assign(employer, req.body);
        await employer.save();
        res.json(employer);
    } catch (error) {
        console.log(error.message);
        return res.status(500);
    }
});



module.exports = router;