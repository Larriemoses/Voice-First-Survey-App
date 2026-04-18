import { useMemo, useState, type ReactNode } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { cn } from "../../utils/helpers";
import { EmptyState } from "./EmptyState";

export type DataTableColumn<T> = {
  id: string;
  header: string;
  cell: (row: T) => ReactNode;
  sortValue?: (row: T) => string | number;
  className?: string;
};

type DataTableProps<T> = {
  data: T[];
  columns: Array<DataTableColumn<T>>;
  getRowId: (row: T) => string;
  mobileCard: (row: T) => ReactNode;
  emptyState?: ReactNode;
  initialSort?: {
    id: string;
    direction: "asc" | "desc";
  };
};

export function DataTable<T>({
  data,
  columns,
  getRowId,
  mobileCard,
  emptyState,
  initialSort,
}: DataTableProps<T>) {
  const [sort, setSort] = useState(initialSort);

  const sortedData = useMemo(() => {
    if (!sort) return data;

    const column = columns.find((item) => item.id === sort.id);
    if (!column?.sortValue) return data;

    return [...data].sort((left, right) => {
      const leftValue = column.sortValue?.(left);
      const rightValue = column.sortValue?.(right);

      if (leftValue === rightValue) return 0;
      if (leftValue === undefined || rightValue === undefined) return 0;

      const comparison = leftValue > rightValue ? 1 : -1;
      return sort.direction === "asc" ? comparison : -comparison;
    });
  }, [columns, data, sort]);

  function toggleSort(id: string) {
    setSort((current) => {
      if (!current || current.id !== id) {
        return { id, direction: "asc" as const };
      }

      if (current.direction === "asc") {
        return { id, direction: "desc" as const };
      }

      return undefined;
    });
  }

  if (sortedData.length === 0) {
    return (
      <>
        {emptyState ?? (
          <EmptyState
            title="Nothing to show yet"
            description="As soon as data appears, it'll show up here."
          />
        )}
      </>
    );
  }

  return (
    <>
      <div className="space-y-3 md:hidden">
        {sortedData.map((row) => (
          <div key={getRowId(row)}>{mobileCard(row)}</div>
        ))}
      </div>

      <div className="hidden overflow-hidden rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface-raised)] shadow-sm md:block">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[var(--color-border-subtle)]">
            <thead className="bg-[var(--color-surface)]">
              <tr>
                {columns.map((column) => {
                  const isActive = sort?.id === column.id;
                  const isSortable = !!column.sortValue;

                  return (
                    <th
                      key={column.id}
                      className={cn(
                        "px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]",
                        column.className,
                      )}
                    >
                      {isSortable ? (
                        <button
                          type="button"
                          onClick={() => toggleSort(column.id)}
                          className="inline-flex items-center gap-2"
                        >
                          <span>{column.header}</span>
                          {isActive ? (
                            sort?.direction === "asc" ? (
                              <ArrowUp className="h-3.5 w-3.5" />
                            ) : (
                              <ArrowDown className="h-3.5 w-3.5" />
                            )
                          ) : (
                            <ArrowUpDown className="h-3.5 w-3.5" />
                          )}
                        </button>
                      ) : (
                        column.header
                      )}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-subtle)]">
              {sortedData.map((row) => (
                <tr key={getRowId(row)} className="align-top">
                  {columns.map((column) => (
                    <td
                      key={column.id}
                      className={cn(
                        "px-5 py-4 text-sm text-[var(--color-text)]",
                        column.className,
                      )}
                    >
                      {column.cell(row)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
