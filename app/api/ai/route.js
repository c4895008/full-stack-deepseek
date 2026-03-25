import OpenAI from "openai";
import connectDB from "@/config/db";
import Chat from "@/models/Chat";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
export const maxDuration = 60;
const openai = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey: process.env.DEEPSEEK_API_KEY
});
export async function POST(req) {
    try {
        const { userId } = getAuth(req);
        const { chatId, prompt } = await req.json();
        if (!userId) {
            return NextResponse.json({ success: false, message: "User not authenticated!" });
        }
        //Find the chat document in the database based on userId and chatId
        await connectDB();
        const data = await Chat.findOne({ _id: chatId, userId });
        //Create a User message object
        const userPrompt = {
            role: 'user',
            content: prompt,
            timestamp: Date.now()
        }
        data.messages.push(userPrompt);
        ///Call the DeepSeek API to get a chat completion
        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "deepseek-chat",
            store: true
        });
        const message = completion.choices[0].message;
        message.timestamp = Date.now();
        data.messages.push(message);
        data.save();
        return NextResponse.json({ success: true, data: message });
    } catch (error) {
        return NextResponse.json({ message: error.message, success: false });
    }
}
