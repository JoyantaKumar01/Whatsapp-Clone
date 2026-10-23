import mongoose from 'mongoose';


const Connection = async (username, password) => {
    
    const URL = `mongodb+srv://${username}:${password}@cluster0.3vwbe8p.mongodb.net/WHATSAPPCLONE?retryWrites=true&w=majority`;
    
    try {
        await mongoose.connect(URL, { useUnifiedTopology: true, useNewUrlParser: true });
        console.log('Database Connected Successfully');
    } catch(error) {
        console.log('Error while connecting with the database: ', error.message);
    }
};

export default Connection;
