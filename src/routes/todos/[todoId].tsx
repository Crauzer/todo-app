import { LoaderFunction, useLoaderData } from "react-router-dom";
import { getTodo } from "../../features/todos/api/getTodo";
import { queryClient } from "../../utils/query";
import { LoaderData } from "../../utils/router";
import { Todo } from "../../features/todos/types";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useUpdateTodo } from "../../features/todos/api/updateTodo";
import { MdClear, MdDriveFileRenameOutline } from "react-icons/md";
import dayjs from "dayjs";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { TodoTasks } from "../../features/todoTasks/components/TodoTasks";
import { Provider } from "jotai";
import { TodoTasksFilter } from "../../features/todoTasks/components/TodoTasksFilter";

export const todosLoader = (({ params: { todoId } }): Promise<Todo> => {
  if (!todoId) {
    return Promise.reject("must provide todoId");
  }

  return queryClient.fetchQuery({
    queryKey: ["todos", todoId],
    queryFn: () => getTodo(todoId),
  });
}) satisfies LoaderFunction;

const todoRenameFormSchema = z.object({
  name: z.string().min(1, "Name needs to be at least 1 character long"),
});

type TodoRenameFormData = z.infer<typeof todoRenameFormSchema>;

export const TodoRoute: React.FC = () => {
  const todo = useLoaderData() as LoaderData<typeof todosLoader>;

  const updateTodo = useUpdateTodo();

  const {
    register: registerRenameField,
    handleSubmit: handleRenameSubmit,
    reset: resetRename,
    formState: { errors: renameErrors },
  } = useForm<TodoRenameFormData>({
    resolver: zodResolver(todoRenameFormSchema),
    defaultValues: { name: "" },
    values: { name: todo.name },
  });

  const [isRenaming, setIsRenaming] = useState(false);

  useEffect(() => setIsRenaming(false), [todo]);

  const onRenameSubmit: SubmitHandler<TodoRenameFormData> = (data) => {
    updateTodo.mutate(
      { ...todo, name: data.name },
      { onSuccess: () => setIsRenaming(false) }
    );
  };

  return (
    <div className="flex flex-col gap-2 rounded-lg bg-base-300 p-4">
      {isRenaming ? (
        <form onSubmit={handleRenameSubmit(onRenameSubmit)}>
          <div className="flex flex-row items-center gap-1">
            <input
              {...registerRenameField("name")}
              type="text"
              className={clsx(
                "input-bordered input input-md text-xl",
                renameErrors.name && "input-error"
              )}
            />
            <button
              type="submit"
              title="Rename"
              className="btn-info btn-outline btn-sm btn ml-2 text-base"
            >
              <MdDriveFileRenameOutline />
            </button>
            <button
              type="button"
              title="Cancel"
              className="btn-ghost btn-sm btn text-base"
              onClick={() => {
                setIsRenaming(false);
                resetRename({ name: todo.name });
              }}
            >
              <MdClear />
            </button>
          </div>
          {renameErrors.name && (
            <p className="text-sm text-error">{renameErrors.name.message}</p>
          )}
        </form>
      ) : (
        <div
          role="button"
          className="btn-ghost btn max-w-screen-xl justify-start overflow-x-clip overflow-ellipsis text-4xl hover:rounded-lg hover:bg-base-100"
          onClick={() => setIsRenaming(true)}
        >
          {todo.name}
        </div>
      )}
      <span className="text-lg">{dayjs.utc(todo.createdAt).format()}</span>
      <Provider>
        <TodoTasksFilter />
        <TodoTasks todoId={todo.id} />
      </Provider>
    </div>
  );
};
