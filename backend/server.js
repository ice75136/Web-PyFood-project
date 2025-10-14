import express from 'express'
import cors from 'cors'
import 'dotenv/config'
// import connectDB from './config/mongodb.js'
// import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'
import './config/db.js'
import addressRouter from './routes/addressRoute.js'
import db from './models/index.js'

// App Config
const app = express()
const port = process.env.PORT || 4000

db.sequelize.sync().then(() => {
    console.log('✅ Database & tables synced!');
});
// connectDB() เอาออก
// connectCloudinary() เอาออก

// middlewares
app.use(express.json())
app.use(cors())

// api endpoints
app.use('/api/user',userRouter)
app.use('/api/product',productRouter)
app.use('/api/cart',cartRouter)
app.use('/api/order',orderRouter)
app.use('/api/address',addressRouter)

app.get('/',(req,res)=>{
    res.send("API Working")
})

app.listen(port, ()=> console.log('Server startend on PORT : '+ port))
