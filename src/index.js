import express from "express";
import dotenv from "dotenv";
import mongoose from 'mongoose';
import {Post} from './Posts/index.js'
import { lndClient } from "./lndclient/index.js";
import cors from 'cors'

dotenv.config()
const app = express();

// database connection
mongoose.set("strictQuery", false);
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(process.env.MONGO_URL);
  console.log("db connected")

}

app.use(express.json())
app.use(express.urlencoded({ extended: true}))
app.use(cors())

app.get("/", (req, res) => {

    return res.send({
        message: "Hello from backend!"
    })
})

// Add Post

app.post('/post/new', async (req, res) => {
    const { title, body } = req.body;

    // create post 
    const newPost = await Post.create({
        title,
        body
    })

    return res.send({
        success:true,
        msg: "Message was created",
        data: newPost
    });
});

app.get("/posts", async(req, res) => {

    const allPosts = await Post.find({})
    return res.send({
        success:true,
        msg: "All Posts",
        data: allPosts
    });
})
app.get("/post/:id", async(req, res) => {

    const getPost = await Post.findOneById(req.params.id)
    return res.send({
        success:true,
        msg: "Post Retrieved",
        data: getPost
    });
});

app.get('/create/invoice', async(req, res) => {

   try{
    let client = await lndClient()

    // create invoice

    const invoice = await client.addInvoice({
        memo: "article memo",
        value: 100,
        expiry: "200"
    })

    return res.send({
        success: true,
        msg: "please pay the invoice",
        data: {
            pr: invoice.paymentRequest,
            rhash: Buffer.from(invoice.rHash).toString("hex")
        }
    })
   }catch(err){
    console.log(err)
   }

})


app.get('/verify-payment', async(req, res) => {
    const hash = req.query.ph 
   try {
    const client = await lndClient()
    const buff = Buffer.from(hash, "hex")
    const invoice = await client.lookupInvoice({ rHash: buff})
    if(invoice.settled){
        return res.send({
            success: true,
            msg: 'invoice is settled'
        })

    }else{
        return res.send({
            success: false,
            msg: "invoice not settled"
        })
    }
   } catch (error) {
    console.log(error)
   }



})
app.listen(process.env.PORT || 1759, () => {
    console.log(`Server is Running on port ${process.env.PORT}`)
})
