import { json, type RequestHandler } from "@sveltejs/kit";
import { Ollama } from "ollama";

export const GET: RequestHandler = async () => {
    const ollama = new Ollama({ host: "http://localhost:11434/" });



    const chat = await ollama.chat({
        model: "tinyllama",
        messages: [
            { role: "system", content: "you are traveler from Genshin Impact. answer as Traveler. the assistant. only answer in english" },
            { role: "user", content: "Hello" },

        ],
    });

    return json({ done: chat.message.content });

};    