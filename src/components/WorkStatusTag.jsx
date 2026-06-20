export default function WorkStatusTag({ reached, hasStarted }) {
  if (!hasStarted) return null;

  const label = reached && hasStarted ? '达标' : '未达标';
  const classes = reached && hasStarted ? 'bg-success-strong' : 'bg-danger-strong';

  return (
    <span aria-label={label} className={`block h-2 w-2 rounded-pill ${classes}`} />
  );
}
