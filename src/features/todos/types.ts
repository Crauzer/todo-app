export type Todo = {
  id: string;
  name: string;
  createdAt: number;
  deadline: number;
  tasks: TodoTask;
};

export type TodoTask = {
  name: string;
  isFinished: boolean;
  description: string;
};
