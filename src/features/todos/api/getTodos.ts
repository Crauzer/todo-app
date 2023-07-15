import { useQuery } from "@tanstack/react-query";
import { axios } from "../../../utils/axios";
import { Todo } from "../types";

export const getTodos = () =>
  axios.get<Todo[]>("todos").then((response) => response.data);

export const useTodos = () => {
  return useQuery({ queryKey: ["todos"], queryFn: getTodos });
};
