const express = require('express');
const mongoose = require('mongoose')
const app = express();

const UserRouter = require('./routes/userRouter');
require('dotenv').config();
const cors = require('cors');
app.use(express.json());
app.use(cors());
app.use('/api/user', UserRouter);

const PORT = process.env.PORT || 3000;
mongoose.set("strictQuery", false)

// mongoose.connect(process.env.MONGO_URI)
//    .then(() => {
//        app.listen(process.env.PORT, () => {
//            console.log("Database connected successfully and server is listening on this port 5000");
//        });
//    })
//    .catch((err) => {
//        console.log(err);
//        // process.exit(1);
//    });
   const connectDB = async () =>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch(error) {
        console.log(error);
        process.exit(1);
    }
   }
//Routes go here
  app.get("/", (req, res) => {
    res.send("Server Started");
  });

   connectDB().then(() => {
   app.listen(PORT, ()=> {
   console.log(`Listening on Port ${PORT}`);
   })
   })
