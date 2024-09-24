import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Heading,
  Input,
  Button,
  useToast,
  SimpleGrid,
  Text,
  Tooltip,
  useMediaQuery,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteAvaliablity,
  deleteContact,
  getContact,
  getSearchedContact,
  updateContact,
} from "../redux/action/contactAction";
import {
  Modal,
  ModalOverlay,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { createAvaliablity } from "../redux/action/contactAction";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  GET_ALL_CONTACTS,
  NAME,
  PHONE_NUMBER,
} from "../redux/actionTypes.js/contactActionTypes";
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
} from "@chakra-ui/react";
const Home = () => {
  const selector = useSelector((store) => store.contactReducer);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [errorBool, setErrorBool] = useState(false);
  const [search, setSearch] = useState("");
  const [isLargerThan500] = useMediaQuery("(min-width: 500px)");
  const [isLargerThan1270] = useMediaQuery("(min-width: 1270px)");
  const [isLargerThan900] = useMediaQuery("(min-width: 900px)");
  const [isLargerThan600] = useMediaQuery("(min-width: 600px)");
  const ref = useRef();
  const toast = useToast();

  function searching() {
    if (ref.current) {
      clearTimeout(ref.current);
    }
    ref.current = setTimeout(() => {
      dispatch(getSearchedContact(search, toast, setLoading, setErrorBool));
    }, 3000);
  }

  useEffect(() => {
    dispatch(getContact(setLoading, setErrorBool));
  }, []);

  async function updateContactFunction(id) {
    try {
      await dispatch(
        updateContact(
          { id, name: selector.name, contact: selector.phoneNumber },
          toast
        )
      );
    } catch (error) {
      console.log(error);
    }
  }

  const isUnavailable = (availability) => {
    const currentTime = new Date();
    return availability.some((slot) => {
      const startTime = new Date(`${slot.date}T${slot.unavailable_start}`);
      const endTime = new Date(`${slot.date}T${slot.unavailable_end}`);
      return currentTime >= startTime && currentTime <= endTime;
    });
  };

  const isAvailable = (availability) => {
    const currentTime = new Date();
    return availability.some((slot) => {
      const startTime = new Date(`${slot.date}T${slot.start_time}`);
      const endTime = new Date(`${slot.date}T${slot.end_time}`);
      return currentTime >= startTime && currentTime <= endTime;
    });
  };

  return (
    <Box
      width={isLargerThan500 ? "80%" : "95%"}
      margin={"auto"}
      paddingTop={"3.5rem"}
    >
      <Heading>Phonebook Admin Manager</Heading>
      <Box
        display={"flex"}
        margin={"auto"}
        width={
          isLargerThan1270
            ? "30%"
            : isLargerThan900
            ? "45%"
            : isLargerThan600
            ? "65%"
            : isLargerThan500
            ? "80%"
            : "100%"
        }
        padding={"1rem"}
      >
        <Box>
          <Input
            onChange={(e) => {
              setSearch(e.target.value);
              searching();
            }}
          />
        </Box>
        <Button
          fontSize={isLargerThan500 ? "medium" : "smaller"}
          onClick={() => {
            dispatch(getContact(setLoading, setErrorBool));
          }}
        >
          Reset Search
        </Button>
      </Box>
      {errorBool ? (
        <Heading>Something went wrong</Heading>
      ) : loading ? (
        <>
          {[...Array(4)].map((_, idx) => (
            <Box
              key={idx}
              background={"#C7C7C7"}
              padding="6"
              boxShadow="lg"
              bg="white"
              display="flex"
              justifyContent="space-between"
              marginBottom={"1rem"}
            >
              <Box width={"35%"}>
                <SkeletonText
                  mt="4"
                  noOfLines={1}
                  spacing="4"
                  skeletonHeight="12"
                />
                <SkeletonText
                  mt="2"
                  noOfLines={1}
                  spacing="0"
                  skeletonHeight="5"
                />
                <SkeletonText
                  mt="2"
                  noOfLines={1}
                  spacing="0"
                  skeletonHeight="2"
                />
              </Box>
              <Box display="flex" justifyContent="space-around" width={"39%"}>
                <Skeleton height="9" width="7rem" />
                <Skeleton height="9" width="6rem" />
                <Skeleton height="9" width="5rem" />
                <Skeleton height="9" width="5rem" />
              </Box>
              <SkeletonText
                mt="4"
                noOfLines={4}
                spacing="4"
                skeletonHeight="2"
              />
            </Box>
          ))}
        </>
      ) : selector.contacts ? (
        selector.contacts.length === 0 ? (
          <Heading>No Contacts Found</Heading>
        ) : (
          selector.contacts.map((contact, index) => {
            const isCurrentlyUnavailable = isUnavailable(contact.availability);
            const isCurrentlyAvailable = isAvailable(contact.availability);

            return (
              <Box
                key={contact.id}
                marginBottom="1rem"
                display={isLargerThan500 ? "flex" : "block"}
                justifyContent="space-between"
                background={
                  isCurrentlyUnavailable ? "gray" : "rgba(126, 101, 159 ,0.5)"
                }
                padding="0.5rem"
                borderRadius="0.5rem"
                _hover={{ background: "lightpink" }}
                cursor="pointer"
              >
                <Box>
                  <Heading>Name: {contact.name}</Heading>
                  <p>Contact no: {contact.phone}</p>
                  <Tooltip
                    label={
                      isCurrentlyUnavailable
                        ? "Currently Unavailable"
                        : "Currently Available"
                    }
                  >
                    <Text color={isCurrentlyUnavailable ? "red" : "green"}>
                      {isCurrentlyUnavailable
                        ? "Unavailable"
                        : isCurrentlyAvailable
                        ? "Available"
                        : "Out of Working Hours"}
                    </Text>
                  </Tooltip>
                </Box>
                <Box>
                  <AvavilityDetails
                    id={contact.id}
                    data={contact.availability}
                    index={index}
                    setLoading={setLoading}
                    setErrorBool={setErrorBool}
                  />
                  <TimeAvailability
                    id={contact.id}
                    setLoading={setLoading}
                    setErrorBool={setErrorBool}
                  />
                  <EditContact
                    id={contact.id}
                    p_name={contact.name}
                    p_phone={contact.phone}
                    updateContactFunction={updateContactFunction}
                    setLoading={setLoading}
                    setErrorBool={setErrorBool}
                  />
                  <DeletionModel
                    id={contact.id}
                    setLoading={setLoading}
                    setErrorBool={setErrorBool}
                  />
                </Box>
              </Box>
            );
          })
        )
      ) : (
        <></>
      )}
    </Box>
  );
};

