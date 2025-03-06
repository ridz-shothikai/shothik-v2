import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout } from "./slice/auth";

const baseQuery = fetchBaseQuery({
  mode: "cors",
  baseUrl: process.env.NEXT_PUBLIC_API_URI,
  prepareHeaders: async (headers, { getState }) => {
    const token =
      getState()?.auth?.accessToken || localStorage.getItem("accessToken");

    headers.set("Content-Type", "application/json");
    headers.set("Access-Control-Allow-Origin", "*");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);
    if (result?.error?.status === 401) {
      api.dispatch(logout());
      localStorage.clear();
    }
    return result;
  },
  tagTypes: ["user-limit", "User"],
  endpoints: (builder) => ({}),
});
