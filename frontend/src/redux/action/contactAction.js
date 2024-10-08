import axios from "axios";
import { GET_ALL_CONTACTS } from "../actionTypes.js/contactActionTypes";


export const getContact = (setLoading,setErrorBool)=>async(dispatch)=>{
    try {
        setLoading(true);
        setErrorBool(false);
        const get = await axios.get(`https://phonebook-app-assignment.onrender.com/contact`);
        console.log(get)
        dispatch({type:GET_ALL_CONTACTS,payload:get.data.contacts[0]});
        return get;
    } catch (error) {
        console.log(error)
        setErrorBool(true);
        return error;
    }finally{
        setLoading(false);
    }
}

export const getSearchedContact = (search,toast,setLoading,setErrorBool)=>async(dispatch)=>{
    console.log(search)
    try {
        setLoading(true);
        setErrorBool(false);
        const get = await axios.get(`https://phonebook-app-assignment.onrender.com/contact/search`,{params:{search}});
        console.log(get)
        toast({
            title: 'successfully searched',
            status: 'success',
            duration: 9000,
            isClosable: true,
          });
        dispatch({type:GET_ALL_CONTACTS,payload:get.data.contacts[0]});
        return get;
    } catch (error) {
        console.log(error)
        toast({
            title: 'Search failed',
            status: 'error',
            duration: 9000,
            isClosable: true,
          });
          setErrorBool(true);
          return error;
      }finally{
          setLoading(false);
      }
}

export const createContact =async(data,toast)=>{
    try {
        const post = await axios.post(`https://phonebook-app-assignment.onrender.com/contact/create`,data);
        console.log(post)
        toast({
            title: 'Contact created successfully',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
          
        return post;
    } catch (error) {
        console.log(error)
        toast({
            title: 'Contact creation failed',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        return error;
    }
}

export const updateContact =async(data,toast)=>{
    try {
        const post = await axios.patch(`https://phonebook-app-assignment.onrender.com/contact/update`,data);
        console.log(post)
        toast({
            title: 'Updated successfully',
            status: 'success',
            duration: 9000,
            isClosable: true,
          });
         
        return post;
    } catch (error) {
        console.log(error)
        toast({
            title: 'Updated failed',
            status: 'error',
            duration: 9000,
            isClosable: true,
          });
        return error;
    }
}

export const deleteContact =async(id,toast)=>{
    try {

        const createAvaliablity = await axios.delete(`https://phonebook-app-assignment.onrender.com/contact/delete/${id}`);
        console.log(createAvaliablity)
        toast({
            title: 'sucessfully Deleted',
            status: 'success',
            duration: 9000,
            isClosable: true,
          })
          
        return createAvaliablity;
    } catch (error) {
        toast({
            title: 'Failed deletion',
            status: 'error',
            duration: 9000,
            isClosable: true,
          })
        console.log(error)
        return error;
    }
}

export const createAvaliablity =async(data,toast)=>{
    try {
        console.log(data)
        const createAvaliablity = await axios.post(`https://phonebook-app-assignment.onrender.com/avalivility/post`,data);
        console.log(createAvaliablity)
        toast({
            title: 'sucessfully created',
            status: 'success',
            duration: 9000,
            isClosable: true,
          })
        return createAvaliablity;
    } catch (error) {
        toast({
            title: 'Failed creation',
            status: 'success',
            duration: 9000,
            isClosable: true,
          })
        console.log(error)
        return error;
    }
}

export const deleteAvaliablity =async(id,date,toast,update)=>{
    try {
       
        const createAvaliablity = await axios.delete(`https://phonebook-app-assignment.onrender.com/avalivility/delete/${id}/${date}`);
        console.log(createAvaliablity)
        toast({
            title: 'sucessfully Deleted',
            status: 'success',
            duration: 9000,
            isClosable: true,
          })
          update();
        return createAvaliablity;
    } catch (error) {
        toast({
            title: 'Failed Deletion',
            status: 'success',
            duration: 9000,
            isClosable: true,
          })
        console.log(error)
        return error;
    }
}