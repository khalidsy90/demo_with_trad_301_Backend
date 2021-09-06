'use strict'
let express = require('express')
require('dotenv').config()
let cors=require('cors')
const axios=require('axios')
const server=new express()
server.use(cors())
server.use(express.json())
const bookModel=require('./modules/mongo')
server.get('/',(request,response)=>{
    response.send("Welcome with main route")
})




server.put('/books/:bookid',async (request,response) =>{
    let bookid=request.params.bookid
    let info=request.body
    console.log(bookid);
    console.log(info);
    await bookModel.findByIdAndUpdate(bookid,{
        title:info.title,
        subtitle:info.subtitle,
        price:info.price,
        image:info.image,
        email:info.email
    },(error,data)=>{
        if (error) {
            response.send(error)
        }else{
              bookModel.find({email:info.email},(err,favBooks)=>{
                err?response.send(err):response.send(favBooks);
            })
        }
    })
})

server.delete('/books/:bookid/:email',(request,response) =>{
    let {bookid,email}=request.params
    bookModel.deleteOne({_id:bookid,email:email},(error,data) =>{
        if(error){
            response.send(error)
        }else{
            bookModel.find({email:email},(err,data)=>{
                response.send(data)
            })
        }
    })
})

server.get('/favbooks',async (request,response) =>{
    
    let email= request.query.email
    await bookModel.find({email},(err,favBooks)=>{
        err?response.send(err):response.send(favBooks);
    })
})


server.post('/books',async(request,response) =>{
    let {title,subtitle,price,image,email}=request.body
    await new bookModel({title,subtitle,price,image,email}).save();

    bookModel.find({email},(err,favBooks)=>{
        err?response.send(err):response.send(favBooks);
    })
})



//https://api.itbook.store/1.0/search/java
server.get('/books',async(request,response)=>{
let bookName=request.query.bookName;
console.log(bookName);
let result=await axios.get(`${process.env.BOOKSLINK}${bookName}`)
// console.log(result.data.books)
    response.send(result.data.books)
})

server.listen(process.env.PORT,()=>{
    console.log('its OK');
})