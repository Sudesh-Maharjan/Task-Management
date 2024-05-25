import express, {Request, Response} from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userRoutes from './routes/v1/Users/index';
import taskRoutes from './routes/v1/Tasks/index';
import cors from 'cors';
dotenv.config();

const app = express();
const port = process.env.PORT|| 8000;
//CORS
app.use(cors({
   origin: 'http://localhost:5173', 
   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
   credentials: true, 
 }));
 
app.use(express.json());

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/tasks', taskRoutes);


mongoose.connect(`mongodb+srv://sudesh:admin123@taskmanagement.amqqiom.mongodb.net/taskmanagement?retryWrites=true&w=majority&appName=Taskmanagement`)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

app.listen(port, () =>{
   console.log(`Now listening on port ${port}`);
})