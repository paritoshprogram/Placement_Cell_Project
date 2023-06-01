const express = require('express');
const router = express.Router();

const usersController = require('../controllers/usersController');


router.post('/register',usersController.register)

router.get('/profile/:id',usersController.checkAuth,(req,res)=>{
    res.status(200).json({message:req.params.id+" is logged in"})

})

router.post('/login',usersController.login,(req,res)=>{
   
    if(res.statusCode === 200)
    {
        const id = req.body.username

      
        
        return res.redirect(`/users/profile/${id}`)
    }

    else {
        return res.redirect('/users/login')
    }

})

router.post('/logout',usersController.logout)









module.exports = router;