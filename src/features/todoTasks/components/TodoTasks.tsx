import { useForm } from "react-hook-form";
import { useTodoTasks } from "../api/getTodoTasks";
import { TodoTask } from "../types";

type TodoTasksProps = {
  todoId: string;
};

export const TodoTasks: React.FC<TodoTasksProps> = ({ todoId }) => {
  const todoTasks = useTodoTasks(todoId);

  if (todoTasks.isLoading) {
    return <span className="loagin loading loading-dots loading-lg" />;
  }

  return (
    <div className="join-vertical join w-full">
      {todoTasks.data?.map((todoTask) => (
        <TodoTaskItem todoTask={todoTask} />
      ))}
    </div>
  );
};

const TodoTaskItem: React.FC<{ todoTask: TodoTask }> = ({ todoTask }) => {
  const { register, handleSubmit } = useForm({});

  return (
    <div className="collapse-arrow join-item collapse border border-base-300">
      <input type="radio" name="todo-tasks-accordion" />
      <div className="collapse-title text-xl font-medium">{todoTask.name}</div>
      <div className="collapse-content">
        <div className="flex flex-col gap-2">
          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">Finished</span>
              <input
                type="checkbox"
                checked={todoTask.isFinished}
                className="checkbox"
              />
            </label>
          </div>
          <span>{todoTask.description}</span>
        </div>
      </div>
    </div>
  );
};
