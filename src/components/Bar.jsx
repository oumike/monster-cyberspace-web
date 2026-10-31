// A section heading drawn as the firmware's status bar: the title on the left
// and, where there is one, the count the device would show beside it.
export default function Bar({ id, title, count, children }) {
  return (
    <h2 className="bar" id={id}>
      <span className="bar-title">{title}{count != null && <span className="bar-count"> {count}</span>}</span>
      {children && <span className="bar-right">{children}</span>}
    </h2>
  )
}
