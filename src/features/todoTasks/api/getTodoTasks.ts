import { useQuery } from "@tanstack/react-query";
import { axios } from "../../../utils/axios";
import { TodoTask } from "../types";

export const getTodoTasks = (todoId: string) =>
  axios
    .get<TodoTask[]>(`todos/${todoId}/tasks`)
    .then((response) => response.data);

export const useTodoTasks = (todoId: string) => {
  return useQuery({
    queryKey: ["todos", todoId, "tasks"],
    queryFn: () => getTodoTasks(todoId),
  });
};
