import express from 'express'
import path from 'path'
import { MongoClient, ObjectId } from 'mongodb'


const app = express();
const publicPath = path.resolve("public")
app.use(express.static(publicPath))
app.set("view engine","ejs")

const dbName="node-project"
const collectionName="todo"
const url ="mongodb://localhost:27017"
const client = new MongoClient(url)

const connection =(async()=>{
    const connect = await client.connect()
    return await connect.db(dbName)
})

app.use(express.urlencoded({ extended: false }))
app.get("/",async (req,resp)=>{
    const db = await connection()
    const collection = db.collection(collectionName);
    const result = await collection.find({}).toArray()
    resp.render("list", { todos: result })
})
app.get("/add",(req,resp)=>{
    resp.render("add")
})
app.get("/update",(req,resp)=>{
    resp.redirect("/")
})
app.get("/update/:id",async(req,resp)=>{
    const db = await connection()
    const collection = db.collection(collectionName);
    const result = await collection.findOne({_id:new ObjectId(req.params.id)})
    if(result){
        resp.render("update", { result })
    }else{
        resp.redirect("/")
    }
})
app.post("/update/:id",async(req,resp)=>{
    const db = await connection()
    const collection = db.collection(collectionName);
    const result = await collection.updateOne(
        {_id:new ObjectId(req.params.id)},
        {$set: req.body}
    )
    if(result){
        resp.redirect("/")
    }else{
        resp.redirect(`/update/${req.params.id}`)
    }
})
app.post("/add",async(req,resp)=>{
    const db = await connection()
    const collection = db.collection(collectionName);
    const result = await collection.insertOne(req.body)
    if(result){
        resp.redirect("/")

    }else{
        resp.redirect("/add")
    }

    
})
app.get("/delete/:id",async(req,resp)=>{
    const db = await connection()
    const collection = db.collection(collectionName);
    const result = await collection.deleteOne({_id:new ObjectId(req.params.id)})
    if(result){
        resp.redirect("/")

    }else{
        resp.send("/some error")
    }

    
})
app.post("/multi-delete",async(req,resp)=>{
    const db = await connection()
    const collection = db.collection(collectionName);
    let selectedTaskIds=undefined;
    if(Array.isArray(req.body.selectedTask)){
         selectedTaskIds = req.body.selectedTask.map(id => new ObjectId(id));
    }else{
        selectedTaskIds = [new ObjectId(req.body.selectedTask)];
    }
        
    const result = await collection.deleteMany({_id: { $in: selectedTaskIds }});
    if(result){
        resp.redirect("/")
    }else{
        resp.send("/some error")
    }
})
app.listen(3200)
