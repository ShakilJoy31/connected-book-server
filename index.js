const express = require('express');
const app = express(); 
const port = process.env.PORT || 5000; 
const cors = require('cors');
require('dotenv').config(); 
app.use(cors()); 
app.use(express.json()); 

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { query } = require('express');
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.vvmdl.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect();
        const usersCollection = client.db('ConnectedBook').collection('Users');
        const postsCollection = client.db('ConnectedBook').collection('usersPost');
        console.log('Database is connected'); 
        // Adding users to the database. 
        app.post('/users', async (req, res)=>{
            const info = req.body; 
            const result = await usersCollection.insertOne(info); 
            console.log(result); 
            res.send(result); 
        })

        // Get all the user
        app.get('/getuser', async (req,res)=>{
            const query = {}; 
            const cursor = usersCollection.find(query); 
            const users = await cursor.toArray(); 
            res.send(users); 
        })

        // Send users post to the database.
        app.post('/sendPost', async (req, res) =>{
            const information = req.body; 
            const result = await postsCollection.insertOne(information); 
            res.send(result); 
        })

        // Getting users post from the database. 
        app.get('/getPost', async (req, res) => {
            const query = {}; 
            const result = postsCollection.find(query); 
            const posts = await result.toArray(); 
            const sendablePost = posts.reverse(); 
            console.log(sendablePost); 
            res.send(sendablePost); 
        })
    }
    finally{
        
    }
}
run().catch(console.dir); 


app.get('/', (req, res)=>{
    res.send('This is connected book running'); 
}); 


app.listen(port, ()=>{
    console.log('Listening to the port ',port); 
})