import Hidden from "@material-ui/core/Hidden";
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
import Input from "@material-ui/core/Input";
import Paper from "@material-ui/core/Paper";
import { ThemeProvider } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { selectMainTheme } from "app/store/fuse/settingsSlice";
import Button from "@material-ui/core/Button";
import { useState } from "react";
import "./index.css";

function CommonHeader({ title, filterData, onAdd, search, icon, newText, onBack, isList, width }) {
  const dispatch = useDispatch();
  const mainTheme = useSelector(selectMainTheme);
console.log('wudtg', width)

  return (
    <div className="flex flex-1 items-center justify-between p-4 sm:p-24 col-12 
    header "
      style={{width: width}}
      
      >

      <div className="flex flex-shrink items-center sm:w-224">
        {onBack ? (
          <IconButton
            onClick={onBack}
            aria-label="open left sidebar"
            style={{ color: 'white' }}
          >
            <Icon>arrow_back</Icon>
          </IconButton>
        ) : null}
        <div className="flex items-center">
          <Icon
            component={motion.span}
            initial={{ scale: 0 }}
            animate={{ scale: 1, transition: { delay: 0.2 } }}
            className="text-24 md:text-32"
          >
            {icon}
          </Icon>
          <Typography
            component={motion.span}
            initial={{ x: -20 }}
            animate={{ x: 0, transition: { delay: 0.2 } }}
            delay={300}
            className="hidden sm:flex text-16 md:text-24 mx-12 font-semibold"
          >
            {title}
          </Typography>
        </div>
      </div>
      {search ? (
        <div className="flex flex-1 items-center justify-center px-8 sm:px-12">
          <ThemeProvider theme={mainTheme}>
            <Paper
              component={motion.div}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
              className="flex p-4 items-center w-full max-w-512 h-48 px-16 py-4 shadow"
            >
              <Icon color="action">search</Icon>

              <Input
                placeholder="Buscar"
                className="flex flex-1 px-16"
                disableUnderline
                fullWidth
                //  value={searchText}
                inputProps={{
                  "aria-label": "Search",
                }}
                onChange={(ev) => filterData(ev.target.value)}
              />
            </Paper>
          </ThemeProvider>
        </div>
      ) : null}

      {onAdd ? (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
        >
          <Button
            className="whitespace-nowrap"
            variant="contained"
            color="secondary"
            onClick={() => {
              onAdd();
            }}
          >
            <span className="hidden sm:flex">{newText}</span>
          </Button>
        </motion.div>
      ) : null}
    </div>
  );
}

export default CommonHeader;
