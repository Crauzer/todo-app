import { SubmitHandler, useForm } from "react-hook-form";
import { useTodoTasks } from "../api/getTodoTasks";
import { TodoTask } from "../types";
import { useCreateTodoTask } from "../api/createTodoTask";
import { useRef } from "react";
import { z } from "zod";
import dayjs from "dayjs";
import clsx from "clsx";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDeleteTodoTask } from "../api/deleteTodoTask";
import { useUpdateTodoTask } from "../api/updateTodoTask";
import { useAtom } from "jotai";
import { StateFilter, filterAtom } from "./TodoTasksFilter";

const createTodoTaskFormSchema = z.object({
  name: z.string().min(1, "Name needs to be at least 1 character long"),
  deadline: z
    .string()
    .refine(
      (deadline) => dayjs(deadline, "YYYY-MM-DD").isAfter(dayjs()),
      "Deadline must be after today"
    ),
  description: z
    .string()
    .min(1, "Description needs to be at least 1 character long"),
});

type CreateTodoTaskFormData = z.infer<typeof createTodoTaskFormSchema>;

type TodoTasksProps = {
  todoId: string;
};

const doesTodoTaskMatchStateFilter = (
  todoTask: TodoTask,
  filter: StateFilter
) => {
  switch (filter) {
    case "all":
      return true;
    case "active":
      return !todoTask.isFinished;
    case "finished":
      return todoTask.isFinished;
  }
};

export const TodoTasks: React.FC<TodoTasksProps> = ({ todoId }) => {
  const todoTasks = useTodoTasks(todoId);
  const createTodoTask = useCreateTodoTask(todoId);

  const createTodoTaskDialogRef = useRef<HTMLDialogElement>(null);

  const [filter] = useAtom(filterAtom);

  const {
    register: registerCreateTodoTaskField,
    handleSubmit: handleCreateTodoTaskSubmit,
    formState: { errors: createTodoTaskErrors },
    reset: resetRegisterCreateTodoTask,
  } = useForm<CreateTodoTaskFormData>({
    resolver: zodResolver(createTodoTaskFormSchema),
  });

  if (todoTasks.isLoading) {
    return <span className="loagin loading loading-dots loading-lg" />;
  }

  const onCreateTodoTaskSubmit: SubmitHandler<CreateTodoTaskFormData> = (
    data
  ) => {
    createTodoTask.mutate(
      {
        id: "",
        todoId: "",
        name: data.name,
        isFinished: false,
        deadline: dayjs(data.deadline, "YYYY-MM-DD").unix(),
        description: data.description,
      },
      {
        onSuccess: () => {
          createTodoTaskDialogRef.current?.close();
          resetRegisterCreateTodoTask();
        },
      }
    );
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        className="btn-primary btn ml-auto w-fit"
        onClick={() => createTodoTaskDialogRef.current?.showModal()}
      >
        Create Task
      </button>
      <dialog ref={createTodoTaskDialogRef} className="modal">
        <form
          method="dialog"
          className="modal-box flex flex-col items-center gap-2"
          onSubmit={handleCreateTodoTaskSubmit(onCreateTodoTaskSubmit)}
        >
          <input
            {...registerCreateTodoTaskField("name")}
            type="text"
            className={clsx(
              "input-bordered input w-full",
              createTodoTaskErrors.name && "input-error"
            )}
            placeholder="Name"
          />
          {createTodoTaskErrors.name && (
            <p className="text-sm text-error">
              {createTodoTaskErrors.name.message}
            </p>
          )}
          <input
            {...registerCreateTodoTaskField("deadline")}
            type="date"
            className={clsx(
              "input-bordered input w-full",
              createTodoTaskErrors.deadline && "input-error"
            )}
            placeholder="Deadline"
          />
          {createTodoTaskErrors.deadline && (
            <p className="text-sm text-error">
              {createTodoTaskErrors.deadline.message}
            </p>
          )}
          <textarea
            {...registerCreateTodoTaskField("description")}
            className={clsx(
              "textarea-bordered  textarea w-full",
              createTodoTaskErrors.description && "textarea-error"
            )}
            placeholder="Description"
          />
          {createTodoTaskErrors.description && (
            <p className="text-sm text-error">
              {createTodoTaskErrors.description.message}
            </p>
          )}
          <button type="submit" className="btn-primary btn w-fit">
            Create
          </button>
        </form>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
      <div className="join-vertical join w-full">
        {todoTasks.data
          ?.filter((todoTask) => {
            if (filter.nameFilter) {
              return (
                todoTask.name.includes(filter.nameFilter) &&
                doesTodoTaskMatchStateFilter(todoTask, filter.stateFilter)
              );
            }

            return doesTodoTaskMatchStateFilter(todoTask, filter.stateFilter);
          })
          .map((todoTask) => (
            <TodoTaskItem
              key={todoTask.id}
              todoId={todoId}
              todoTask={todoTask}
            />
          ))}
      </div>
    </div>
  );
};

const TodoTaskItem: React.FC<{ todoId: string; todoTask: TodoTask }> = ({
  todoId,
  todoTask,
}) => {
  const deleteTodoTask = useDeleteTodoTask(todoId);
  const updateTodoTask = useUpdateTodoTask(todoId);

  return (
    <div className="collapse-arrow join-item collapse border border-base-100">
      <input type="radio" name="todo-tasks-accordion" />
      <div className="collapse-title text-xl font-medium">{todoTask.name}</div>
      <div className="collapse-content">
        <div className="flex flex-col gap-2">
          <div className="form-control">
            <label className="label w-fit cursor-pointer gap-2">
              <span className="label-text">Finished</span>
              <input
                type="checkbox"
                className="checkbox"
                checked={todoTask.isFinished}
                onChange={(event) =>
                  updateTodoTask.mutate({
                    ...todoTask,
                    isFinished: event.target.checked,
                  })
                }
              />
            </label>
          </div>
          <p>{todoTask.description}</p>
          <div className="flex w-full">
            <button
              className="btn-error btn ml-auto"
              onClick={() => deleteTodoTask.mutate(todoTask.id)}
            >
              Delete Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
