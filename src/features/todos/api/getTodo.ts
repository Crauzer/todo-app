import { axios } from "../../../utils/axios";
import { Todo } from "../types";

export const getTodo = (id: string) =>
  axios.get<Todo>(`todos/${id}`).then((response) => response.data);
