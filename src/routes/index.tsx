import {
  Navigate,
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import Root from "./root";
import Todos from "./todos";
import { TodoRoute, todosLoader } from "./todos/[todoId]";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />}>
      <Route index element={<Navigate to="/todos" />} />
      <Route path="todos" element={<Todos />}>
        <Route path=":todoId" element={<TodoRoute />} loader={todosLoader} />
      </Route>
    </Route>
  )
);
