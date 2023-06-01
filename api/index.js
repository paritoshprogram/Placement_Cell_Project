const express = require('express');
const app = express();
const port = 8200;
const db = require('./config/connection');
const bodyParser = require('body-parser');



app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.urlencoded());
app.use('/', require('./routes'));

app.listen(port,(err)=>{

    if(err){
        console.log(`Error in running the server: ${err}`);
        return;
    }

    console.log(`Server is running on port: ${port}`);

})