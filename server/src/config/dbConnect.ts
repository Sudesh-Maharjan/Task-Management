// import mongoose from "mongoose";
// import {config} from './env';

// export const connectToDB = async () => {
//    const connectionURL = config.mongoDbConnectionUrl;

//    if(connectionURL) {
//       try {
//          await mongoose.connect(connectionURL);
//          console.log('Connected to database successfully!');
//       } catch (error) {
//          console.log('Connection to DB failed!', error);
//       }
//    }
// };