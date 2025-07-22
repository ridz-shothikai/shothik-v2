// api/sheetApiSlice.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const sheetApiSlice = createApi({
  reducerPath: "sheetApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://sheetai.pixigenai.com/api",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("sheetai-token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["ChatHistory"],
  endpoints: (builder) => ({
    getChatHistory: builder.query({
      query: (chatId) => `/conversation/get_chat_conversations/${chatId}`,
      providesTags: ["ChatHistory"],
      // Transform the response to include completion status
      transformResponse: (response) => {
        const lastConversation = response[response.length - 1];
        let isIncomplete = false;

        if (lastConversation?.events) {
          const events = lastConversation.events;
          const hasResponse = lastConversation.response?.rows;
          const isCompleted = events.some(
            (event) => event.step === "completed"
          );
          const isFailed = events.some(
            (event) =>
              event.step === "failed" ||
              event.step === "error" ||
              event.message?.toLowerCase().includes("failed") ||
              event.message?.toLowerCase().includes("error")
          );

          isIncomplete = !isCompleted && !isFailed && !hasResponse;
        }

        return {
          conversations: response,
          isIncomplete,
          lastConversationId: lastConversation?._id,
        };
      },
    }),
  }),
});

export const { useGetChatHistoryQuery } = sheetApiSlice;
