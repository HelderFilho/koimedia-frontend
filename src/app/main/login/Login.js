import React, { useState } from 'react'
import { yupResolver } from '@hookform/resolvers/yup';
import { motion } from 'framer-motion';
import { Controller, useForm } from 'react-hook-form';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import * as yup from 'yup';
import _ from '@lodash';
import axios from "axios";


import Constants from "app/utils/Constants";
import { useDispatch } from 'react-redux';
import CryptoJS from 'crypto-js';
const useStyles = makeStyles((theme) => ({
  root: {},
}));

const schema = yup.object().shape({
  email: yup.string().email('Você tem que adicionar um email válido').required('Você deve adicionar um email'),
  password: yup
    .string()
    .required('Por favor escreva a senha.')
    .min(4, 'Senha muito curta, ela deve ter no mínimo 6 caracteres.'),
});

const defaultValues = {
  email: '',
  password: '',
  remember: true,
};


function Login() {
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [remember, setRemember] = useState(false);
  const [wrongPass, setWrongPass] = useState(false)
  const classes = useStyles();
  const dispatch = useDispatch()

  const { control, formState, handleSubmit, reset } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });



  const { isValid, dirtyFields, errors } = formState;

  function onSubmit() {

    let email = control.fieldsRef.current.email._f.value
    let pass = control.fieldsRef.current.password._f.value
    let user = {
      email: email,
      password: pass
    }



    
    axios.post(Constants.APIEndpoints.AUTH, user).then((res) => {
      if (res.data && res.data[0]) {
        // dispatch({type :'logou'})
        setWrongPass(false)
        var user = CryptoJS.AES.encrypt(JSON.stringify(res.data[0]), '%762t8duyg!20').toString();
        remember ? localStorage.setItem('user', user) : sessionStorage.setItem('user', user)
        window.location = '/'

      }else{
        setWrongPass(true)
      }
    }).catch(e => {
      setWrongPass(true)
      console.log(e)
    })


  }

  return (
    <div
      className={clsx(
        classes.root,
        'flex flex-col flex-auto items-center justify-center p-16 sm:p-32'
      )}
    >
      <div className="flex flex-col items-center justify-center w-full">
        <motion.div initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}>
          <Card className="w-full max-w-384">
            <CardContent className="flex flex-col items-center justify-center p-16 sm:p-24 md:p-32">
              <img className="w-128 m-32" src="assets/images/logos/koimedia_logo.png" alt="logo" />

              <Typography variant="h6" className="mt-16 mb-24 font-semibold text-18 sm:text-24">
                Entre em sua conta
              </Typography>

              <form
                name="loginForm"
                noValidate
                className="flex flex-col justify-center w-full"
                onSubmit={handleSubmit(onSubmit)}
              >
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      className="mb-16"
                      label="Email"
                      autoFocus
                      type="email"
                      error={!!errors.email}
                      helperText={errors?.email?.message}
                      variant="outlined"
                      required
                      fullWidth
                    />
                  )}
                />

                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      className="mb-16"
                      label="Senha"
                      type="password"
                      error={!!errors.password}
                      helperText={errors?.password?.message}
                      variant="outlined"
                      required
                      fullWidth
                    />
                  )}
                />
                {wrongPass ? (
                <label style={{ color: 'red', fontSize: 10, textAlign: 'center', marginTop: -8, marginBottom: 6 }}>Login e/ou senha inválidos</label>
                ): null}
               <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start">

                  <input type="checkbox" onChange={() => setRemember(!remember)} />
                  <label style={{ marginLeft: 10 }}>Lembre de mim</label>
                </div>

                <Button
                  variant="contained"
                  color="primary"
                  className="w-224 mx-auto mt-16"
                  aria-label="LOG IN"
                  disabled={_.isEmpty(dirtyFields) || !isValid}
                  type="submit"
                >
                  Login
                </Button>
              </form>

              {/*
              <div className="my-24 flex items-center justify-center">
                <Divider className="w-32" />
                <span className="mx-8 font-semibold">OR</span>
                <Divider className="w-32" />
              </div>

              <Button variant="contained" color="secondary" size="small" className="w-192 mb-8">
                Log in with Google
              </Button>

              <Button variant="contained" color="primary" size="small" className="w-192">
                Log in with Facebook
              </Button>

              <div className="flex flex-col items-center justify-center pt-32 pb-24">
                <span className="font-normal">Don't have an account?</span>
                <Link className="font-normal" to="/pages/auth/register">
                  Create an account
                </Link>
              </div>
            */}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default Login;
