import mongoose from "mongoose";

async function dbConnection() {
    try {
        const database = await mongoose.connect(process.env.MONGODB_URI)
        console.log(`DataBase connected: ${database.connection.name}`)
    } catch (err) {
        console.log(err);
    }
}

export { dbConnection };