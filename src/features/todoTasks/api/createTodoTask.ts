import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../../utils/query";
import { TodoTask } from "../types";
import { axios } from "../../../utils/axios";

export const createTodoTask = (todoId: string, todoTask: TodoTask) =>
  axios
    .post<TodoTask>(`todos/${todoId}/tasks`, todoTask)
    .then((response) => response.data);

export const useCreateTodoTask = (todoId: string) => {
  return useMutation({
    mutationFn: (todoTask: TodoTask) => createTodoTask(todoId, todoTask),
    onMutate: async (todoTask: TodoTask) => {
      await queryClient.cancelQueries(["todos"]);

      const previousTodoTasks = queryClient.getQueryData<TodoTask[]>([
        "todos",
        todoTask.id,
        "tasks",
      ]);

      if (previousTodoTasks) {
        queryClient.setQueryData<TodoTask[]>(
          ["todos", todoTask.id, "tasks"],
          [...(previousTodoTasks || []), todoTask]
        );
      }

      return previousTodoTasks;
    },
    onSettled: (data) => {
      if (data) {
        queryClient.invalidateQueries(["todos", data.todoId, "tasks"]);
      }
    },
  });
};
