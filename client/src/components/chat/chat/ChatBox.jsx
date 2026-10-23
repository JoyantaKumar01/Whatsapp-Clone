import { useContext, useState, useEffect } from 'react';

import { Box } from '@mui/material';

import { UserContext } from '../../../context/UserProvider';
import { AccountContext } from '../../../context/AccountProvider';
import { getConversation } from '../../../service/api';

//components
import ChatHeader from './ChatHeader';
import Messages from './Messages';

const ChatBox = () => {
    const { person } = useContext(UserContext);
    const { account } = useContext(AccountContext);

    const [conversation, setConversation] = useState({});
    
    // ১. কনভারসেশন আইডি নিয়ে আসার useEffect (ডিপেন্ডেন্সি ফিক্সড)
    useEffect(() => {
        const getConversationDetails = async () => {
            if (account?.sub && person?.sub) {
                let data = await getConversation({ senderId: account.sub, receiverId: person.sub });
                setConversation(data);
            }
        }
        getConversationDetails();
    }, [person.sub, account.sub]); // এখানে account.sub যুক্ত করা হয়েছে ওয়ার্নিং দূর করার জন্য

    return (
        <Box style={{height: '75%'}}>
            <ChatHeader person={person} />
            <Messages person={person} conversation={conversation} />
        </Box>
    )
}

export default ChatBox;
