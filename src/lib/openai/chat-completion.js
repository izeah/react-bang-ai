class OpenAIChatCompletion {
    static async createCompletion(messages) {
        try {
            const options = {
                method: "POST",
                headers: {
                    accept: "application/json",
                    "content-type": "application/json",
                    Authorization: import.meta.env.VITE_OPENAI_API_KEY,
                },
                body: JSON.stringify({
                    model: "llama-3-1-70b",
                    temperature: 0.1,
                    max_tokens: 500,
                    messages: [{ role: "user", content: messages }],
                    stream: true,
                }),
            };
            const resp = await fetch(import.meta.env.VITE_OPENAI_URL, options);
            if (!resp.ok) {
                throw new Error("Network response was not ok");
            }

            // const data = await resp.json();
            // const message = data?.[0]?.choices?.[0]?.message?.content || "";
            // return message;

            return resp.body; // Return the ReadableStream
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

export default OpenAIChatCompletion;
