import { Server } from 'socket.io';

const io = new Server(9000, {
    cors: {
        // origin: 'http://localhost:3000' এর পরিবর্তে '*' করা হলো 
        // এর ফলে আপনার ব্রাউজার লোকালহোস্ট বা আইপি (192.168.x.x) যা-ই ব্যবহার করুক, কানেকশন ব্লক হবে না।
        origin: '*', 
    }, 
})

let users = [];

const addUser = (userData, socketId) => {
    // ডুপ্লিকেট ইউজার এড়াতে এবং সকেট আইডি আপডেট নিশ্চিত করতে ফিক্সড লজিক
    if (userData && userData.sub) {
        users = users.filter(user => user.sub !== userData.sub);
        users.push({ ...userData, socketId });
    }
}

const removeUser = (socketId) => {
    users = users.filter(user => user.socketId !== socketId);
}

const getUser = (userId) => {
    return users.find(user => user.sub === userId);
}

io.on('connection',  (socket) => {
    console.log('user connected')

    // ১. ইউজার কানেক্ট করা ও লিস্ট আপডেট
    socket.on("addUser", userData => {
        addUser(userData, socket.id);
        io.emit("getUsers", users);
    })

    // ২. মেসেজ পাঠানো (ক্র্যাশ প্রোটেকশন সহ ১০০% ফিক্সড লজিক)
    socket.on('sendMessage', (data) => {
        if (data && data.receiverId) {
            const user = getUser(data.receiverId);
            // যদি ইউজার অনলাইনে থাকে এবং তার সকেট আইডি পাওয়া যায়, তবেই মেসেজ পুশ হবে
            if (user && user.socketId) {
                io.to(user.socketId).emit('getMessage', data);
            }
        }
    })

    // ৩. ডিসকানেক্ট করা
    socket.on('disconnect', () => {
        console.log('user disconnected');
        removeUser(socket.id);
        io.emit('getUsers', users);
    })
})
