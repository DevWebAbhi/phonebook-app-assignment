import React, { useEffect, useRef, useState } from 'react';
import { Box, Heading, Input, Button, useToast, SimpleGrid, Text, Tooltip } from "@chakra-ui/react";
import { useDispatch, useSelector } from 'react-redux';
import { deleteAvaliablity, deleteContact, getContact, getSearchedContact, updateContact } from '../redux/action/contactAction';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure
} from '@chakra-ui/react';
import { createAvaliablity } from '../redux/action/contactAction';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { NAME, PHONE_NUMBER } from '../redux/actionTypes.js/contactActionTypes';
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from '@chakra-ui/react'
const Home = () => {
  const selector = useSelector(store => store.contactReducer);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef();
  const toast = useToast();

  function searching() {
    if (ref.current) {
      clearTimeout(ref.current);
    }
    ref.current = setTimeout(() => {
      setLoading(true);
      dispatch(getSearchedContact(search));
      setLoading(false);
    }, 3000);
  }

  function deleteContactFunction(id) {
    deleteContact(id, toast);
  }

  useEffect(() => {
    setLoading(true);
    dispatch(getContact());
    setLoading(false);
  }, []);

  function updateContactFunction(id) {
    try {
      dispatch(updateContact({ id, name: selector.name, contact: selector.phoneNumber }));
      toast({
        title: 'Updated successfully',
        status: 'success',
        duration: 9000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Something went wrong',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
  }

 
  const isUnavailable = (availability) => {
    const currentTime = new Date();
    return availability.some(slot => {
      const startTime = new Date(`${slot.date}T${slot.unavailable_start}`);
      const endTime = new Date(`${slot.date}T${slot.unavailable_end}`);
      return currentTime >= startTime && currentTime <= endTime;
    });
  };

  
  const isAvailable = (availability) => {
    const currentTime = new Date();
    return availability.some(slot => {
      const startTime = new Date(`${slot.date}T${slot.start_time}`);
      const endTime = new Date(`${slot.date}T${slot.end_time}`);
      return currentTime >= startTime && currentTime <= endTime;
    });
  };

  return (
    <Box width={"80%"} margin={"auto"} paddingTop={"3.5rem"}>
      <Box display={"flex"} margin={"auto"} w={"min-content"} padding={"1rem"}>
        <Box w={"15rem"}>
          <Input onChange={(e) => { setSearch(e.target.value); searching() }} />
        </Box>
        <Button onClick={() => {
          dispatch(getContact());
        }}>Reset Search</Button>
      </Box>
      {
        selector.contacts ? selector.contacts.map((contact) => {
          const isCurrentlyUnavailable = isUnavailable(contact.availability);
          const isCurrentlyAvailable = isAvailable(contact.availability);

          return (
            <Box 
              key={contact.id} 
              marginBottom={"1rem"} 
              display={"flex"} 
              justifyContent={"space-between"} 
              background={isCurrentlyUnavailable ? 'gray' : 'rgba(126, 101, 159 ,0.5)'}
              padding={"0.5rem"} 
              borderRadius={"0.5rem"}
              _hover={{ background: 'lightgray' }}
              cursor="pointer"
            >
              <Box>
                <Heading>Name: {contact.name}</Heading>
                <p>Contact no: {contact.phone}</p>
                <Tooltip label={isCurrentlyUnavailable ? "Currently Unavailable" : "Currently Available"}>
                  <Text color={isCurrentlyUnavailable ? "red" : "green"}>
                    {isCurrentlyUnavailable ? "Unavailable" : (isCurrentlyAvailable ? "Available" : "Out of Working Hours")}
                  </Text>
                </Tooltip>
              </Box>
              <Box>
                <AvavilityDetails id={contact.id} data = {contact.availability}/>
                <TimeAvaliability id={contact.id} />
                <EditContact id={contact.id} p_name={contact.name} p_phone={contact.phone} updateContactFunction={updateContactFunction} />
                <Button onClick={() => deleteContactFunction(contact.id)}>Delete</Button>
              </Box>
            </Box>
          );
        }) : <></>
      }
    </Box>
  );
}

function EditContact({ id, p_name, p_phone, updateContactFunction }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [name, setName] = useState(p_name);
  const [phone, setPhone] = useState(p_phone);
  const selector = useSelector(store => store.contactReducer);
  const dispatch = useDispatch();

  function handleFormInput(e) {
    dispatch({ type: e.target.name, payload: e.target.value });
  }

  useEffect(() => {
    dispatch({ type: NAME, payload: p_name });
    dispatch({ type: PHONE_NUMBER, payload: p_phone });
  }, [isOpen, onOpen, onClose]);

  return (
    <>
      <Button onClick={onOpen}>Edit</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Contact</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input value={selector.name} name={`${NAME}`} onChange={(e) => { handleFormInput(e) }} />
            <Input value={selector.phoneNumber} type='number' name={`${PHONE_NUMBER}`} onChange={(e) => { handleFormInput(e) }} />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={() => { updateContactFunction(id) }}>
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

function AvavilityDetails({ data,id }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const selector = useSelector(store => store.contactReducer);
  const dispatch = useDispatch();
  const toast = useToast();
function deleteContactAvalibility(date){
  console.log(date)
    deleteAvaliablity(id,date,toast);
}

  return (
    <>
      <Button onClick={onOpen}>Avaliablity Details</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxWidth="90vw" width="90%">
          <ModalHeader>Avaliablity Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody width="90%">
           
           <TableContainer>
  <Table variant='simple'>
    <TableCaption>Imperial to metric conversion factors</TableCaption>
    <Thead>
      <Tr>
        <Th>Day</Th>
              <Th>Start Time</Th>
              <Th>End Time</Th>
              <Th>Unavaliable Time</Th>
              <Th>Date</Th>
      </Tr>
    </Thead>
    <Tbody>
      
        {
          [...data].sort(function(a, b){return a < b}).map((e,index)=>(
            <Tr key={e.date}>
              <Td>{e.day}</Td>
              <Td>{e.start_time}</Td>
              <Td>{e.end_time}</Td>
              <Td>{e.unavailable_start} to {e.unavailable_end}</Td>
              <Td>{e.date}</Td>
              <Td ><Button onClick={es=>{deleteContactAvalibility(e.date)}}>DELETE</Button></Td>
            </Tr>
          ))
         }
      
    </Tbody>
    <Tfoot>
      <Tr>
        <Th>To convert</Th>
        <Th>into</Th>
        <Th isNumeric>multiply by</Th>
      </Tr>
    </Tfoot>
  </Table>
</TableContainer>
          </ModalBody>

          <ModalFooter>
            
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

function TimeAvaliability({id}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedStartTime, setSelectedStartTime] = useState(null);
  const [selectedEndTime, setSelectedEndTime] = useState(null);
  const [selectedUnavailableStart, setSelectedUnavailableStart] = useState(null);
  const [selectedUnavailableEnd, setSelectedUnavailableEnd] = useState(null);
  const toast = useToast();

  const timeSlots = [
    '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '12:00 PM', '12:30 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '05:30 PM'
  ];

 
  const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(/[:\s]/);
    const meridian = time.includes('PM') && hours !== '12' ? 12 * 60 : 0;
    return parseInt(hours) * 60 + parseInt(minutes) + meridian;
  };

  
  const filteredEndTimeSlots = timeSlots.filter(time => {
    return selectedStartTime ? timeToMinutes(time) > timeToMinutes(selectedStartTime) : true;
  });

  
  const filteredUnavailableEndSlots = timeSlots.filter(time => {
    return selectedUnavailableStart ? timeToMinutes(time) > timeToMinutes(selectedUnavailableStart) : true;
  });

  
  const handleSubmit = async () => {
    if (!selectedDate || !selectedStartTime || !selectedEndTime) {
      toast({
        title: "Selection Error",
        description: "Please select a date, start time, and end time for availability.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return;
    }
  
    if (selectedUnavailableStart && !selectedUnavailableEnd) {
      toast({
        title: "Selection Error",
        description: "Please select an unavailable start and end time.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return;
    }
  
    
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const day = daysOfWeek[selectedDate.getDay()];
  
    
    console.log(id)
    const data = {
      id,
      day, 
      date: selectedDate.toISOString().split('T')[0], 
      startTime: selectedStartTime,
      endTime: selectedEndTime,
      u_startTime: selectedUnavailableStart || "", 
      u_endTime: selectedUnavailableEnd || "",    
    };
  
    try {
      
      await createAvaliablity(data, toast);
      console.log(id,"hdfhdf")
      
      
  
      onClose(); 
    } catch (error) {
      
      console.log("Error submitting availability:", error);
    }
  };
  

  return (
    <>
      <Button onClick={onOpen}>Set Availability</Button>

      <Modal isOpen={isOpen} onClose={onClose} size="full">
        <ModalOverlay />
        <ModalContent maxWidth="90vw" width="90%">
          <ModalHeader>Select Availability</ModalHeader>
          <ModalCloseButton />
          <ModalBody width="90%">
            <Box
              display="flex"
              flexDirection={['column', 'column', 'row']}
              alignItems="center"
              justifyContent="center"
              padding="2rem"
            >
             
              <Box marginBottom={["2rem", "2rem", "0"]} marginRight={["0", "0", "3rem"]}>
                <Text fontSize="2xl" fontWeight="bold" marginBottom="1.5rem">Select Date:</Text>
                <Box
                  border="1px solid"
                  borderColor="gray.300"
                  borderRadius="md"
                  padding="1rem"
                  fontSize="lg"
                >
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    inline
                  />
                </Box>
              </Box>

              
              <Box>
                <Text fontSize="2xl" fontWeight="bold" marginBottom="1.5rem">Select Available Time:</Text>
                <SimpleGrid columns={2} spacing={2}>
                  
                  <Box>
                    <Text fontSize="lg" marginBottom="0.5rem">Start Time:</Text>
                    {timeSlots.map((time, index) => (
                      <Button
                        key={index}
                        fontSize="lg"
                        height="3.5rem"
                        width="8rem"
                        onClick={() => setSelectedStartTime(time)}
                        backgroundColor={selectedStartTime === time ? 'green.400' : 'gray.200'}
                        _hover={{ backgroundColor: 'blue.200' }}
                      >
                        {time}
                      </Button>
                    ))}
                  </Box>

                  
                  <Box>
                    <Text fontSize="lg" marginBottom="0.5rem">End Time:</Text>
                    {filteredEndTimeSlots.map((time, index) => (
                      <Button
                        key={index}
                        fontSize="lg"
                        height="3.5rem"
                        width="8rem"
                        onClick={() => setSelectedEndTime(time)}
                        backgroundColor={selectedEndTime === time ? 'green.400' : 'gray.200'}
                        _hover={{ backgroundColor: 'blue.200' }}
                      >
                        {time}
                      </Button>
                    ))}
                  </Box>
                </SimpleGrid>

                
                {selectedStartTime && selectedEndTime && (
                  <Box marginTop="2rem">
                    <Text fontSize="lg">Selected Available Time: {selectedStartTime} - {selectedEndTime}</Text>
                  </Box>
                )}

                
                {selectedStartTime && selectedEndTime && (
                  <Box marginTop="3rem">
                    <Text fontSize="2xl" fontWeight="bold" marginBottom="1.5rem">Select Unavailable Time:</Text>
                    <SimpleGrid columns={2} spacing={2}>
                      
                      <Box>
                        <Text fontSize="lg" marginBottom="0.5rem">Unavailable Start:</Text>
                        {timeSlots.map((time, index) => (
                          <Button
                            key={index}
                            fontSize="lg"
                            height="3.5rem"
                            width="8rem"
                            onClick={() => setSelectedUnavailableStart(time)}
                            backgroundColor={selectedUnavailableStart === time ? 'red.400' : 'gray.200'}
                            _hover={{ backgroundColor: 'blue.200' }}
                          >
                            {time}
                          </Button>
                        ))}
                      </Box>

                      
                      <Box>
                        <Text fontSize="lg" marginBottom="0.5rem">Unavailable End:</Text>
                        {filteredUnavailableEndSlots.map((time, index) => (
                          <Button
                            key={index}
                            fontSize="lg"
                            height="3.5rem"
                            width="8rem"
                            onClick={() => setSelectedUnavailableEnd(time)}
                            backgroundColor={selectedUnavailableEnd === time ? 'red.400' : 'gray.200'}
                            _hover={{ backgroundColor: 'blue.200' }}
                          >
                            {time}
                          </Button>
                        ))}
                      </Box>
                    </SimpleGrid>

                   
                    {selectedUnavailableStart && selectedUnavailableEnd && (
                      <Box marginTop="2rem">
                        <Text fontSize="lg">Selected Unavailable Time: {selectedUnavailableStart} - {selectedUnavailableEnd}</Text>
                      </Box>
                    )}
                  </Box>
                )}
              </Box>
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit} fontSize="lg" padding="1.5rem">
              Save
            </Button>
            <Button variant="ghost" onClick={onClose} fontSize="lg" padding="1.5rem">Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}





export default Home;
