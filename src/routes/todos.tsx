import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useTodos } from "../features/todos/api/getTodos";
import clsx from "clsx";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { useDeleteTodo } from "../features/todos/api/deleteTodo";

export default function Todos() {
  const todos = useTodos();
  const deleteTodo = useDeleteTodo();

  const navigate = useNavigate();

  return (
    <div className="flex w-full flex-row gap-1">
      <div className="flex h-[calc(100vh-4rem)] w-52 flex-col overflow-y-scroll">
        {todos.isLoading ? (
          <span className="loading loading-dots loading-lg" />
        ) : todos.isSuccess ? (
          todos.data.map((todo) => (
            <NavLink
              key={todo.id}
              to={`/todos/${todo.id}`}
              className={({ isActive }) =>
                clsx(
                  "group",
                  "btn",
                  isActive && "btn-neutral",
                  "px-2",
                  "flex flex-row justify-start"
                )
              }
            >
              <span className=" max-w-[8rem] overflow-x-clip overflow-ellipsis">
                {todo.name}
              </span>
              <div className="invisible ml-auto flex gap-1 group-hover:visible">
                <button
                  type="button"
                  title="Remove"
                  className="btn-error btn-outline btn-xs btn text-base"
                  onClick={(event) => {
                    event.preventDefault();

                    deleteTodo.mutate(todo.id, {
                      onSuccess: () => {
                        navigate("/todos", {
                          replace: true,
                        });
                      },
                    });
                  }}
                >
                  <MdOutlineDeleteOutline />
                </button>
              </div>
            </NavLink>
          ))
        ) : (
          <div className="alert alert-error">Failed to load ToDos!</div>
        )}
      </div>
      <div className="flex-1 p-2">
        <Outlet />
      </div>
    </div>
  );
}
