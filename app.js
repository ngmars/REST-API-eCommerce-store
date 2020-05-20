const express = require('express');
const app = express();
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/users');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


mongoose.Promise= global.Promise;

mongoose
     .connect( 'mongodb+srv://nitish:nitishpass@node-rest-shop-ksltt.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
     .then(() => console.log( 'Database Connected' ))
     .catch(err => console.log( err ));
app.use(morgan('dev'));
app.use(express.static('upload'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Header','Origin,X-Requested-with,Content-Type,Accept,Authorization');
    
    if(req.method=='OPTIONS'){
        res.header('Access-Control-Allow-Methods','PUT, POST, PATCH, GET, DELETE');
        return res.status(200).json({});
    }
    next();
});

app.use('/products', productRoutes );
app.use('/orders', orderRoutes );
app.use('/users', userRoutes );

app.use((req,res,next) =>{ 
    const error = new Error('Not Found');
    error.status= 404;
    next(error);
})


app.use((error,req,res,next)=>{
    res.status(error.status || 500);
    res.json({error:{
                message: error.message
            }
        });
});



module.exports = app;