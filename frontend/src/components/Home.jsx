import React, { useEffect, useRef, useState } from 'react'
import {Box, Heading, Input, useToast} from "@chakra-ui/react"
import { useDispatch, useSelector } from 'react-redux'
import { deleteContact, getContact, getSearchedContact, updateContact } from '../redux/action/contactAction';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure
} from '@chakra-ui/react'
import { NAME, PHONE_NUMBER } from '../redux/actionTypes.js/contactActionTypes';
const Home = () => {
  const selector = useSelector(store=>store.contactReducer);
  const dispatch = useDispatch();
  const [loading,setLoading] = useState(false);
  const [search,setSearch] = useState("");
  const ref = useRef();
  const toast = useToast();
  function searching(){
    if(ref.current){
      clearTimeout(ref.current);
    }
    ref.current = setTimeout(()=>{
      setLoading(true);
      dispatch(getSearchedContact(search));
      setLoading(false);
    },3000)
  }

  function deleteContactFunction(id){
    deleteContact(id,toast);
  }


  useEffect(()=>{
    setLoading(true);
    console.log(selector)
    dispatch(getContact());
    setLoading(false);
  },[])

  function updateContactFunction(id){
    
    try {
      dispatch(updateContact({id,name:selector.name,contact:selector.phoneNumber}));
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
  return (
    <Box width={"80%"} margin={"auto"} paddingTop={"3.5rem"}>
      <Box display={"flex"} margin={"auto"} w={"min-content"} padding={"1rem"}>
        <Box w={"15rem"}><Input onChange={(e)=>{setSearch(e.target.value); console.log(e.target.value); searching()}} /></Box>
        <Button onClick={()=>{
          dispatch(getContact());
        }}>Reset Search</Button>
      </Box>
        {
          selector.contacts?selector.contacts.map((e)=>(
            <Box key={e.id} marginBottom={"1rem"} display={"flex"} justifyContent={"space-between"} background={'rgba(126, 101, 159 ,0.5)'} padding={"0.5rem"} borderRadius={"0.5rem"} >
              <Box>
              <Heading >Name: {e.name}</Heading>
              <p>Contact no: {e.phone}</p>
              </Box>
              <Box>

              <EditContact id={e.id} p_name={e.name} p_phone={e.phone} updateContactFunction={updateContactFunction}/>
              <Button onClick={()=>deleteContactFunction(e.id)} >Delete</Button>
              </Box>
            </Box>
          )):<></>
        }
        
    </Box>
  )
}

function EditContact({id,p_name,p_phone,updateContactFunction}) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [name,setName] = useState(p_name);
  const [phone,setPhone] = useState(p_phone);
  const selector = useSelector(store=>store.contactReducer);
  const dispatch = useDispatch();
  function handleFormInput(e){
    console.log(e.target)
      dispatch({type:e.target.name,payload:e.target.value});
  }
  useEffect(()=>{
    dispatch({type:NAME,payload: p_name});
    dispatch({type:PHONE_NUMBER,payload:p_phone});
    console.log(p_name)
  },[isOpen, onOpen, onClose])
  return (
    <>
      <Button onClick={onOpen}>Edit</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent >
          <ModalHeader background={"linear-gradient(90deg, rgba(110,13,156,1) 0%, rgba(130,169,213,1) 100%, rgba(0,40,255,1) 100%);"}>Edit Contact</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
        <Input value={selector.name} name={`${NAME}`} onChange={(e)=>{handleFormInput(e)}} />
        <Input value={selector.phoneNumber} type='number' name={`${PHONE_NUMBER}`} onChange={(e)=>{handleFormInput(e)}}/>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={()=>{updateContactFunction(id)}}>
              Submit
            </Button>
            
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}


export default Home