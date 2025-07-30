import { createApi } from '@reduxjs/toolkit/query/react';
import {baseQuery} from "../config";

export const presentationApiSlice = createApi({
  reducerPath: "presentationApi",
  baseQuery: async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);
    // console.log(result, "Base Query Result");
    return result;
  },
  tagTypes: ["presentation", "logs", "slides"],
  endpoints: (builder) => ({
    // Create presentation
    createPresentation: builder.mutation({
      query: (message) => ({
        url: "/presentation/init",
        method: "POST",
        body: message,
      }),
      invalidatesTags: ["presentation"],
    }),

    // Fetch logs
    fetchLogs: builder.query({
      query: (presentationId) => `/presentation/logs/${presentationId}`,
      providesTags: (result, error, presentationId) => [
        { type: "logs", id: presentationId },
      ],
    }),

    // Fetch slides
    fetchSlides: builder.query({
      query: (presentationId) => `/presentation/slides/${presentationId}`,
      providesTags: (result, error, presentationId) => [
        { type: "slides", id: presentationId },
      ],
    }),

    // Fetch all presentations
    fetchAllPresentations: builder.query({
      query: () => "/presentation/get-slides",
      providesTags: ["presentation"],
    }),
  }),
});

export const {
  useCreatePresentationMutation,
  useFetchLogsQuery,
  useFetchSlidesQuery,
  useFetchAllPresentationsQuery,
} = presentationApiSlice;