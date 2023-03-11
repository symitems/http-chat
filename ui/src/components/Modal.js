import React, { useContext } from 'react';
import ReactDOM from 'react-dom';
import ModalContext from '../contexts/ModalContext';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';

const NotificationModal = () => {

    const renderModal = modalHookState => {
        const [isModalShown, setModalIsShown] = modalHookState.isModalShown;
        const modalTitle = modalHookState.modalTitle[0];
        const modalMessage = modalHookState.modalMessage[0];
        return (
            <Dialog
                open={isModalShown}
                onClose={() => setModalIsShown(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    {modalTitle}
                </DialogTitle>
                <DialogContent>
                    <Typography variant="h6">
                        {modalMessage}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setModalIsShown(false)} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        );
    };

    // Contextの値を取得して開閉制御
    const modalHookState = useContext(ModalContext);
    return ReactDOM.createPortal(
        renderModal(modalHookState),
        document.querySelector('#root'),
    );
};

export default NotificationModal;
