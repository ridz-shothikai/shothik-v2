"use client";

import { cn } from "@/lib/utils";
import { selectCategorizedLogs } from "@/redux/slice/presentationSlice";
import { User } from "lucide-react";
import { useSelector } from "react-redux";

export default function MessageBubble({ logs }) {
  //   console.log("MessageBubble logs:", logs);
  const { userMessages, agentMessages } = useSelector(selectCategorizedLogs);

  const isUserMessage = logs?.author === "user";

  const timeFormatter = new Intl.DateTimeFormat([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  //   console.log("MessageBubble userMessages:", userMessages);
  return (
    <div
      className={cn(
        `flex ${isUserMessage ? "justify-end" : "justify-start"} mb-6`,
      )}
    >
      <div className={`${isUserMessage ? "max-w-[80%]" : "max-w-[90%]"}`}>
        {isUserMessage ? (
          <>
            <div className="mb-1.5 flex items-center justify-end gap-2 opacity-70">
              <span className="text-muted-foreground text-[11px]">
                {timeFormatter.format(
                  new Date(logs?.timestamp || logs?.lastUpdated),
                )}
              </span>
              <span className="text-muted-foreground text-xs">You</span>

              <div className="bg-primary flex h-5 w-5 shrink-0 items-center justify-center rounded-full">
                <User className="text-primary-foreground h-3 w-3" />
              </div>
            </div>
            <div className="bg-primary rounded-t-[18px] rounded-br-[4px] rounded-bl-[18px] px-4 py-3 wrap-break-word">
              <span className="text-primary-foreground text-sm leading-[1.5] md:text-base">
                {logs?.content || logs?.text}
              </span>
            </div>
          </>
        ) : (
          <>{logs?.content || logs?.text || logs?.author}</>
        )}
      </div>
    </div>
  );
}
