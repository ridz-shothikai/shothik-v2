import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const researchCoreApi = createApi({
  reducerPath: "researchCoreApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URI_WITHOUT_PREFIX,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("accessToken");
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Research"],
  endpoints: (builder) => ({
    // getChatResearches: builder.query({
    //   query: (chatId) => `/research/get_chat_researches/${chatId}`,
    //   providesTags: (result, error, chatId) => [
    //     { type: "Research", id: chatId },
    //   ],
    // }),
    getJobStatus: builder.query({
      query: (jobId) => `/deep-research/research/job/${jobId}/status`,
      keepUnusedDataFor: 0,
    }),
    // cancelJob: builder.mutation({
    //   query: (jobId) => ({
    //     url: `/research/job/${jobId}/cancel`,
    //     method: "POST",
    //   }),
    // }),
    // retryJob: builder.mutation({
    //   query: (jobId) => ({
    //     url: `/research/job/${jobId}/retry`,
    //     method: "POST",
    //   }),
    // }),
    // getQueueStats: builder.query({
    //   query: () => "/research/queue/stats",
    // }),
  }),
});

export const {
  // useGetChatResearchesQuery,
  useGetJobStatusQuery,
  // useCancelJobMutation,
  // useRetryJobMutation,
  // useGetQueueStatsQuery,
} = researchCoreApi;
