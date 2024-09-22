import { Box, useMediaQuery } from "@chakra-ui/react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HamburgerIcon } from '@chakra-ui/icons';

const Navbar = () => {
  const [isLargerThan900] = useMediaQuery("(min-width: 900px)");
  const navigate = useNavigate();
  const [toggle, setToggle] = useState(false);

  const handleToggle = () => {
    setToggle((prevToggle) => !prevToggle);
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <Box display="flex" padding="0.5rem" justifyContent="space-around" background={"linear-gradient(90deg, rgba(110,13,156,1) 0%, rgba(130,169,213,1) 100%, rgba(0,40,255,1) 100%);"} >
      {isLargerThan900 ? (
        <>
          <Box onClick={() => handleNavigation("/")} >Phonebook</Box>
          <Box display="flex" padding="0.5rem" justifyContent="space-around">
            <Box
              onClick={() => handleNavigation("/createContact")}
              cursor="pointer"
            >
              Create Contact
            </Box>
          </Box>
        </>
      ) : (
        <Box display="flex" width="100%" justifyContent="space-around" background={"linear-gradient(90deg, rgba(110,13,156,1) 0%, rgba(130,169,213,1) 100%, rgba(0,40,255,1) 100%);"}>
            <Box onClick={() => handleNavigation("/")}>Phonebook</Box>
          <Box onClick={() => handleToggle} cursor="pointer">
            <HamburgerIcon />
            {
                toggle?
                <Box>
                <Box onClick={() => handleNavigation("/createContact")}>Create Contact</Box>
              </Box>:<></>
            }
          </Box>
          
        </Box>
      )}
    </Box>
  );
};

export default Navbar;
