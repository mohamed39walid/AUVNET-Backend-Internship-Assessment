const express = require("express")
const dotenv = require("dotenv")
const sequelize = require("./config/db")
const { User, Product, Category, Wishlist } = require('./models');


dotenv.config()
const app = express()
app.use(express.json())



app.get("/",(req,res)=> res.send("Project with the mysql running"))



sequelize.authenticate()
  .then(() => console.log('MySQL connected...'))
  .catch(err => console.error('Error: ', err));



const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log("the app is running on the port 5000")) 