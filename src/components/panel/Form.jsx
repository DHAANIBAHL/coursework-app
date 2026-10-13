// Labelled form controls for the teacher and student panels, styled to match
// the rest of the site in both themes.

const control =
  "mt-1.5 w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 outline-none transition-colors placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900";

function Label({ id, label, hint, children }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-800 dark:text-slate-200">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{hint}</p>}
    </div>
  );
}

export function TextInput({ id, label, hint, value, onChange, ...rest }) {
  return (
    <Label id={id} label={label} hint={hint}>
      <input id={id} value={value} onChange={(e) => onChange(e.target.value)} className={control} {...rest} />
    </Label>
  );
}

export function TextArea({ id, label, hint, value, onChange, rows = 4, ...rest }) {
  return (
    <Label id={id} label={label} hint={hint}>
      <textarea id={id} rows={rows} value={value} onChange={(e) => onChange(e.target.value)} className={control} {...rest} />
    </Label>
  );
}

export function Select({ id, label, hint, value, onChange, children, ...rest }) {
  return (
    <Label id={id} label={label} hint={hint}>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className={control} {...rest}>
        {children}
      </select>
    </Label>
  );
}

// `value` and `onChange` use the "YYYY-MM-DDTHH:mm" local format of
// <input type="datetime-local">; convert with toLocalInput / fromLocalInput.
export function DateTimeInput({ id, label, hint, value, onChange, ...rest }) {
  return (
    <Label id={id} label={label} hint={hint}>
      <input id={id} type="datetime-local" value={value} onChange={(e) => onChange(e.target.value)} className={control} {...rest} />
    </Label>
  );
}

export function FileInput({ id, label, hint, onChange, accept, inputRef }) {
  return (
    <Label id={id} label={label} hint={hint}>
      <input
        id={id}
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
        className="mt-1.5 block w-full text-sm text-slate-700 dark:text-slate-300 file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 dark:file:bg-slate-800 file:px-3 file:py-2 file:text-sm file:font-medium file:text-slate-900 dark:file:text-slate-100 hover:file:bg-slate-200 dark:hover:file:bg-slate-700"
      />
    </Label>
  );
}
