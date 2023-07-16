import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../../utils/query";
import { Todo } from "../types";
import { axios } from "../../../utils/axios";

export const createTodo = (todo: Todo) =>
  axios.post<Todo>(`todos`, todo).then((response) => response.data);

export const useCreateTodo = () => {
  return useMutation({
    mutationFn: createTodo,
    onMutate: async (todo: Todo) => {
      await queryClient.cancelQueries(["todos"]);

      const previousTodos = queryClient.getQueryData<Todo[]>(["todos"]);

      if (previousTodos) {
        queryClient.setQueryData<Todo[]>(
          ["todos"],
          [...(previousTodos || []), todo]
        );
      }

      return previousTodos;
    },
    onSettled: (data) => {
      if (data) {
        queryClient.invalidateQueries(["todos"]);
      }
    },
  });
};
