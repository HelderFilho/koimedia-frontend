import {
  Button,
  Dialog,
  AppBar,
  Toolbar,
  Typography,
  DialogActions,
  DialogContent,
  Icon,
  IconButton
} from "@material-ui/core";

import { useRef } from "react";
import { useReactToPrint } from 'react-to-print';
import { motion } from "framer-motion";


export default function CommonDialog(props) {
   let { open, onClose, title, keepMounted, width, fullWidth, keep, print} = props
   const componentRef = useRef();
   const handlePrint = useReactToPrint({
     content: () => componentRef.current,
   });

  return (
    <div>
      <Dialog
        aria-labelledby="settings-panel"
        aria-describedby="settings"
        open={open}
        keepMounted = {keepMounted}
        onClose={keep ? () => {} : onClose}
        BackdropProps={{ invisible: true }}
        maxWidth = {width}
        fullWidth = {fullWidth}
      
      
      >
        <AppBar position="static" elevation={0}>
          <Toolbar className="flex w-full">
          <div style={{display: 'flex', width: '100%', justifyContent: 'space-between'}}>
          <Typography
            component={motion.span}
            initial={{ x: -20, y: -10 }}
            animate={{ x: 20, y:10, transition: { delay: 0.2 } }}
            delay={300}
            className="hidden sm:flex text-16 md:text-24 mx-12 font-semibold"
          >
            {title}
          </Typography>
        <div style = {{display: 'flex', width: '5%',justifyContent: 'space-between'}}>
{print ? (
                <IconButton
              onClick = {handlePrint}
              style = {{color: 'white'}}
            >
              <Icon>print</Icon>
            
        </IconButton>      
):null}
        <IconButton
              onClick={onClose}
              style = {{color: 'white'}}
>
              <Icon>close</Icon>
            
        </IconButton>      
            </div>
            </div>
          </Toolbar>
        </AppBar>
        <DialogContent ref= {componentRef}>
            {props.children}
        </DialogContent>
      </Dialog>

    </div>
  );
}
