const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const mongoose = require('mongoose');

router.get('/',(req,res,next)=>{
    Order.find()
    .select('product quantity _id productImage ')
    .exec()
     .then(docs => {
         const response ={
             count: docs.length,
             orders: docs.map(doc =>{
                
                 return {
                 product : doc.product,
                 quantity : doc.quantity,
                 _id: doc._id,
                 productImage:doc.productImage,
                 request: {
                     type: 'GET',
                     url :'http://localhost:3000/orders/'+ doc._id
                 }
                }
             })
         }; 
         res.status(200).json(response);
     })
     .catch(err => {
        console.log(err);
        res.status(500).json({error:err});
     })
 
});

router.get('/:orderId',(req,res,next)=>{
     const id = req.params.orderId;

    Order.findById(id)
     .select('product quantity _id productImage ')
     .exec()
     .then(doc => {
        console.log("from Database " + doc);
       if(doc)  {
        res.status(200).json(doc);
    } else {
        res.status(404).json({
            message: "No valid entry found"
        });
       }
    }) 
    .catch(err => 
       {
           console.log(err);
           res.status(500).json({error:err});
       });

});



router.post('/',(req,res,next) => {
    const order = new Order({
        _id:new mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId
    });
    order.save()
    .then(result=>{
        console.log(result);
        res.status(200).json({
            message: 'New Order Created',
            createdOrder:{
                productId: result.productId,
                quantity: result.quantity,
                _id : result._id,
                request:{
                    type: 'GET',
                    url: 'http://localhost:3000/orders'+ result._id
                }

            }
        });
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        })
    })
 
});

router.delete('/:orderId',(req,res,next)=>{
    const id = req.param.orderId;
    Order.deleteOne({ _id: id })
    .exec()
    .then(result =>{
        res.status(200).json({
            message:'Deleted'
        })
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        })
    })
});



module.exports = router;