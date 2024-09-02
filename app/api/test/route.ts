import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextResponse } from 'next/server'

export const POST = async (request) => {
    
  try {
    const genAI = new GoogleGenerativeAI("AIzaSyCc_2G-mFtQla6w4EQ2U3Vpc16JwHhBAtA");
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});
    const {question} = await request.json();
    const prompt = question;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const output = await response.text();
    return NextResponse.json({ data: output })
  } catch (e) {
    console.error(e)
  }
}
