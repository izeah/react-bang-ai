import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import OpenAIChatCompletion from "./lib/openai/chat-completion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import sendIcon from "./assets/icons/send.svg";
import stopIcon from "./assets/icons/stop.svg";
import aiIcon from "./assets/icons/ai.svg";
import checkIcon from "./assets/icons/check.svg";
import copyIcon from "./assets/icons/copy.svg";
import userIcon from "./assets/icons/user.svg";

function App() {
  const [chatHistory, setChatHistory] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false); // New state to track streaming
  const chatEndRef = useRef(null);
  const chatRef = useRef(null);
  let reader = useRef(null); // Use useRef to persist the reader across renders

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  useEffect(() => {
    // Load chat history from localStorage when the component mounts
    const savedChatHistory = JSON.parse(localStorage.getItem("chatHistory"));
    if (savedChatHistory) {
      setChatHistory(savedChatHistory);
    }
  }, []);

  useEffect(() => {
    // Save chat history to localStorage whenever it changes
    if (chatHistory.length > 0) {
      localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
    }
  }, [chatHistory]);

  const handleSubmit = useCallback(async (e) => {
    if (!chatRef.current?.value?.trim()) return; // Prevent empty messages

    if (e.type === "click" || (e.key === "Enter" && !e.shiftKey)) {
      e.preventDefault(); // Prevent the default behavior of the Enter key

      const inputMessage = chatRef.current.value;

      // Clear input field after sending
      chatRef.current.value = "";

      const newMessage = { sender: "user", text: inputMessage };
      setChatHistory((prevChatHistory) => [...prevChatHistory, newMessage]);

      // Add a placeholder for the bot's response
      const botMessage = { sender: "bot", text: "" };
      setChatHistory((prevChatHistory) => [...prevChatHistory, botMessage]);

      try {
        setIsStreaming(true); // Start streaming
        const responseStream = await OpenAIChatCompletion.createCompletion(
          inputMessage
        );

        reader.current = responseStream.getReader();
        const decoder = new TextDecoder("utf-8");
        while (true) {
          const { value, done } = await reader.current.read();
          if (done) break;
          const decodedChunk = decoder.decode(value);
          const lines = decodedChunk.split("\n");
          const parsedLines = lines
            .map((line) => line.replace("data: ", "").trim())
            .filter((line) => line !== "" && line !== "[DONE]")
            .map((line) => JSON.parse(line));

          for (const parsedLine of parsedLines) {
            await new Promise((resolve) => setTimeout(resolve, 50));
            const content = parsedLine.choices[0].delta.content;
            if (content) {
              // Update the last message in chatHistory with the new chunk
              setChatHistory((prevChatHistory) => {
                const updatedHistory = [...prevChatHistory];
                updatedHistory[updatedHistory.length - 1].text += content;
                return updatedHistory;
              });
            }
          }
        }
      } catch (error) {
        console.error("Error creating completion:", error);
        setChatHistory((prevChatHistory) => {
          const updatedHistory = [...prevChatHistory];
          updatedHistory[updatedHistory.length - 1].text =
            "maaf saat ini mengalami kendala, silahkan coba lagi nanti";
          return updatedHistory;
        });
      } finally {
        setIsStreaming(false); // Stop streaming
      }
    }
  }, []);

  const stopStreaming = useCallback(() => {
    if (reader.current) {
      reader.current.cancel(); // Cancel the reader to stop streaming
      setIsStreaming(false);
    }
  }, []);

  const renderers = useMemo(
    () => ({
      code: ({ node, inline, className, children, ...props }) => {
        const match = /language-(\w+)/.exec(className || "");
        const codeString = String(children).replace(/\n$/, "");
        const [isCopied, setIsCopied] = useState(false);
        const copyToClipboard = () => {
          setIsCopied(true);
          navigator.clipboard.writeText(codeString);
          setTimeout(() => {
            setIsCopied(false);
          }, 1000);
        };

        return !inline && match ? (
          <div className="bg-gray-700 pt-5 relative rounded-t-lg rounded-b-none overflow-hidden">
            <span className="absolute left-0 top-0 m-0 text-white px-2 py-1 rounded focus:outline-none text-[10px]">
              {match[1]}
            </span>
            <button
              onClick={copyToClipboard}
              className="absolute right-0 top-0 m-0 text-white px-2 py-1 rounded focus:outline-none text-[10px]"
            >
              <img
                src={isCopied ? checkIcon : copyIcon}
                alt="Copy"
                className="w-3 h-3 mr-1 m-0 p-0 inline-block"
              />
              {isCopied ? "Copied!" : "Copy code"}
            </button>
            <SyntaxHighlighter
              style={oneDark}
              language={match[1]}
              children={codeString}
              PreTag="div"
              {...props}
            />
          </div>
        ) : (
          <code className={className} {...props}>
            {children}
          </code>
        );
      },
    }),
    []
  );

  return (
    <div className="bg-gray-900 text-gray-100 w-full min-h-screen flex justify-center items-start dark:bg-gray-800 dark:text-gray-50">
      <div className="w-[98%] md:w-1/2 h-full flex flex-col">
        <div className="fixed top-0 left-0 w-full bg-gray-800 text-white py-4 text-2xl text-center z-10">
          Ngobrol bareng Bang.AI
        </div>
        <div className="flex-1 mt-16 mb-24 md:mt-24 md:mb-36">
          {chatHistory.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.sender === "bot" ? "justify-start" : "justify-end"
              } mt-2 mx-2`}
            >
              {message.sender === "bot" && (
                <div className="flex items-center mr-2 w-10 h-10 rounded-full bg-gray-300 shrink-0">
                  <img
                    src={aiIcon}
                    alt="Bot Avatar"
                    className="w-6 h-6 m-auto"
                  />
                </div>
              )}
              <div
                className={`${
                  message.sender === "bot" ? "bg-gray-300" : "bg-green-500"
                } rounded-lg px-4 py-2 text-black max-sm:max-w-xs max-w-xl table-container`}
              >
                <ReactMarkdown
                  className="prose prose-sm dark:prose-dark"
                  children={message.text}
                  components={renderers}
                  remarkPlugins={[remarkGfm]}
                />
              </div>
              {message.sender === "user" && (
                <div className="flex items-center ml-2 w-10 h-10 rounded-full bg-gray-300 shrink-0">
                  <img
                    src={userIcon}
                    alt="User Avatar"
                    className="w-6 h-6 m-auto"
                  />
                </div>
              )}
            </div>
          ))}
          <div ref={chatEndRef}></div>
        </div>
        <div className="p-2 fixed bottom-0 m-auto w-[98%] md:w-1/2 bg-gray-900 dark:bg-gray-800">
          <div className="flex items-center">
            <textarea
              onKeyDown={handleSubmit}
              className="w-full border rounded-xl px-4 py-2 dark:bg-gray-700 dark:text-gray-200 resize-none"
              ref={chatRef}
              placeholder="Type your message here..."
              onInput={(e) => {
                const textarea = e.target;
                textarea.rows = 1; // reset rows to 1 for recalculation
                const lineHeight = parseInt(
                  window.getComputedStyle(textarea).lineHeight
                );
                const lines = Math.ceil(textarea.scrollHeight / lineHeight);
                textarea.rows = Math.min(5, lines);
              }}
            />
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 rounded-lg px-4 py-2 text-white ml-2"
              onClick={isStreaming ? stopStreaming : handleSubmit}
            >
              <img
                src={isStreaming ? stopIcon : sendIcon}
                alt="Send"
                className="w-6 h-6"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
