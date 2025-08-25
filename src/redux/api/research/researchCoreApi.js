import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../config";

export const researchCoreApi = createApi({
  reducerPath: "researchCoreApi",
  baseQuery: async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);
    // console.log(result, "Base Query Result");
    return result;
  },
  tagTypes: ["Research"],
  endpoints: (builder) => ({
    getChatResearches: builder.query({
      query: (chatId) => `/research/get_chat_researches/${chatId}`,
      providesTags: (result, error, chatId) => [
        { type: "Research", id: chatId },
      ],
    }),
    getJobStatus: builder.query({
      query: (jobId) => `/research/job/${jobId}/status`,
      providesTags: (result, error, jobId) => [{ type: "Research", id: jobId }],
    }),
    cancelJob: builder.mutation({
      query: (jobId) => ({
        url: `/research/job/${jobId}/cancel`,
        method: "POST",
      }),
    }),
    retryJob: builder.mutation({
      query: (jobId) => ({
        url: `/research/job/${jobId}/retry`,
        method: "POST",
      }),
    }),
    getQueueStats: builder.query({
      query: () => "/research/queue/stats",
    }),
  }),
});

export const {
  useGetChatResearchesQuery,
  useGetJobStatusQuery,
  useCancelJobMutation,
  useRetryJobMutation,
  useGetQueueStatsQuery,
} = researchCoreApi;
