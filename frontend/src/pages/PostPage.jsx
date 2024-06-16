import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Image,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { useEffect } from "react";
import Actions from "../components/Actions";
import Comments from "../components/Comments";
import useShowToast from "../hooks/useShowToast";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useNavigate, useParams } from "react-router-dom";
import userAtom from "../atoms/userAtom";
import { useRecoilState, useRecoilValue } from "recoil";
import postsAtom from "../atoms/postsAtom";
import { formatDistanceToNow } from "date-fns";
import { DeleteIcon } from "@chakra-ui/icons";

const PostPage = () => {
  const { user, loading } = useGetUserProfile();
  const showToast = useShowToast();
  const { pid } = useParams();
  const currentUser = useRecoilValue(userAtom);
  const navigate = useNavigate();
  const [posts, setPosts] = useRecoilState(postsAtom)

  const currentPost = posts[0];

  useEffect(() => {
    const getPost = async () => {
      setPosts([]);
      try {
        const res = await fetch(`/api/posts/${pid}`)
        const data = await res.json();

        if(data.error){
          showToast("Error", data.error, "error");
          return
        }
        console.log(data);
        setPosts([data]);
      } catch (error) {
        useShowToast("Error", error.message, "error");
      }
    };

    getPost();
  }, [showToast, pid, setPosts]);

  //Delete post
  const handleDeletePost = async (e) => {
    try {
      e.preventDefault();
      if(!window.confirm('Are you sure you want to delete this post')) return;

      const res = await fetch(`/api/posts/delete/${currentPost._id}`, {
        method: "DELETE",
      })

      const data = await res.json();

      if(data.error) {
        showToast("Error", data.error, "error");
        return;
      }
    
      showToast("Success", "Post deleted successfully", "success");
      navigate(`/${user.username}`)

    } catch (error) {
      showToast("Error", error.message, "error")  
    }
  }

  if (!user && loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }

  if(!currentPost) return null;

  return (
    <>
      <Flex>
        <Flex
          w={"full"}
          alignItems={"center"}
          gap={3}
        >
          <Avatar
            src={user.profilePic}
            size={"md"}
            name={user.name}
          />
          <Flex>
            <Text
              fontSize={"xl"}
              fontWeight={"bold"}
            >
              {user.username}
            </Text>
            <Image
              src="/verified.png"
              w={4}
              h={4}
              ml={2}
              mt={2}
            />
          </Flex>
        </Flex>
        <Flex gap={4} alignItems={"center"}>
          <Text fontSize={"xs"} width={36} textAlign={"right"} color={"gray.light"}>
              {formatDistanceToNow(new Date(currentPost.createdAt))} ago
          </Text>
          {currentUser?._id === user._id && <DeleteIcon size={20} cursor={"pointer"} onClick={handleDeletePost}/>}
        </Flex>
      </Flex>

      <Text
        mt={6}
        mb={3}
      >
        {currentPost.text}
      </Text>

      {currentPost.img && (
        <Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"} >
          <Image src={currentPost.img} w={"full"} />
        </Box>
      )}

      <Flex
        gap={3}
        my={1}
      >
        <Actions post={currentPost}/>
      </Flex>

      {/* <Flex gap={2} alignItems={"center"}>
        <Text color={"gray.light"} fontSize={"sm"}>
          {post.replies.length} replies                                       // We already added this in actions.jsx
        </Text>
        <Box w={1} h={1} borderRadius={"full"} bgColor={"gray.light"}></Box>
        <Text color={"gray.light"} fontSize={"sm"}>
          {post.likes.length} likes
        </Text>
      </Flex> */}

      <Divider my={4} />

      <Flex justifyContent={"space-between"}>
        <Flex
          gap={2}
          alignItems={"center"}
        >
          <Text color={"gray.light"}>Get the app to like, reply and post</Text>
        </Flex>
        <Button>Get</Button>
      </Flex>

      <Divider my={4} />

      {/* Comment Section */}
      {currentPost.replies.map(reply => (
        <Comments key={reply._id} reply={reply} 
          lastReply = {reply._id === currentPost.replies[currentPost.replies.length - 1]._id}
        />
      ))}

      {/* <Comments 
        comment="Looks really good!"
        createdAt="2d"
        likes={100}
        username="johndoe"
        userAvatar="https://bit.ly/prosper-baba"
      /> */}
    </>
  );
};

export default PostPage;
