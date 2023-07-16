import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../../utils/query";
import { Todo } from "../types";
import { axios } from "../../../utils/axios";

export const deleteTodo = (todoId: string) => axios.delete(`todos/${todoId}`);

export const useDeleteTodo = () => {
  return useMutation({
    mutationFn: deleteTodo,
    onMutate: async (todoIdToRemove: string) => {
      await queryClient.cancelQueries(["todos"]);

      const previousTodos = queryClient.getQueryData<Todo[]>(["todos"]);

      if (previousTodos) {
        queryClient.setQueryData<Todo[]>(
          ["todos"],
          previousTodos.filter((todo) => todo.id !== todoIdToRemove)
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(["todos"]);
    },
  });
};
