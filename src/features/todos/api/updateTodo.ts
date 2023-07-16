import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../../utils/query";
import { Todo } from "../types";
import { axios } from "../../../utils/axios";

export const updateTodo = (todo: Todo) =>
  axios.put<Todo>(`todos/${todo.id}`, todo).then((response) => response.data);

export const useUpdateTodo = () => {
  return useMutation({
    mutationFn: updateTodo,
    onMutate: async (todo: Todo) => {
      await queryClient.cancelQueries(["todos", todo.id]);

      const previousTodo = queryClient.getQueryData<Todo>(["todos", todo.id]);

      if (previousTodo) {
        queryClient.setQueryData<Todo>(["todos", todo.id], {
          ...previousTodo,
          ...todo,
          id: todo.id,
        });
      }

      return previousTodo;
    },
    onSettled: (data) => {
      if (data) {
        queryClient.invalidateQueries(["todos"]);
        queryClient.refetchQueries(["todos", data.id]);
      }
    },
  });
};
