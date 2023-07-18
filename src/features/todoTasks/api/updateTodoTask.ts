import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../../utils/query";
import { axios } from "../../../utils/axios";
import { TodoTask } from "../types";

export const updateTodoTask = (todoTask: TodoTask) =>
  axios
    .put<TodoTask>(`todos/${todoTask.todoId}/tasks/${todoTask.id}`, todoTask)
    .then((response) => response.data);

export const useUpdateTodoTask = (todoId: string) => {
  return useMutation({
    mutationFn: updateTodoTask,
    onMutate: async (todoTask: TodoTask) => {
      await queryClient.cancelQueries(["todos", todoId, "tasks", todoTask.id]);

      const previousTodoTask = queryClient.getQueryData<TodoTask>([
        "todos",
        todoId,
        "tasks",
        todoTask.id,
      ]);

      if (previousTodoTask) {
        queryClient.setQueryData<TodoTask>(
          ["todos", todoId, "tasks", todoTask.id],
          {
            ...previousTodoTask,
            ...todoTask,
            id: todoTask.id,
          }
        );
      }

      return previousTodoTask;
    },
    onSettled: (data) => {
      if (data) {
        queryClient.invalidateQueries(["todos", data.todoId, "tasks"]);
        queryClient.refetchQueries(["todos", data.todoId, "tasks", data.id]);
      }
    },
  });
};
