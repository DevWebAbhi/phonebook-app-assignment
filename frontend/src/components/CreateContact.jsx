import { Box, useToast } from '@chakra-ui/react'
import React from 'react'
import {useDispatch, useSelector} from "react-redux";

import { NAME, PHONE_NUMBER } from '../redux/actionTypes.js/contactActionTypes';
import { createContact } from '../redux/action/contactAction';
const CreateContact = () => {
  const selector = useSelector(store=>store.contactReducer);
  const dispatch = useDispatch();
  const toast = useToast();
  function create(e){
    e.preventDefault();
    try {
      dispatch(createContact({name:selector.name,contact:selector.phoneNumber}));
      toast({
        title: 'created sucessfully',
        status: 'success',
        duration: 9000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: 'Something went wrong',
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
    }
  }

  function handleFormInput(e){
    console.log(e.target)
      dispatch({type:e.target.name,payload:e.target.value});
  }
  return (
    <Box>
      <form action="" onSubmit={create}>
        <input type='text' name={`${NAME}`} onChange={(e)=>{handleFormInput(e)}}/>
        <input type='number' name={`${PHONE_NUMBER}`} onChange={(e)=>{handleFormInput(e)}}/>
        <input type='submit' />
      </form>
    </Box>
  )
}

export default CreateContact