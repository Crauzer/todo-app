import { LoaderFunction, useLoaderData } from "react-router-dom";
import { getTodo } from "../../features/todos/api/getTodo";
import { queryClient } from "../../utils/query";
import { LoaderData } from "../../utils/router";
import { Todo } from "../../features/todos/types";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useUpdateTodo } from "../../features/todos/api/updateTodo";
import { MdClear, MdDriveFileRenameOutline } from "react-icons/md";
import dayjs, { Dayjs } from "dayjs";
import { optional, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { TodoTasks } from "../../features/todoTasks/components/TodoTasks";

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
    <div className="flex flex-col gap-2 p-4 rounded-lg bg-base-300">
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
              className="ml-2 text-base btn-info btn-outline btn-sm btn"
            >
              <MdDriveFileRenameOutline />
            </button>
            <button
              type="button"
              title="Cancel"
              className="text-base btn-ghost btn-sm btn"
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
          className="justify-start max-w-screen-xl text-4xl btn-ghost btn overflow-x-clip overflow-ellipsis hover:rounded-lg hover:bg-base-100"
          onClick={() => setIsRenaming(true)}
        >
          {todo.name}
        </div>
      )}
      <span className="text-lg">{dayjs.utc(todo.createdAt).format()}</span>
      <TodoTasks todoId={todo.id}/>
    </div>
  );
};
