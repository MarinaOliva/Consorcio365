function DataTable({
  columns = [],
  rows = [],
  minWidth = "min-w-0",
}) {
  return (
    <>
      {/* Vista mobile: cards */}
      <div className="space-y-3 md:hidden">
        {rows.map((row, rowIndex) => (
          <div
            key={row.id || rowIndex}
            className="rounded-lg border border-border/70 bg-white p-3 shadow-sm"
          >
            {columns.map((column) => (
              <div
                key={column.key}
                className="border-b border-border/40 py-2 last:border-b-0"
              >
                <p className="mb-1 text-[10px] font-bold uppercase text-textMuted">
                  {column.header}
                </p>

                <div className="text-xs text-textMain">
                  {column.render ? column.render(row) : row[column.key]}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Vista tablet/desktop: tabla */}
      <div className="hidden md:block">
        <table className={`w-full ${minWidth} table-auto border-collapse text-xs`}>
          <thead>
            <tr className="bg-secondary text-left text-[11px] text-white">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-3 py-2 font-bold"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row, rowIndex) => (
              <tr
                key={row.id || rowIndex}
                className="border-b border-border/50 last:border-b-0"
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="px-3 py-3 text-textMain"
                  >
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default DataTable;