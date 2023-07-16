export type Todo = {
  id: string;
  name: string;
  createdAt: number;
  tasks: TodoTask[];
};

export type TodoTask = {
  name: string;
  deadline: number;
  isFinished: boolean;
  description: string;
};
