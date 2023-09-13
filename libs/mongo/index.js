// db.js
import mongoose from "mongoose";

export async function connectToDatabase() {
  if (mongoose.connection.readyState == 1) {
    return mongoose.connection.asPromise()
  }
  console.log('connecting db')
  await mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('db connected')
}

