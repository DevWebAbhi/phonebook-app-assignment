import { Box, Button, Input, useToast, FormControl, FormLabel } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NAME, PHONE_NUMBER } from '../redux/actionTypes.js/contactActionTypes';
import { createContact } from '../redux/action/contactAction';

const CreateContact = () => {
  const selector = useSelector(store => store.contactReducer);
  const dispatch = useDispatch();
  const toast = useToast();
  const [errors, setErrors] = useState({ name: "", phoneNumber: "" });


  function validateForm() {
    let valid = true;
    let errorMessages = { name: "", phoneNumber: "" };


    if (!selector.name || selector.name.trim() === "") {
      valid = false;
      errorMessages.name = "Name is required.";
    }


    if (!selector.phoneNumber || selector.phoneNumber.trim() === "") {
      valid = false;
      errorMessages.phoneNumber = "Phone number is required.";
    } else if (!/^\d+$/.test(selector.phoneNumber)) {
      valid = false;
      errorMessages.phoneNumber = "Phone number must be numeric.";
    }

    setErrors(errorMessages);
    return valid;
  }


  function create(e) {
    e.preventDefault();

 
    if (!validateForm()) {
      toast({
        title: "Form validation failed",
        description: "Please correct the highlighted errors",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      dispatch(createContact({ name: selector.name, contact: selector.phoneNumber },toast));
      
    } catch (error) {
      console.log(error)
    }
  }

  
  function handleFormInput(e) {
    dispatch({ type: e.target.name, payload: e.target.value });
  }

  return (
    <Box width="50%" margin="auto" padding="2rem" boxShadow="md" borderRadius="md" backgroundColor="white">
      <form onSubmit={create}>
        <FormControl isInvalid={errors.name !== ""} mb={4}>
          <FormLabel>Name</FormLabel>
          <Input
            type="text"
            name={`${NAME}`}
            placeholder="Enter name"
            onChange={handleFormInput}
            value={selector.name || ""}
          />
          {errors.name && <Box color="red.500">{errors.name}</Box>}
        </FormControl>

        <FormControl isInvalid={errors.phoneNumber !== ""} mb={4}>
          <FormLabel>Phone Number</FormLabel>
          <Input
            type="number"
            name={`${PHONE_NUMBER}`}
            placeholder="Enter phone number"
            onChange={handleFormInput}
            value={selector.phoneNumber || ""}
          />
          {errors.phoneNumber && <Box color="red.500">{errors.phoneNumber}</Box>}
        </FormControl>

        <Button type="submit" colorScheme="blue" width="full" mt={4}>
          Create Contact
        </Button>
      </form>
    </Box>
  );
};

export default CreateContact;
