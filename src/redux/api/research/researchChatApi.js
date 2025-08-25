import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../config";

export const researchChatApi = createApi({
  reducerPath: "researchChatApi",
  baseQuery: async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);
    // console.log(result, "Base Query Result");
    return result;
  },
  tagTypes: ["Chat"],
  endpoints: (builder) => ({
    createChat: builder.mutation({
      query: (name) => ({
        url: "/chat/create_chat",
        method: "POST",
        body: { name },
      }),
      invalidatesTags: ["Chat"],
    }),
    getMyChats: builder.query({
      query: () => "/chat/get_my_chats",
      providesTags: ["Chat"],
    }),
    getOneChat: builder.query({
      query: (id) => `/chat/get_one_chat/${id}`,
      providesTags: (result, error, id) => [{ type: "Chat", id }],
    }),
    updateChatName: builder.mutation({
      query: ({ id, name }) => ({
        url: `/chat/update_name/${id}`,
        method: "PUT",
        body: { name },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Chat", id }],
    }),
    deleteChat: builder.mutation({
      query: (id) => ({
        url: `/chat/delete_chat/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Chat"],
    }),
  }),
});

export const {
  useCreateChatMutation,
  useGetMyChatsQuery,
  useGetOneChatQuery,
  useUpdateChatNameMutation,
  useDeleteChatMutation,
} = researchChatApi;
