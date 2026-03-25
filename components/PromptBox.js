import { assets } from '@/assets/assets';
import { useAppContext } from '@/context/AppContext';
import axios from 'axios';
import { set } from 'mongoose';
import Image from 'next/image';
import { useState } from 'react';
import toast from 'react-hot-toast';
export default function  ({ isLoading, setIsLoading }) {
    const [prompt, setPrompt] = useState("");
    const { user, chats, setChats, selectedChat, setSelectedChat } = useAppContext();
    const sendPrompt = async (e) => {
        e.preventDefault();
        let copyPrompt = prompt;
        try {
            if (!user) {
                //return toast.error("Please login to continue");
            }
            if (isLoading) {
                return toast.error("Please wait for the previous request to complete");
            }
            setIsLoading(true);
            setPrompt("");
            const userPrompt = {
                role: 'user',
                content: prompt,
                timestamp: Date.now()
            }
            setChats((prevChats) => prevChats.map(chat => chat._id === selectedChat._id ? { ...chat, messages: [...chat.messages, userPrompt] } : chat));
            setSelectedChat((prev) => ({ ...prev, messages: [...prev.messages, userPrompt] }));
            const { data } = await axios.post('/api/chat/ai', {
                chatId: selectedChat._id,
                prompt: prompt
            });
            if (data.success) {
                setChats((prevChats) => prevChats.map((chat) => chat._id === selectedChat._id ? { ...chat, messages: [...chat.messages, data.message] } : chat))
            } else {
                toast.error(data.message);
                sendPrompt(copyPrompt);
            }
        } catch (e) {
            toast.error(e.message);
            sendPrompt(copyPrompt);
        }
    };
    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            sendPrompt(e)
        }
    }
    return (
        <form onSubmit={sendPrompt} className={`w-full ${false ? "max-w-3xl" : "max-w-2xl"} bg-[#404045] p-4 rounded-3xl mt-4 transition-all`}>
            <textarea onKeyDown={handleKeyDown} onChange={(e) => setPrompt(e.target.value)} className="outline-none w-full resize-none overflow-hidden break-words bg-transparent" rows={2} placeholder="Message DeepSeek" required></textarea>
            <div className='flex items-center justify-between text-sm'>
                <div className='flex items-center gap-2'>
                    <p className='flex items-center gap-2 text-xs border border-gray-300/40 px-2 py-1 rounded-full cursor-pointer hover:bg-gray-500/20 transition'>
                        <Image className='h-5' src={assets.deepthink_icon} alt="deepthink" />
                        DeepSeek(R1)
                    </p>
                    <p className='flex items-center gap-2 text-xs border border-gray-300/40 px-2 py-1 rounded-full cursor-pointer hover:bg-gray-500/20 transition'>
                        <Image className='h-5' src={assets.search_icon} alt="deepthink" />
                        Search
                    </p>
                </div>
                <div className='flex items-center gap-2'>
                    <Image className='w-4' src={assets.pin_icon} alt="deepthink" />
                    <button className={`${prompt ? 'bg-primary' : 'bg-[#71717a]'} rounded-full p-2 cursor-pointer`}>
                        <Image className='w-3.5 aspect-square' src={prompt ? assets.arrow_icon : assets.arrow_icon_dull} alt="deepthink" />
                    </button>
                </div>
            </div>
        </form>
    )
}
