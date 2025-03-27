import { json, type RequestHandler } from "@sveltejs/kit";
import { Ollama } from "ollama";

export const POST: RequestHandler = async ({ request }) => {
    const { query } = await request.json(); 

    const ollama = new Ollama({ host: "http://localhost:11434/" });

    const dataOfMasterUser = {
        name: "Mark De Jesus",
        Hobbies: ["playing Genshin Impact", "Playing Call of Duty Mobile", "Playing Wildrift", "Playing Mobile Legends"],
        Food: ["Coffee", "Matcha", "Chicken Wings"],
        Color: ["Black", "White", "Grey"],
        Girlfriend: ["Unknown"],
        Course: ["4th year student of Bachelor of Science in Computer Science"],
        Age: ["22 years old"],
        userType: ["Master User"],
    };

    const systemMessage = query.toLowerCase().includes("master user")
        ? `Here is the information of the master user: ${JSON.stringify(dataOfMasterUser)}`
        : "Respond only based on the information provided in the query.";

    const chat = await ollama.chat({
        model: "tinyllama",
        messages: [
            {
                role: "system",
                content: systemMessage,
            },
            {
                role: "user",
                content: query,
            },
        ],
    });

    return json({ message: chat.message.content });
};
