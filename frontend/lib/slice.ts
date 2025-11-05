import { fetchBaseQuery } from "@reduxjs/toolkit/query";

export const ApiSlice = {
  reducePath: "api",
  baseQuery: fetchBaseQuery({}),
};
