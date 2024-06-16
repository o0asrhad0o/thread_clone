import {
  Avatar,
  Box,
  Button,
  Flex,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { FaInstagram } from "react-icons/fa";
import { CgMoreO } from "react-icons/cg";
import { Link as RouterLink } from "react-router-dom";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { useState } from "react";
import useShowToast from "../hooks/useShowToast";

const UserHeader = ({ user }) => {
  const toast = useToast();
  const showToast = useShowToast();

  const currentUser = useRecoilValue(userAtom); //this is a user that is logged in currently and (user_.id is which we are looking)
  const [following, setFollowing] = useState(
    user.followers.includes(currentUser?._id)
  );
  const [updating, setUpdating] = useState(false);

  const handleFollowUnfollow = async () => {
    if (!currentUser) {
      showToast("Error", data.error, "error");
      return;
    }

    if (updating) return;
    setUpdating(true); //to stop that loading sign
    
    try {
      const res = await fetch(`/api/users/follow/${user._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }

      if (following) {
        showToast("Success", `Unfollowed ${user.name}`, "success");
        user.followers.pop();
      } else {
        showToast("Success", `Followed ${user.name}`, "success");
        user.followers.push(currentUser?._id); //simulate adding to followers.... only update to client side
      }
      setFollowing(!following);

      console.log(data);
    } catch (error) {
      useShowToast("Error", data.error, "error");
    } finally {
      setUpdating(false); //to stop that loading sign
    }
  };

  const copyURL = () => {
    const currentURL = window.location.href;
    navigator.clipboard.writeText(currentURL).then(() => {
      toast({
        title: "Link copied to clipboard",
        status: "success",
        duration: 1000,
        isClosable: false,
      });
    });
  };

  return (
    <VStack
      gap={6}
      alignItems={"start"}
    >
      <Flex
        justifyContent={"space-between"}
        w={"full"}
      >
        <Box>
          <Text
            fontSize={"3xl"}
            fontWeight={"600"}
            mb={1}
          >
            {user.name}
          </Text>
          <Flex
            gap={3}
            alignItems={"center"}
          >
            <Text fontSize={"md"}>{user.username}</Text>
            <Text
              fontSize={"xs"}
              bg={"gray.dark"}
              color={"gray.light"}
              px={2}
              py={1}
              borderRadius={"full"}
            >
              threads.net
            </Text>
          </Flex>
        </Box>
        <Box>
          {user.profilePic && (
            <Avatar
              name={user.name}
              src={user.profilePic}
              size={"xl"}
            />
          )}
          {!user.profilePic && (
            <Avatar
              name={user.name}
              src="https://bilt.ly/broken-link"
              size={"xl"}
            />
          )}
        </Box>
      </Flex>

      <Text>{user.bio}</Text>

      {currentUser?._id === user._id && (
        <Link
          as={RouterLink}
          to="/update"
        >
          <Button size={"sm"}>Update Profile</Button>
        </Link>
      )}
      {currentUser?._id !== user._id && (
        <Button
          size={"sm"}
          onClick={handleFollowUnfollow}
          isLoading={updating}
        >
          {following ? "Unfollow" : "Follow"}
        </Button>
      )}

      <Flex
        w={"full"}
        justifyContent={"space-between"}
      >
        <Flex
          gap={2}
          alignItems={"center"}
        >
          <Text color={"gray.light"}>{user.followers.length} followers</Text>
          <Text color={"gray.light"}>{user.following.length} followings</Text>
          <Box
            w={"1"}
            h={"1"}
            bg={"gray.light"}
            borderRadius={"full"}
          ></Box>
          <Link color={"gray.light"}>instagram.com</Link>
        </Flex>
        <Flex>
          <Box className="icon-container">
            <FaInstagram
              size={24}
              cursor={"pointer"}
            />
          </Box>
          <Box className="icon-container">
            <Menu>
              <MenuButton>
                <CgMoreO
                  size={24}
                  cursor={"pointer"}
                />
              </MenuButton>
              <Portal>
                <MenuList bg={"gray.dark"}>
                  <MenuItem
                    bg={"gray.dark"}
                    onClick={copyURL}
                  >
                    Copy Link
                  </MenuItem>
                </MenuList>
              </Portal>
            </Menu>
          </Box>
        </Flex>
      </Flex>

      <Flex w={"full"}>
        <Flex
          flex={1}
          borderBottom={"1.5px solid white"}
          justifyContent={"center"}
          pb={"3"}
          cursor={"pointer"}
        >
          <Text fontWeight={"bold"}>Threads</Text>
        </Flex>
        <Flex
          flex={1}
          borderBottom={"1px solid gray"}
          justifyContent={"center"}
          color={"gray.light"}
          pb={"3"}
          cursor={"pointer"}
        >
          <Text fontWeight={"bold"}>Replies</Text>
        </Flex>
      </Flex>
    </VStack>
  );
};

export default UserHeader;