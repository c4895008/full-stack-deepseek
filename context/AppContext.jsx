"use client";
import { createContext, useContext, useState,useEffect } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import axios from "axios";
import toast from "react-hot-toast";
import { set } from "mongoose";
export const AppContext = createContext();
export const useAppContext = () => {
  return useContext(AppContext);
};
export const AppContextProvider = ({ children }) => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const createNewChat = async () => {
    try {
      if (!user) {
        return;
      }
      const token = await getToken();
      await axios.post(
        "/api/chat/create",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      toast.error(error.message);
    }
  };
  const fetchUsersChats = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/chat/get", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (data.success) {
        console.log(data.data);
        setChats(data.data);
        if (data.data.length == 0) {
          await createNewChat();
          return fetchUsersChats();
        } else {
          ///sort chats by updateAt
          data.data.sort((a, b) => new Date(b.updateAt) - new Date(a.updateAt));
          ///set recently updated chat as selected chat
          setSelectedChat(data.data[0]);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  useEffect(() => {
    user && fetchUsersChats();
  }, [user]);
  const value = {
    user,
    chats,
    setChats,
    selectedChat,
    setSelectedChat,
    fetchUsersChats,
    createNewChat,
   
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
