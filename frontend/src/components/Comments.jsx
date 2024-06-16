import { Avatar, Divider, Flex, Text } from "@chakra-ui/react";
import { useState } from "react"
import { CgMoreAlt } from "react-icons/cg";
import Actions from "./Actions";


const Comments = ({reply, lastReply}) => {
  return (
    <>
        <Flex gap={4} py={2} w={"full"}>
            <Avatar src={reply.userProfilePic} size={"md"} mt={2}/>
            <Flex gap={0.5} flexDirection={"column"} w={"full"}>
                <Flex justifyContent={"space-between"} w={"full"} alignItems={"center"}>
                    <Text fontSize={"md"} fontWeight={600}>{reply.username}</Text>
                </Flex>

                <Text fontWeight={300}>{reply.text}</Text>
            </Flex>
        </Flex>
        {!lastReply ? <Divider my={4} /> : null}
    </>
  )
}

export default Comments