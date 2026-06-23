import express from 'express'



const app = express();

app.set("view engine","ejs")

app.get("/",(req,resp)=>{
    resp.render("list")
})
app.get("/add",(req,resp)=>{
    resp.render("add")
})
app.get("/update",(req,resp)=>{
    resp.render("update")
})
app.listen(3200)