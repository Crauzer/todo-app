import axiosStatic from "axios";
import { env } from "./env";

export const axios = axiosStatic.create({ baseURL: env.VITE_API_URL });
