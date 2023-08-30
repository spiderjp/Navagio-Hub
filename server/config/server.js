const express = require('express');
const bodyParser = require('body-parser');
const {CosmosClient} = require('@azure/cosmos');


const app = express();
const port = process.env.PORT || 3000;

//  Setting up the Middleware

app.use(bodyParser.json());

// Setting up the database connection

const cosmosClient = new CosmosClient({
    endpoint: '',
    key: '',
});

const databaseId = '';
const containerId = '';
const container = cosmosClient.database(databaseId).container(containerId);


// Route for recieve the datas of form

app.post('/api/submit-form', async(req, res)=>{

    try{
        const item = req.body;
        const { resource: createdItem } = await container.items.create(item);
        res.json(createdItem);    
    }catch(error){
        console.error(error);
        res.status(500).json({error: "An error occurred when trying to save the form data to the database."});
    }
});


// Starting server

app.listen(port, ()=>{
    console.log('Server is running on port ${port}')
});