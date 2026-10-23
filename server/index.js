import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

import Connection from './database/db.js';
import Routes from './routes/Routes.js';

dotenv.config();
const app = express();

const PORT = 8000;

// ১. মিডলওয়্যারগুলো আগে সেট করতে হবে (এপিআই রিকোয়েস্ট ডেটা পার্স করার জন্য)
app.use(cors());
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

// ২. রাউটস ডেফিনিশন (মিডলওয়্যারের ঠিক নিচে)
app.use('/', Routes);

const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;

Connection(username, password);

// ৩. সার্ভার লিসেন সবার নিচে থাকবে
app.listen(PORT, () => console.log(`Server is running successfully on PORT ${PORT}`));
