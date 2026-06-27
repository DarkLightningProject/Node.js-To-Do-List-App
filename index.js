import express from 'express'
import path from 'path'
import {MongoClient} from 'mongodb'



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
    resp.render("update")
})
app.post("/update",(req,resp)=>{
    resp.redirect("/")
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
app.listen(3200)