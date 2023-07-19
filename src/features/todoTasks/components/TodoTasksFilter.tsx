import { atom, useAtom } from "jotai";
import _ from "lodash";
import { useCallback } from "react";
import { z } from "zod";

const stateFilterSchema = z.enum(["all", "finished", "active"]);
export type StateFilter = z.infer<typeof stateFilterSchema>;

export const filterAtom = atom<{
  nameFilter: string | undefined;
  stateFilter: StateFilter;
}>({ nameFilter: undefined, stateFilter: "all" });

export const TodoTasksFilter = () => {
  const [filter, setFilter] = useAtom(filterAtom);

  const handleNameFilterChange = _.throttle(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFilter((filter) => ({ ...filter, nameFilter: event.target.value }));
    },
    350
  );

  return (
    <div className="flex flex-col gap-2">
      <input
        className="input-bordered input w-80"
        placeholder="Name Filter"
        value={filter.nameFilter}
        onChange={(event) => handleNameFilterChange(event)}
      />
      <select
        className="select-bordered select w-52"
        onChange={(event) =>
          setFilter((filter) => ({
            ...filter,
            stateFilter: stateFilterSchema.parse(event.target.value),
          }))
        }
      >
        <option value="all">All</option>
        <option value="finished">Finished</option>
        <option value="active">Active</option>
      </select>
    </div>
  );
};
