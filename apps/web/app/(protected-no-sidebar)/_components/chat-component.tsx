"use client";
import { Button } from "@repo/ui/components/button";
import { ScrollArea } from "@repo/ui/components/scroll-area";
import { Textarea } from "@repo/ui/components/textarea";
import { Divide, Loader2, Send } from "lucide-react";
import React, { ChangeEvent, useEffect } from "react";

export default function ChatComponent({
  isLoading,
  chatMessages,
  handleSendMessage,
  isMessageSent,
}: {
  isLoading: boolean;
  chatMessages: any[];
  handleSendMessage: (message: string) => void;
  isMessageSent: boolean;
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
  // console.log("Messages", messages);
  useEffect(() => {
    if (chatMessages) {
      console.log("chatMessages->", chatMessages);
      setMessages(chatMessages);
    }
  }, [chatMessages]);
  if (scrollAreaRef.current) {
    const scrollContainer = scrollAreaRef.current.querySelector(
      "[data-radix-scroll-area-viewport]"
    )!;
    if (scrollContainer) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }

  return (
    <div className="w-[30%] flex flex-col">
      <h3 className="text-xl w-full font-bold border-b text-center py-3">
        Chat
      </h3>
      <ScrollArea className="h-full" ref={scrollAreaRef}>
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : messages ? (
          messages.map((message) => (
            <div
              key={message.id}
              className={`${"bg-transparent"} p-2 text-foreground text-sm`}
            >
              {message.type === "TEXT" ? (
                <>
                  <span className={`${"text-foreground"} font-bold`}>
                    {message.sender.name} :{" "}
                  </span>
                  {message.message}
                </>
              ) : (
                <div className="text-gray-400 italic text-center w-full">
                  {message.message}
                </div>
              )}
            </div>
            // <div key={message.id}>{JSON.stringify(message)}</div>
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
        <Button
          className="p-3"
          onClick={() => {
            handleSendMessage(sendMessage);
            setSendMessage("");
          }}
          disabled={isMessageSent}
        >
          <Send />
        </Button>
      </div>
    </div>
  );
}
