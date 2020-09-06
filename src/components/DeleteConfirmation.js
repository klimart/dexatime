import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const DeleteConfirmationDialog = ({confirmClose, deleteHandle, isOpen}) => (
    <div>
        <Dialog
            open={isOpen}
            TransitionComponent={Transition}
            keepMounted
            onClose={confirmClose}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description">
            <DialogTitle>{"Delete Task?"}</DialogTitle>
            <DialogContent>
            <DialogContentText>
                This action cannot be undone.
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button onClick={confirmClose} color="primary">
                Cancel
            </Button>
            <Button onClick={deleteHandle} color="primary">
                Confirm
            </Button>
            </DialogActions>
        </Dialog>
    </div>
);

export default DeleteConfirmationDialog;
