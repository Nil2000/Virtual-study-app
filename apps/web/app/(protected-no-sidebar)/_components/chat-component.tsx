"use client";
import { Button } from "@repo/ui/components/button";
import { ScrollArea } from "@repo/ui/components/scroll-area";
import { Textarea } from "@repo/ui/components/textarea";
import { Divide, Loader2, Send } from "lucide-react";
import React, { ChangeEvent, useEffect } from "react";

const mockMessages = [
  {
    id: 1,
    message:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    owner: true,
    name: "John",
  },
  {
    id: 2,
    message: "Hello",
    owner: false,
    name: "Jane",
  },
  {
    id: 3,
    message:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    owner: true,
    name: "John",
  },
  {
    id: 4,
    message: "Hello",
    owner: false,
    name: "Jane",
  },
  {
    id: 5,
    message:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    owner: true,
    name: "John",
  },
  {
    id: 6,
    message: "Hello",
    owner: false,
    name: "Jane",
  },
  {
    id: 7,
    message:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    owner: true,
    name: "John",
  },
  {
    id: 8,
    message: "Hello",
    owner: false,
    name: "Jane",
  },
  {
    id: 9,
    message: "Hello How are you",
    owner: false,
    name: "Jane",
  },
  {
    id: 10,
    message: "Hello How are you",
    owner: false,
    name: "Jane",
  },
];

export default function ChatComponent({
  isLoading,
  chatMessages,
}: {
  isLoading: boolean;
  chatMessages: any[];
}) {
  const [sendMessage, setSendMessage] = React.useState<string>("");
  const [messages, setMessages] = React.useState<any[]>([]);
  const scrollAreaRef = React.useRef<HTMLDivElement | null>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const defaultRows = 1;
  const maxRows = undefined;
  const handleInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    textarea.style.height = "auto";

    const style = window.getComputedStyle(textarea);
    const borderHeight =
      parseInt(style.borderTopWidth) + parseInt(style.borderBottomWidth);
    const paddingHeight =
      parseInt(style.paddingTop) + parseInt(style.paddingBottom);

    const lineHeight = parseInt(style.lineHeight);
    const maxHeight = maxRows
      ? lineHeight * maxRows + borderHeight + paddingHeight
      : Infinity;

    const newHeight = Math.min(textarea.scrollHeight + borderHeight, maxHeight);

    textarea.style.height = `${newHeight}px`;
    setSendMessage(e.target.value);
  };
  useEffect(() => {
    if (chatMessages) {
      console.log("chatMessages", chatMessages);
      setMessages((prev) => [...prev, ...chatMessages]);
    }
  }, [chatMessages]);

  useEffect(() => {
    // if (scrollAreaRef.current) {
    //   const scrollContainer = scrollAreaRef.current.querySelector(
    //     "[data-radix-scroll-area-viewport]"
    //   )!;
    //   if (scrollContainer) {
    //     scrollContainer.scrollTop = scrollContainer.scrollHeight;
    //   }
    // }
  }, []);

  return (
    <div className="w-[30%] flex flex-col">
      <h3 className="text-xl w-full font-bold border-b text-center py-3">
        Chat
      </h3>
      <ScrollArea className="h-full" ref={scrollAreaRef}>
        {/* {mockMessages.map((message) => (
					<div
						key={message.id}
						className={`${
							message.owner ? "bg-foreground/10" : "bg-transparent"
						} p-2 text-foreground text-sm`}
					>
						<span className={`${message.owner && "text-blue-500"} font-bold`}>
							{message.name}{" "}
						</span>
						: {message.message}
					</div>
				))} */}
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary">
              <Loader2 />
              Chat loading...
            </div>
          </div>
        ) : messages ? (
          messages.map((message) => (
            <div
              key={message.id}
              className={`${"bg-transparent"} p-2 text-foreground text-sm`}
            >
              {message.type === "TEXT" ? (
                <span className={`${"text-blue-500"} font-bold`}>
                  {message.name} {message.message}
                </span>
              ) : (
                <div>{message.message}</div>
              )}
            </div>
          ))
        ) : (
          <div className="text-white">No messages</div>
        )}
      </ScrollArea>
      <div className="mt-auto pl-1 flex space-x-1">
        <Textarea
          placeholder="Write your message..."
          ref={textareaRef}
          onChange={handleInput}
          rows={defaultRows}
          className="min-h-[none] resize-none"
          value={sendMessage}
        />
        <Button className="p-3">
          <Send />
        </Button>
      </div>
    </div>
  );
}
