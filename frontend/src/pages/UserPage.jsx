import { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import { Flex, Spinner } from "@chakra-ui/react";
import Post from "../components/Post";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";

const UserPage = () => {
  const { user, loading } = useGetUserProfile();
  const { username } = useParams();
  const showToast = useShowToast();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [fetchingPosts, setFetchingPosts] = useState(true);

  useEffect(() => {
    const getPosts = async () => {
      if (!user) return;
      setFetchingPosts(true);
      try {
        const res = await fetch(`/api/posts/user/${username}`);
        const data = await res.json();

        setPosts(data);
      } catch (error) {
        showToast("Error", error.message, "error");
        setPosts([]);
      } finally {
        setFetchingPosts(false);
      }
    };

    getPosts();
  }, [username, showToast, setPosts, user]);

  if (!user && loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }
  if (!user && !loading) return <h1>User not found</h1>;

  return (
    <>
      <UserHeader user={user} />

      {!fetchingPosts && posts.length === 0 && <h1>User has no posts</h1>}

      {fetchingPosts && (
        <Flex
          justifyContent={"center"}
          my={12}
        >
          <Spinner size={"xl"} />
        </Flex>
      )}

      {posts.map((post) => (
        <Post
          key={post._id}
          post={post}
          postedBy={post.postedBy}
        />
      ))}
    </>
  );
};

export default UserPage;

{
  /* <UserPosts
        likes={1200}
        replies={481}
        postImg="/post1.png"
        postTitle={"Let's talk about threads."}
      />
      <UserPosts
        likes={451}
        replies={21}
        postImg="/post2.png"
        postTitle={"Nice tutorial"}
      />
      <UserPosts
        likes={321}
        replies={989}
        postImg="/post3.png"
        postTitle={"I love this guy."}
      />
      <UserPosts
        likes={212}
        replies={56}
        postTitle={"Let's talk about latest trends in the market"}
      /> */
}
