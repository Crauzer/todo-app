import { NavLink, Outlet } from "react-router-dom";
import { useTodos } from "../features/todos/api/getTodos";
import clsx from "clsx";
import {
  MdDriveFileRenameOutline,
  MdOutlineDeleteOutline,
} from "react-icons/md";

export default function Todos() {
  const todos = useTodos();

  return (
    <div className="flex w-full flex-row gap-1">
      <div className="relative flex max-h-[calc(100vh-4rem)] w-52 flex-col overflow-y-scroll">
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
              <span className="">{todo.name}</span>
              <div className="invisible ml-auto flex gap-1 group-hover:visible">
                <button
                  type="button"
                  title="Rename"
                  className="btn-info btn-outline btn-xs btn text-base"
                >
                  <MdDriveFileRenameOutline />
                </button>
                <button
                  type="button"
                  title="Remove"
                  className="btn-outline btn-error btn-xs btn text-base"
                >
                  <MdOutlineDeleteOutline />
                </button>
              </div>
            </NavLink>
          ))
        ) : (
          <div className="alert alert-error">Failed to load ToDos!</div>
        )}
        <button className="btn-accent btn absolute shadow-lg">Create</button>
      </div>
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}
