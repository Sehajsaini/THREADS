import { Box, Flex, Spinner, Divider, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import Post from "../components/Post";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";
import SuggestedUsers from "../components/SuggestedUsers";
import SearchBar from "../components/SearchBar";

const HomePage = () => {
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [loading, setLoading] = useState(true);
  const showToast = useShowToast();

  useEffect(() => {
    const getFeedPosts = async () => {
      setLoading(true);
      setPosts([]);
      try {
        const res = await fetch("/api/posts/feed");
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setPosts(data);
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setLoading(false);
      }
    };
    getFeedPosts();
  }, [showToast, setPosts]);

  return (
    <Flex
      direction={{ base: 'column', md: 'row' }}
      gap='10'
      alignItems='flex-start'
      p={{ base: 2, md: 4 }}
    >
      {/* SearchBar for small screens */}
      <Box
        display={{ base: 'block', md: 'none' }}
        mb={4}
        alignItems='center'
      >
        <SearchBar />
      </Box>

      {/* Main Content: Posts */}
      <Box
        flex={{ base: '1', md: '3' }}
        mb={{ base: 4, md: 0 }}
      >
        {!loading && posts.length === 0 && <h1>Follow some users to see the feed</h1>}

        {loading && (
          <Flex justify='center'>
            <Spinner size='xl' />
          </Flex>
        )}

        {posts.map((post) => (
          <Post key={post._id} post={post} postedBy={post.postedBy} />
        ))}
      </Box>

      {/* Suggested Users and Search Bar for medium and large screens */}
      <Box
        display={{ base: 'none', md: 'block' }}
        flex={{ base: 'none', md: '1' }}
        width={{ md: '30%' }}
      >
        {/* Suggested Users Section */}
        <Box>
          <SuggestedUsers />
        </Box>
        
        <Divider my={4} />

        {/* Search Bar Section */}
        <Box>
          <SearchBar />
        </Box>
      </Box>
    </Flex>
  );
};

export default HomePage;
