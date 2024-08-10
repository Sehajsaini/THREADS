import React, { useState } from 'react';
import { Input, Box, List, ListItem, Spinner, Flex } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import useShowToast from "../hooks/useShowToast";

const SearchBar = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useShowToast();

  const handleSearch = async (e) => {
    const username = e.target.value;
    setSearchQuery(username);
    if (!username) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/users/search/${username}`);
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      const data = await res.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Error fetching users:', error.message);
      toast({
        title: 'Error fetching users',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleUserSelect = (username) => {
    navigate(`/${username}`);
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <Box position="relative" width={{ base: "100%", md: "200px" }} p={4} borderRadius="md" >
        {/* <Text fontSize='lg' fontWeight='bold' mb={2}>Search Bar</Text> */}
        <Box  fontSize='lg' fontWeight='bold' mb={3}>Search Bar</Box>
      <Box position="relative">
        <Input
          placeholder="Search users"
          value={searchQuery}
          onChange={handleSearch}
          size="sm"
          pr="2.5rem" // Adjust padding for icon space
          _placeholder={{ color: 'gray.500' }}
        />
        {searchQuery && (
          <Box
            position="absolute"
            right="0.5rem" // Adjust positioning
            top="50%"
            transform="translateY(-50%)"
            onClick={handleClear}
            cursor="pointer"
            
            fontSize="sm" // Set a smaller font size for the icon
            p="0.2rem" // Padding around the icon
            // _hover={{ bg: 'gray.100' }} // Hover effect for better visibility
            zIndex="1" // Ensure it’s above the input field
          >
            <CloseIcon boxSize="3" /> {/* Smaller size for the icon */}
          </Box>
        )}
      </Box>
      {loading ? (
        <Spinner size="sm" mt={2} />
      ) : (
        <List spacing={2} mt={2}>
          {searchResults.length === 0 && searchQuery ? (
            <ListItem p={2} borderWidth={1} borderRadius="md">
              <Box textAlign="center">User not found</Box>
            </ListItem>
          ) : (
            searchResults.map(user => (
              <ListItem
                key={user._id}
                p={2}
                borderWidth={1}
                borderRadius="md"
                cursor="pointer"
                onClick={() => handleUserSelect(user.username)}
                _hover={{ bg: 'gray.600' }}
              >
                <Flex alignItems="center">
                  <Box
                    as="img"
                    src={user.profilePic ||  '/profilepic.png' }
                    alt={`${user.username}'s profile`}
                    borderRadius="full"
                    boxSize="30px"
                    mr={2}
                  />
                  <Box>
                    <Box fontWeight="bold" fontSize="sm">{user.username}</Box>
                    <Box color="gray.500" fontSize="xs">{user.name}</Box>
                  </Box>
                </Flex>
              </ListItem>
            ))
          )}
        </List>
      )}
    </Box>
  );
};

export default SearchBar;
