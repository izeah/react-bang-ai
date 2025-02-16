import ollama from "ollama";

class OpenAIChatCompletion {
    static async createCompletion(messages) {
        try {
            const resp = await ollama.chat({
                model: "deepseek-r1:1.5b",
                stream: true,
                messages: [
                    {
                        role: "user",
                        content: messages,
                    },
                ],
            });
            return resp;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

export default OpenAIChatCompletion;
