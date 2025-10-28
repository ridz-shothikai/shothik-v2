"use client";

import { cn } from "@/lib/utils";
import { selectCategorizedLogs } from "@/redux/slice/presentationSlice";
import PersonIcon from "@mui/icons-material/Person";
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
              <span className="text-[11px] text-[#637381]">
                {timeFormatter.format(
                  new Date(logs?.timestamp || logs?.lastUpdated),
                )}
              </span>
              <span className="text-xs text-[#637381]">You</span>

              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1976d2]">
                <PersonIcon sx={{ fontSize: 12, color: "white" }} />
              </div>
            </div>
            <div className="rounded-t-[18px] rounded-br-[4px] rounded-bl-[18px] bg-[#1976d2] px-4 py-3 wrap-break-word">
              <span className="text-sm leading-[1.5] text-white md:text-base">
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
