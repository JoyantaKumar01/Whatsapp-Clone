import { useState, useEffect, useContext, useRef } from 'react';
import { Box, styled } from '@mui/material';

import { getMessages, newMessages } from '../../../service/api';
import { AccountContext } from '../../../context/AccountProvider';

//components
import Message from './Message';
import Footer from './Footer';

const Wrapper = styled(Box)`
    background-image: url(${'https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png'});
    background-size: 50%;
`;

const Component = styled(Box)`
    height: 80vh;
    overflow-y: scroll;
`;

const Container = styled(Box)`
    padding: 1px 80px;
`;

const Messages = ({ person, conversation }) => {

    const [messages, setMessages] = useState([]);
    const [incomingMessage, setIncomingMessage] = useState(null);
    const [value, setValue] = useState('');
    const [file, setFile] = useState();
    const [image, setImage] = useState('');

    const scrollRef = useRef();

    const { account, socket, newMessageFlag, setNewMessageFlag } = useContext(AccountContext);

    // ১. রিয়েল-টাইম মেসেজ লিসেনার (ক্লিনআপ ফাংশনসহ ফিক্সড কোড)
    useEffect(() => {
        const socketCurrent = socket.current;

        if (socketCurrent) {
            socketCurrent.on('getMessage', data => {
                setIncomingMessage({
                    ...data,
                    createdAt: Date.now()
                });
            });
        }
        
        return () => {
            if (socketCurrent) {
                socketCurrent.off('getMessage');
            }
        };
    }, [socket]);
    
    // ২. ডেটাবেজ থেকে মেসেজ নিয়ে আসা
    useEffect(() => {
        const getMessageDetails = async () => {
            if (conversation?._id) {
                let data = await getMessages(conversation._id);
                setMessages(data);
            }
        }
        getMessageDetails();
    }, [conversation?._id, person._id, newMessageFlag]);

    // ৩. অটোমেটিক স্ক্রল ডাউন
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // ৪. ইনকামিং মেসেজ চ্যাটে পুশ করা
    useEffect(() => {
        incomingMessage && conversation?.members?.includes(incomingMessage.senderId) && 
            setMessages((prev) => [...prev, incomingMessage]);
        
    }, [incomingMessage, conversation]);

    const receiverId = conversation?.members?.find(member => member !== account.sub);
    
    // ৫. মেসেজ পাঠানো
    const sendText = async (e) => {
        let code = e.keyCode || e.which;
        if(!value && !file) return;

        if(code === 13) { 
            let message = {};
            if (!file) {
                message = {
                    senderId: account.sub,
                    receiverId: receiverId,
                    conversationId: conversation._id,
                    type: 'text',
                    text: value
                };
            } else {
                message = {
                    senderId: account.sub,
                    conversationId: conversation._id,
                    receiverId: receiverId,
                    type: 'file',
                    text: image
                };
            }

            if (socket.current) {
                socket.current.emit('sendMessage', message);
            }

            await newMessages(message);

            setValue('');
            setFile();
            setImage('');
            setNewMessageFlag(prev => !prev);
        } 
    }

    return (
        <Wrapper>
            <Component>
                {
                    messages && messages.map((message, index) => (
                        <Container key={message._id || index} ref={scrollRef}>
                            <Message message={message} />
                        </Container>
                    ))
                }
            </Component>
            <Footer 
                sendText={sendText} 
                value={value} 
                setValue={setValue} 
                setFile={setFile} 
                file={file} 
                setImage={setImage}
            />
        </Wrapper>
    )
}

export default Messages;
