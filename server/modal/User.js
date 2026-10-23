import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    // চ্যাট অ্যাপের জন্য মূল প্রয়োজনীয় ফিল্ডগুলো required রাখা হলো
    sub: {
        type: String,
        required: true,
        unique: true // একই ইউজার যেন ডুপ্লিকেট না হয়
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    picture: {
        type: String,
        required: true
    },
    
    // বাকি ফিল্ডগুলো থেকে required: true বাদ দেওয়া হলো যাতে ডেটা মিসিং থাকলেও সার্ভার ক্র্যাশ না করে
    aud: { type: String },
    azp: { type: String },
    email_verified: { type: Boolean },
    exp: { type: Number },
    family_name: { type: String },
    given_name: { type: String },
    iat: { type: Number },
    iss: { type: String },
    jti: { type: String },
    nbf: { type: Number }
}, {
    timestamps: true // এটি দিলে ইউজার কখন তৈরি হলো তা অটো ট্র্যাক থাকবে
});

const user = mongoose.model('user', userSchema);

export default user;
