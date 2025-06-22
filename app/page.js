'use client';
import React from 'react';
import { assets } from "@/assets/assets"
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Sidebar from '@/components/Sidebar';
import PromptBox from '@/components/PromptBox';
import Message from '@/components/Message';
export default function Home() {
  const [expand, setExpand] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  return (
    <div>
      <div className='flex h-screen'>
        <Sidebar expand={expand} setExpand={setExpand} />
        <div className='flex-1 flex flex-col items-center justify-center px-4 pb-8 bg-[#292a2d] text-white relative'>
          <div className='md:hidden absolute px-4 top-6 flex items-center justify-between w-full'>
            <Image alt='logo' onClick={() => setExpand(!expand)} className='rotate-180' src={assets.menu_icon} />
            <Image alt='logo' className='opacity-70' src={assets.chat_icon} />
          </div>
          {
            messages.length != 0 ? (
              <>
                <div className='flex items-center gap-3'>
                  <Image alt='logo' className='h-16' src={assets.logo_icon} />
                  <p className='text-2xl font-medium'>Hi,My name is DeepSeek.</p>
                </div>
                <p className='text-sm mt-2'>How can I help you today?</p>
              </>
            ) : (
              <>
                <Message role='user1' content='What is next js?'  />
              </>
            )
          }
          <PromptBox isLoading={isLoading} setIsLoading={setIsLoading} />
          <p className="text-xs absolute bottom-1 text-gray-500">
            AI-generated, for reference only
          </p>
        </div>
      </div>
    </div>
  );
}
