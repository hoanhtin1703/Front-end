import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Modal, Post, LoadingPost, LoadingForm, FormCreatePost } from "../..";
import InfiniteScroll from "react-infinite-scroll-component";

const Center = ({
  posts,
  loading,
  token,
  autoFetch,
  setOneState,
  dark,
  user,
  getAllPosts,
  setPosts,
  getNewPosts,
  error,
  isQrCode,
}) => {
  const [attachment, setAttachment] = useState("");
  const [text, setText] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [loadingCreateNewPost, setLoadingCreateNewPost] = useState(false);

  // Modal
  useEffect(() => {
    setOneState("openModal", openModal);
  }, [openModal]);

  // get posts
  useEffect(() => {
    if (token) {
      getAllPosts();
    }
  }, [token]);

  const createNewPost = async (formData) => {
    setLoadingCreateNewPost(true);
    if (!text) {
      toast.error("You must type something...");
      return;
    }
    try {
      if (formData) {
        console.log(formData.getAll("file"));
        const { data } = await autoFetch.post(`v1/createnewpost`, formData);
        if (data.status === true) {
          setPosts([data.data, ...posts]);
          toast.success(data.message);
          setLoadingCreateNewPost(false);
        } else {
          toast.error(data.message);
          return;
        }
      } else {
        toast.error("Some thing went wrong");
        setLoadingCreateNewPost(false);
      }
    } catch (error) {
      toast.error(new Error() || "Some thing went wrong");
      console.log(error);
    }
  };

  const content = () => {
    if (loading) {
      return (
        <div>
          <LoadingPost />
        </div>
      );
    }
    if (error) {
      return (
        <div
          className={`bg-white ${
            !dark && "shadow-post"
          } dark:bg-[#242526] rounded-lg w-full text-center text-xl font-bold py-10 `}
        >
          <div>No post found... Try again!</div>
        </div>
      );
    }
    if (posts.length === 0) {
      return (
        <div className="w-full text-center text-xl font-semibold pt-[20vh] flex-col ">
          <div>
            You don't post anything and don't follow anyone.
            <br />
            Let's do something! :3
          </div>
        </div>
      );
    }
    return (
      <InfiniteScroll
        dataLength={posts.length}
        next={getNewPosts}
        hasMore={true}
        loader={<LoadingPost />}
      >
        {posts.map((post) => (
          <Post
            key={post._id}
            currentPost={post}
            user_img={post.author.profilePicture}
            userId={user._id}
            className={!dark ? "shadow-post" : ""}
            userRole={user.isAdmin}
          />
        ))}
      </InfiniteScroll>
    );
  };

  const form = () => {
    if (error) {
      return <></>;
    }
    if (loading) return <LoadingForm />;
    return (
      <FormCreatePost
        setAttachment={setAttachment}
        setOpenModal={setOpenModal}
        text={text}
        user={user}
      />
    );
  };

  return (
    <div className="">
      {form()}

      {openModal && !isQrCode && (
        <Modal
          setOpenModal={setOpenModal}
          text={text}
          setText={setText}
          attachment={attachment}
          setAttachment={setAttachment}
          createNewPost={createNewPost}
        />
      )}
      {loadingCreateNewPost && <LoadingPost className="mb-4" />}
      {content()}
    </div>
  );
};

export default Center;
