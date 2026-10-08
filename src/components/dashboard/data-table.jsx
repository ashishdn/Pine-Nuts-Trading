export default function DataTable({
  label,
  columns,
  rows,
  emptyMessage = "No records to show.",
  rowActions,
}) {
  return (
    <div className="table-scroll" role="region" aria-label={`${label} table`} tabIndex={0}>
      <table className="wholesale-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} scope="col">{column.label}</th>
            ))}
            {rowActions && <th scope="col"><span className="sr-only">Actions</span></th>}
          </tr>
        </thead>
        <tbody>
          {rows.length ? rows.map((row) => (
            <tr key={row.id}>
              {columns.map((column) => (
                <td key={column.key}>
                  {column.render ? column.render(row) : row[column.key]}
                </td>
              ))}
              {rowActions && <td className="row-actions">{rowActions(row)}</td>}
            </tr>
          )) : (
            <tr>
              <td className="table-empty" colSpan={columns.length + (rowActions ? 1 : 0)}>
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
