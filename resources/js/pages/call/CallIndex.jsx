import React from "react";
import "../../assets/styles/call.css";
import PropTypes from 'prop-types';
import Modal from '@mui/base/Modal';
import clsx from 'clsx';
import { styled, Box } from '@mui/system';
import UpsInput from "../../Components/UpsInput";
import VideoRoom from "./VideoRoom";
// import Modal from '@mui/base/Modal';

function CallIndex(){
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return(
        <div className="call-wrapper">
           <div className="create-meeting" type="button" onClick={handleOpen} >
            <h1>Create a Call</h1>
           </div>
           <VideoRoom/>
           <StyledModal
                aria-labelledby="unstyled-modal-title"
                aria-describedby="unstyled-modal-description"
                open={open}
                onClose={handleClose}
                slots={{ backdrop: StyledBackdrop }}
            >
                <Box sx={style}>
                <label>Get the Token For Invites</label>
                <UpsInput id="chatid" name="chatid" type="text" placeholder="" value="sdsadmsamd"/>
                <p id="unstyled-modal-description">Aliquid amet deserunt earum!</p>
                </Box>
            </StyledModal>
        </div> 
    )
}

const Backdrop = React.forwardRef((props, ref) => {
    const { open, className, ...other } = props;
    return (
      <div
        className={clsx({ 'MuiBackdrop-open': open }, className)}
        ref={ref}
        {...other}
      />
    );
  });
  
  Backdrop.propTypes = {
    className: PropTypes.string.isRequired,
    open: PropTypes.bool,
  };
  
  const blue = {
    200: '#99CCF3',
    400: '#3399FF',
    500: '#007FFF',
  };
  
  const grey = {
    50: '#f6f8fa',
    100: '#eaeef2',
    200: '#d0d7de',
    300: '#afb8c1',
    400: '#8c959f',
    500: '#6e7781',
    600: '#57606a',
    700: '#424a53',
    800: '#32383f',
    900: '#24292f',
  };
  
  const StyledModal = styled(Modal)`
    position: fixed;
    z-index: 1300;
    right: 0;
    bottom: 0;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  `;
  
  const StyledBackdrop = styled(Backdrop)`
    z-index: -1;
    position: fixed;
    right: 0;
    bottom: 0;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
    -webkit-tap-highlight-color: transparent;
  `;
  
  const style = (theme) => ({
    width: 400,
    borderRadius: '12px',
    padding: '16px 32px 24px 32px',
    backgroundColor: theme.palette.mode === 'dark' ? '#0A1929' : 'white',
    boxShadow: `0px 2px 24px ${theme.palette.mode === 'dark' ? '#000' : '#383838'}`,
  });
  


export default CallIndex;