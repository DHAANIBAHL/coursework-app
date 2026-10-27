// A small coloured label for a deadline's state.
const styles = {
  todo: ["To do", "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400"],
  overdue: ["Overdue", "bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300"],
  submitted: ["Handed in", "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"],
  graded: ["Graded", "bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-300"],
};

export default function DeadlineStatus({ status }) {
  const [label, className] = styles[status] ?? styles.todo;
  return <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}>{label}</span>;
}
