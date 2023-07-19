import clsx from "clsx";
import { useRef } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import dayjs from "dayjs";
import { useCreateTodo } from "../features/todos/api/createTodo";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

const createTodoFormSchema = z.object({
  name: z.string().min(1, "Name needs to be at least 1 character long"),
});

type CreateTodoFormData = z.infer<typeof createTodoFormSchema>;

export const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
  const createTodo = useCreateTodo();

  const createTodoDialogRef = useRef<HTMLDialogElement>(null);

  const navigate = useNavigate();
  const {
    register: registerCreateTodoField,
    handleSubmit: handleCreateTodoSubmit,
    formState: { errors: createTodoErrors },
  } = useForm<CreateTodoFormData>({
    resolver: zodResolver(createTodoFormSchema),
  });

  const onCreateTodoSubmit: SubmitHandler<CreateTodoFormData> = (data) => {
    createTodo.mutate(
      {
        id: uuidv4(),
        name: data.name,
        createdAt: dayjs().utc().unix(),
        tasks: [],
      },
      {
        onSuccess: (data) => {
          createTodoDialogRef.current?.close();
          navigate(`/todos/${data.id}`, { replace: true });
        },
      }
    );
  };

  return (
    <div className="">
      <div className="navbar h-16 gap-2 bg-base-300">
        <a className="btn-ghost btn text-xl normal-case">ToDo</a>
        <button
          type="button"
          title="Add ToDo"
          className="btn-primary btn-sm btn"
          onClick={() => createTodoDialogRef.current?.showModal()}
        >
          +
        </button>
        <dialog ref={createTodoDialogRef} className="modal">
          <form
            method="dialog"
            className="modal-box flex flex-col items-center gap-2"
            onSubmit={handleCreateTodoSubmit(onCreateTodoSubmit)}
          >
            <input
              {...registerCreateTodoField("name")}
              type="text"
              className={clsx(
                "input-bordered input w-full",
                createTodoErrors.name && "input-error"
              )}
              placeholder="Name"
            />
            {createTodoErrors.name && (
              <p className="text-sm text-error">
                {createTodoErrors.name.message}
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
      </div>
      <div className="max-h-[calc(100vh-4rem)] overflow-y-scroll">
        {children}
      </div>
    </div>
  );
};
