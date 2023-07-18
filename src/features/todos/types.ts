import { TodoTask } from "../todoTasks/types";

export type Todo = {
  id: string;
  name: string;
  createdAt: number;
  tasks: TodoTask[];
};
