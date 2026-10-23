import { useContext } from 'react';

import { Dialog, Typography, List, ListItem, Box, styled, Button } from '@mui/material';

import { GoogleLogin } from '@react-oauth/google';
import jwt_decode from "jwt-decode";

import { addUser } from '../../service/api';
import { AccountContext } from '../../context/AccountProvider';
import { qrCodeImage } from '../../constants/data';

const Component = styled(Box)`
    display: flex; 
`;

const Container = styled(Box)`
    padding: 56px 0 56px 56px;
`;

const QRCOde = styled('img')({
    margin: '50px 0 0 50px',
    height: 264,
    width: 264
});

const Title = styled(Typography)`
    font-size: 26px;
    margin-bottom: 25px;
    color: #525252;
    font-family: Segoe UI,Helvetica Neue,Helvetica,Lucida Grande,Arial,Ubuntu,Cantarell,Fira Sans,sans-serif;
    font-weight: 300;
`;

const StyledList = styled(List)`
    &  > li {
        padding: 0;
        margin-top: 15px;
        font-size: 18px;
        line-height: 28px;
        color: #4a4a4a;
    }
`;

const dialogStyle = {
    marginTop: '12%',
    height: '95%',
    width: '60%',
    maxWidth: '100',
    maxHeight: '100%',
    borderRadius: 0,
    boxShadow: 'none',
    overflow: 'hidden'
}

const LoginDialog = () => {

    const { setAccount, setShowloginButton, setShowlogoutButton } = useContext(AccountContext);

    const onLoginSuccess = async (res) => {
        let decoded = jwt_decode(res.credential);
        setAccount(decoded);
        setShowloginButton(false);
        setShowlogoutButton(true);
        await addUser(decoded);
    };

    const onLoginFailure = (res) => {
        console.log('Login Failed:', res);
    };

    // এটি হলো লগইন বাইপাস করার কাস্টম ফাংশন
    const handleBypassLogin = async () => {
        const fakeUser = {
            name: "Joyanta Kumar",
            email: "joyanta@test.com",
            picture: "https://w3schools.com"
        };
        setAccount(fakeUser);
        setShowloginButton(false);
        setShowlogoutButton(true);
    };

    return (
        <Dialog
            open={true}
            BackdropProps={{style: {backgroundColor: 'unset'}}}
            maxWidth={'md'}
            PaperProps={{ sx: dialogStyle }}
        >
            <Component>
                <Container>
                    <Title>To use WhatsApp on your computer:</Title>
                    <StyledList>
                        <ListItem>1. Open WhatsApp on your phone</ListItem>
                        <ListItem>2. Tap Menu Settings and select WhatsApp Web</ListItem>
                        <ListItem>3. Point your phone to this screen to capture the code</ListItem>
                    </StyledList>
                </Container>
                <Box style={{position:'relative', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <QRCOde src={qrCodeImage} alt="QR Code" />
                    
                    {/* এখানে আমরা টেস্টিং বাটনটি মেইন পজিশনে বসালাম */}
                    <Box style={{marginTop: '20px'}}>
                        <Button 
                            variant="contained" 
                            color="success" 
                            onClick={handleBypassLogin}
                            style={{fontWeight: 'bold', padding: '10px 20px'}}
                        >
                            Click to Login & Test
                        </Button>
                    </Box>

                    <Box style={{position: 'absolute', top: '35%', transform: 'translateX(25%) translateY(-25%)'}}>
                        <GoogleLogin
                            buttonText=""
                            onSuccess={onLoginSuccess}
                            onError={onLoginFailure}
                        />
                    </Box>
                </Box>
            </Component>
        </Dialog>
    )
}

export default LoginDialog;
