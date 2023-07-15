import { LoaderFunction, useLoaderData } from "react-router-dom";
import { getTodo } from "../../features/todos/api/getTodo";
import { queryClient } from "../../utils/query";
import { LoaderData } from "../../utils/router";
import { Todo } from "../../features/todos/types";

export const todosLoader = (({ params: { todoId } }): Promise<Todo> => {
  if (!todoId) {
    return Promise.reject("must provide todoId");
  }

  return queryClient.fetchQuery({
    queryKey: ["todos", todoId],
    queryFn: () => getTodo(todoId),
  });
}) satisfies LoaderFunction;

export const TodoRoute: React.FC = () => {
  const todo = useLoaderData() as LoaderData<typeof todosLoader>;

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-4xl">{todo.name}</h2>
      <span className="text-lg">{todo.createdAt}</span>
    </div>
  );
};
