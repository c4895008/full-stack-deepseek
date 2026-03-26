import { assets } from "@/assets/assets"
import Image from "next/image"
import { useAppContext } from "@/context/AppContext"
import toast from "react-hot-toast";
import axios from 'axios';
export default function ChatLabel({ openMenu, setOpenMenu, id, name }) {
  const { fetchUsersChats, chats, setSelectedChat, selectedChat } = useAppContext();
  const selectChatHandler = () => {
    const chatData = chats.find(chat => chat._id === id);
    setSelectedChat(chatData);
  }
  const renameHandler = async () => {
    try {
      const newName = prompt("Enter new name");
      if (!newName) return;
      const { data } = await axios.post("/api/chat/rename", {
        chatId: id,
        name: newName
      });
      if (data.success) {
        fetchUsersChats();
        setOpenMenu({ open: false, id: 0 });
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  }
  const deleteHandler = async () => {
    try {
      const confirm = window.confirm(
        "Are you sure you want to delete this chat?"
      );
      if (!confirm) return;
      const { data } = await axios.post("/api/chat/delete", {
        chatId: id
      });
      if (data.success) {
        fetchUsersChats();
        setOpenMenu({ open: false, id: 0 });
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  }
  return (
    <div onClick={selectChatHandler} className={`flex items-center justify-between p-2 text-white/80  hover:bg-white/10 rounded-lg text-sm group cursor-pointer ${selectedChat && selectedChat._id == id ? "bg-white/10" : ""}`} >
      <p className="group-hover:max-w-5/6 truncate">{name}</p>
      <div onClick={(e) => {
        e.stopPropagation();
        setOpenMenu({ id: id, open: !openMenu.open });
      }} className="group relative flex items-center justify-center h-6 w-6 aspect-square hover:bg-black/80 rounded-lg">
        <Image src={assets.three_dots} className={`w-4 ${openMenu.id === id && openMenu.open ? '' : 'hidden'} group-hover:block`} alt="" />
        <div className={`absolute ${openMenu.id === id && openMenu.open ? 'block' : 'hidden'} -right-36  top-6 bg-gray-700 rounded-xl w-max p-2`}>
          <div onClick={renameHandler} className="flex items-center gap-3 hover:bg-white/10 px-3 py-2 rounded-lg">
            <Image src={assets.pencil_icon} className="w-4" alt="" />
            <p>Rname</p>
          </div>
          <div onClick={deleteHandler} className="flex items-center gap-3 hover:bg-white/10 px-3 py-2 rounded-lg">
            <Image src={assets.delete_icon} className="w-4" alt="" />
            <p>Delete</p>
          </div>
        </div>
      </div>
    </div>
  )
}