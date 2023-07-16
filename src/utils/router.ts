import { LoaderFunction } from "react-router-dom";
import { env } from "./env";

export type LoaderData<TLoaderFn extends LoaderFunction> = Awaited<
  ReturnType<TLoaderFn>
> extends Response | infer D
  ? D
  : never;

export const buildPath = (path: string) => `${env.VITE_APP_URL}${path}`;
