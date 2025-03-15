import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../config";

export const toolsApiSlice = createApi({
  reducerPath: "toolsApi",
  baseQuery: async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);
    return result;
  },
  tagTypes: ["tools"],
  endpoints: (builder) => ({
    spellChecker: builder.mutation({
      query: (payload) => {
        return {
          url: "/bangla-speel-check",
          method: "POST",
          body: payload,
        };
      },
    }),
  }),
});

export const { useSpellCheckerMutation } = toolsApiSlice;
