import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../config";

export const blogApiSlice = createApi({
  reducerPath: "blogApi",
  baseQuery: async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);
    return result;
  },
  tagTypes: ["blog", "blog-categories"],
  endpoints: (builder) => ({
    category: builder.query({
      query: () => {
        return {
          url: `/blog/category/all`,
          method: "GET",
        };
      },
    }),
    getBlogs: builder.query({
      query: (options) => {
        return {
          url: `/blog/all?page=${options.page}&categoryId=${options.selectedCategory}&search=${options.debouncedValue}`,
          method: "GET",
        };
      },
    }),
    newsletter: builder.mutation({
      query: (body) => {
        return {
          url: "/blog/newsletter",
          method: "POST",
          body,
        };
      },
    }),
  }),
});

export const { useCategoryQuery, useGetBlogsQuery, useNewsletterMutation } =
  blogApiSlice;
