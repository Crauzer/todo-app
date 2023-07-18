import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../../utils/query";
import { TodoTask } from "../types";
import { axios } from "../../../utils/axios";

export const deleteTodoTask = (todoId: string, todoTaskId: string) =>
  axios
    .delete<TodoTask>(`todos/${todoId}/tasks/${todoTaskId}`)
    .then((response) => response.data);

export const useDeleteTodoTask = (todoId: string) => {
  return useMutation({
    mutationFn: (todoTaskId: string) => deleteTodoTask(todoId, todoTaskId),
    onMutate: async (todoTaskIdToRemove: string) => {
      await queryClient.cancelQueries(["todos", todoId, "tasks"]);

      const previousTodoTasks = queryClient.getQueryData<TodoTask[]>([
        "todos",
        todoId,
        "tasks",
      ]);

      if (previousTodoTasks) {
        queryClient.setQueryData<TodoTask[]>(
          ["todos", todoId, "tasks"],
          previousTodoTasks.filter(
            (todoTask) => todoTask.id !== todoTaskIdToRemove
          )
        );
      }
    },
    onSettled: (todoTask) => {
      queryClient.invalidateQueries(["todos", todoTask?.todoId, "tasks"]);
    },
  });
};