function EditContact({
  id,
  p_name,
  p_phone,
  updateContactFunction,
  setLoading,
  setErrorBool,
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const selector = useSelector((store) => store.contactReducer);
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
      <Button onClick={onOpen} margin={"0.5rem"}>
        Edit
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          dispatch(getContact(setLoading, setErrorBool));
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Contact</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              value={selector.name}
              name={`${NAME}`}
              onChange={(e) => {
                handleFormInput(e);
              }}
            />
            <Input
              value={selector.phoneNumber}
              type="number"
              name={`${PHONE_NUMBER}`}
              onChange={(e) => {
                handleFormInput(e);
              }}
            />
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => {
                updateContactFunction(id);
              }}
            >
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

function DeletionModel({ id, setLoading, setErrorBool }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const selector = useSelector((store) => store.contactReducer);
  const dispatch = useDispatch();
  const toast = useToast();

  return (
    <>
      <Button onClick={onOpen} margin={"0.5rem"}>
        Delete
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          dispatch(getContact(setLoading, setErrorBool));
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Contact</ModalHeader>
          <ModalCloseButton />
          <ModalBody></ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => {
                deleteContact(id, toast);
              }}
            >
              Confirm Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

function AvavilityDetails({ data, id, index, setLoading, setErrorBool }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const selector = useSelector((store) => store.contactReducer);
  const dispatch = useDispatch();
  const toast = useToast();
  function deleteContactAvalibility(date, idx) {
    console.log(date);
    deleteAvaliablity(id, date, toast, () => {
      const tempData = [...selector.contacts];
      tempData[index].availability.splice(idx, 1);
      dispatch({ type: GET_ALL_CONTACTS, payload: tempData });
    });
  }

  return (
    <>
      <Button onClick={onOpen} margin={"0.5rem"}>
        Avaliablity Details
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose();
        }}
      >
        <ModalOverlay />
        <ModalContent maxWidth="90vw" width="90%">
          <ModalHeader>Avaliablity Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody width="90%">
            <TableContainer>
              <Table variant="simple">
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
                  {data.length > 0 ? (
                    [...data]
                      .sort(function (a, b) {
                        return a > b;
                      })
                      .map((e, idx) =>
                        e.day ? (
                          <Tr key={e.date}>
                            <Td>{e.day}</Td>
                            <Td>{e.start_time}</Td>
                            <Td>{e.end_time}</Td>
                            <Td>
                              {e.unavailable_start} to {e.unavailable_end}
                            </Td>
                            <Td>{e.date}</Td>
                            <Td>
                              <Button
                                onClick={(es) => {
                                  deleteContactAvalibility(e.date, idx);
                                }}
                              >
                                DELETE
                              </Button>
                            </Td>
                          </Tr>
                        ) : (
                          <></>
                        )
                      )
                  ) : (
                    <></>
                  )}
                </Tbody>
              </Table>
            </TableContainer>
          </ModalBody>

          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

function TimeAvailability({ id, setLoading, setErrorBool }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedStartTime, setSelectedStartTime] = useState(null);
  const [selectedEndTime, setSelectedEndTime] = useState(null);
  const [selectedUnavailableStart, setSelectedUnavailableStart] =
    useState(null);
  const [selectedUnavailableEnd, setSelectedUnavailableEnd] = useState(null);
  const toast = useToast();
  const dispatch = useDispatch();

  const timeSlots = [
    "12:00 AM",
    "12:30 AM",
    "01:00 AM",
    "01:30 AM",
    "02:00 AM",
    "02:30 AM",
    "03:00 AM",
    "03:30 AM",
    "04:00 AM",
    "04:30 AM",
    "05:00 AM",
    "05:30 AM",
    "06:00 AM",
    "06:30 AM",
    "07:00 AM",
    "07:30 AM",
    "08:00 AM",
    "08:30 AM",
    "09:00 AM",
    "09:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    "01:00 PM",
    "01:30 PM",
    "02:00 PM",
    "02:30 PM",
    "03:00 PM",
    "03:30 PM",
    "04:00 PM",
    "04:30 PM",
    "05:00 PM",
    "05:30 PM",
    "06:00 PM",
    "06:30 PM",
    "07:00 PM",
    "07:30 PM",
    "08:00 PM",
    "08:30 PM",
    "09:00 PM",
    "09:30 PM",
    "10:00 PM",
    "10:30 PM",
    "11:00 PM",
    "11:30 PM",
  ];

  const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(/[:\s]/);
    const isPM = time.includes("PM");
    const hourInMinutes = (parseInt(hours) % 12) * 60;
    const totalMinutes =
      hourInMinutes + parseInt(minutes) + (isPM ? 12 * 60 : 0);
    return totalMinutes;
  };

  const filteredEndTimeSlots = timeSlots.filter((time) => {
    return selectedStartTime
      ? timeToMinutes(time) > timeToMinutes(selectedStartTime)
      : true;
  });

  const filteredUnavailableStartSlots = timeSlots.filter((time) => {
    return selectedStartTime && selectedEndTime
      ? timeToMinutes(time) > timeToMinutes(selectedStartTime) &&
          timeToMinutes(time) < timeToMinutes(selectedEndTime)
      : false;
  });

  const filteredUnavailableEndSlots = timeSlots.filter((time) => {
    return selectedUnavailableStart && selectedEndTime
      ? timeToMinutes(time) > timeToMinutes(selectedUnavailableStart) &&
          timeToMinutes(time) < timeToMinutes(selectedEndTime)
      : false;
  });

  const getDayOfWeek = (date) => {
    const validDate = new Date(date);
    return validDate.toLocaleDateString("en-US", { weekday: "long" });
  };
  const formatTimeWithDate = (date, time) => {
    const validDate = new Date(date);
    let [hours, minutes] = time.split(/[:\s]/);

    const isPM = time.includes("PM");

    if (isPM && hours !== "12") {
      hours = parseInt(hours) + 12;
    } else if (!isPM && hours === "12") {
      hours = "00";
    }

    validDate.setHours(parseInt(hours), parseInt(minutes), 0);

    const formattedTime = validDate.toTimeString().split(" ")[0];
    return formattedTime;
  };

  const handleSubmit = async () => {
    if (!selectedDate || !selectedStartTime || !selectedEndTime) {
      toast({
        title: "Selection Error",
        description:
          "Please select a date, start time, and end time for availability.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    if (selectedUnavailableStart && !selectedUnavailableEnd) {
      toast({
        title: "Selection Error",
        description: "Please select both unavailable start and end times.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    const validSelectedDate = new Date(selectedDate);

    const data = {
      id,
      date: validSelectedDate.toISOString().split("T")[0],
      day: getDayOfWeek(validSelectedDate),
      startTime: formatTimeWithDate(validSelectedDate, selectedStartTime),
      endTime: formatTimeWithDate(validSelectedDate, selectedEndTime),
      u_startTime: selectedUnavailableStart
        ? formatTimeWithDate(validSelectedDate, selectedUnavailableStart)
        : "",
      u_endTime: selectedUnavailableEnd
        ? formatTimeWithDate(validSelectedDate, selectedUnavailableEnd)
        : "",
    };

    try {
      createAvaliablity(data, toast);
    } catch (error) {
      console.log("Error submitting availability:", error);
    }
  };

  return (
    <>
      <Button onClick={onOpen} margin={"0.5rem"}>
        Set Availability
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          dispatch(getContact(setLoading, setErrorBool));
        }}
        size="full"
      >
        <ModalOverlay />
        <ModalContent maxWidth="95vw" width="95%">
          <ModalHeader>Select Availability</ModalHeader>
          <ModalCloseButton />
          <ModalBody width="95%">
            <Box
              display="flex"
              flexDirection={["column", "column", "row"]}
              justifyContent="center"
              padding="1rem"
            >
              <Box
                marginBottom={["2rem", "2rem", "0"]}
                marginRight={["0", "0", "3rem"]}
              >
                <Text fontSize="2xl" fontWeight="bold" marginBottom="1.5rem">
                  Select Date:
                </Text>
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
                <Text fontSize="2xl" fontWeight="bold" marginBottom="1.5rem">
                  Select Available Time:
                </Text>
                <SimpleGrid columns={2} spacing={2}>
                  <Box>
                    <Text fontSize="lg" marginBottom="0.5rem">
                      Start Time:
                    </Text>
                    {timeSlots.map((time, index) => (
                      <Button
                        key={index}
                        fontSize="lg"
                        height="3.5rem"
                        width="8rem"
                        onClick={() => setSelectedStartTime(time)}
                        backgroundColor={
                          selectedStartTime === time ? "green.400" : "gray.200"
                        }
                        _hover={{ backgroundColor: "blue.200" }}
                      >
                        {time}
                      </Button>
                    ))}
                  </Box>

                  <Box>
                    <Text fontSize="lg" marginBottom="0.5rem">
                      End Time:
                    </Text>
                    {filteredEndTimeSlots.map((time, index) => (
                      <Button
                        key={index}
                        fontSize="lg"
                        height="3.5rem"
                        width="8rem"
                        onClick={() => setSelectedEndTime(time)}
                        backgroundColor={
                          selectedEndTime === time ? "green.400" : "gray.200"
                        }
                        _hover={{ backgroundColor: "blue.200" }}
                      >
                        {time}
                      </Button>
                    ))}
                  </Box>
                </SimpleGrid>

                {selectedStartTime && selectedEndTime && (
                  <Box marginTop="2rem">
                    <Text fontSize="lg">
                      Selected Available Time: {selectedStartTime} -{" "}
                      {selectedEndTime}
                    </Text>
                  </Box>
                )}

                {selectedStartTime && selectedEndTime && (
                  <Box marginTop="3rem">
                    <Text
                      fontSize="2xl"
                      fontWeight="bold"
                      marginBottom="1.5rem"
                    >
                      Select Unavailable Time (Optional):
                    </Text>
                    <SimpleGrid columns={2} spacing={2}>
                      <Box>
                        <Text fontSize="lg" marginBottom="0.5rem">
                          Unavailable Start:
                        </Text>
                        {filteredUnavailableStartSlots.map((time, index) => (
                          <Button
                            key={index}
                            fontSize="lg"
                            height="3.5rem"
                            width="8rem"
                            onClick={() => setSelectedUnavailableStart(time)}
                            backgroundColor={
                              selectedUnavailableStart === time
                                ? "red.400"
                                : "gray.200"
                            }
                            _hover={{ backgroundColor: "blue.200" }}
                          >
                            {time}
                          </Button>
                        ))}
                      </Box>

                      <Box>
                        <Text fontSize="lg" marginBottom="0.5rem">
                          Unavailable End:
                        </Text>
                        {filteredUnavailableEndSlots.map((time, index) => (
                          <Button
                            key={index}
                            fontSize="lg"
                            height="3.5rem"
                            width="8rem"
                            onClick={() => setSelectedUnavailableEnd(time)}
                            backgroundColor={
                              selectedUnavailableEnd === time
                                ? "red.400"
                                : "gray.200"
                            }
                            _hover={{ backgroundColor: "blue.200" }}
                          >
                            {time}
                          </Button>
                        ))}
                      </Box>
                    </SimpleGrid>

                    {selectedUnavailableStart && selectedUnavailableEnd && (
                      <Box marginTop="2rem">
                        <Text fontSize="lg">
                          Selected Unavailable Time: {selectedUnavailableStart}{" "}
                          - {selectedUnavailableEnd}
                        </Text>
                      </Box>
                    )}
                  </Box>
                )}
              </Box>
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button onClick={handleSubmit} colorScheme="blue" mr={3}>
              Submit
            </Button>
            <Button
              onClick={() => {
                onClose();
                dispatch(getContact(setLoading, setErrorBool));
              }}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default Home;
