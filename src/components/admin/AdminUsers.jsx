import { useState } from "react";
import { ChevronLeft, ChevronRight, KeyRound, Search, Trash2, UserPlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FormError, emailPattern } from "@/components/AuthForm";
import { EmptyState, ErrorNote, Loading, PageHeading, Section } from "@/components/panel/Panel";
import { useAuth } from "@/context/AuthContext";
import { api, useApi } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { ROLE_LABELS } from "@/lib/roles";

const roles = Object.keys(ROLE_LABELS);
const selectClass =
  "rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-2 text-sm text-slate-900 dark:text-slate-100";

export default function AdminUsers() {
  const { user: me } = useAuth();
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [page, setPage] = useState(1);
  const [creating, setCreating] = useState(false);
  const [notice, setNotice] = useState("");
  const [actionError, setActionError] = useState(null);

  const query = new URLSearchParams({ search, role, page }).toString();
  const { data, error, loading, reload } = useApi(`/admin/users?${query}`);
  const pages = data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : 1;

  function done(message) {
    setNotice(message);
    setActionError(null);
    reload();
  }

  async function changeRole(u, nextRole) {
    try {
      await api(`/admin/users/${u.id}`, { method: "PATCH", body: { role: nextRole } });
      done(`${u.name} is now ${nextRole === "admin" ? "an" : "a"} ${ROLE_LABELS[nextRole].toLowerCase()}.`);
    } catch (err) {
      setActionError(err);
    }
  }

  async function remove(u) {
    if (!window.confirm(`Delete ${u.name} (${u.email})? This can't be undone.`)) return;
    try {
      await api(`/admin/users/${u.id}`, { method: "DELETE" });
      done(`Deleted ${u.name}.`);
    } catch (err) {
      setActionError(err);
    }
  }

  return (
    <>
      <PageHeading
        title="Users"
        description="Everyone with an account. Change roles, create teacher accounts, and help people who are locked out."
        action={
          !creating && (
            <Button onClick={() => setCreating(true)}>
              <UserPlus className="size-4" /> Create account
            </Button>
          )
        }
      />

      {creating && (
        <CreateUserForm
          onCancel={() => setCreating(false)}
          onCreated={(u) => {
            setCreating(false);
            done(`Created ${u.name} as ${u.role === "admin" ? "an" : "a"} ${ROLE_LABELS[u.role].toLowerCase()}. Share the password with them.`);
          }}
        />
      )}

      {notice && (
        <p role="status" className="mb-4 rounded-md border border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950/50 px-4 py-3 text-sm text-green-700 dark:text-green-300">
          {notice}
        </p>
      )}
      <div className="mb-4">
        <ErrorNote error={actionError} />
      </div>

      <Section>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSearch(searchInput.trim());
            setPage(1);
          }}
          className="flex flex-wrap items-center gap-3 border-b border-slate-200 dark:border-slate-800 p-4"
        >
          <div className="relative min-w-48 flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by name or email, then press Enter"
              aria-label="Search users"
              className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 py-2 pl-9 pr-3 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>
          <select
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              setPage(1);
            }}
            aria-label="Filter by role"
            className={selectClass}
          >
            <option value="">All roles</option>
            {roles.map((r) => (
              <option key={r} value={r}>
                {ROLE_LABELS[r]}s
              </option>
            ))}
          </select>
        </form>

        <ErrorNote error={error} onRetry={reload} />
        {loading && !data ? (
          <div className="px-5">
            <Loading />
          </div>
        ) : data?.users.length === 0 ? (
          <EmptyState>No users match.</EmptyState>
        ) : data ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-5 py-3 font-medium">Role</th>
                  <th className="px-5 py-3 font-medium">Joined</th>
                  <th className="px-5 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="rows-hover divide-y divide-slate-200 dark:divide-slate-800">
                {data.users.map((u) => (
                  <UserRow key={u.id} u={u} isMe={u.id === me.id} onRole={changeRole} onDelete={remove} onPasswordSet={done} onError={setActionError} />
                ))}
              </tbody>
            </table>
          </div>
        ) : null}

        {data && pages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 px-5 py-3 text-sm text-slate-600 dark:text-slate-400">
            <span>
              Page {data.page} of {pages} · {data.total} users
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                <ChevronLeft className="size-4" /> Previous
              </Button>
              <Button variant="outline" size="sm" disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>
                Next <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        )}
      </Section>
    </>
  );
}

function UserRow({ u, isMe, onRole, onDelete, onPasswordSet, onError }) {
  const [resetting, setResetting] = useState(false);
  const [password, setPassword] = useState("");

  async function savePassword(e) {
    e.preventDefault();
    try {
      await api(`/admin/users/${u.id}/password`, { method: "POST", body: { password } });
      setResetting(false);
      setPassword("");
      onPasswordSet(`New password set for ${u.name}. Share it with them privately.`);
    } catch (err) {
      onError(err);
    }
  }

  return (
    <>
      <tr>
        <td className="px-5 py-3">
          <p className="font-medium text-slate-900 dark:text-slate-100">
            {u.name} {isMe && <span className="text-xs font-normal text-slate-500 dark:text-slate-400">(you)</span>}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{u.email}</p>
        </td>
        <td className="px-5 py-3">
          <select
            value={u.role}
            onChange={(e) => onRole(u, e.target.value)}
            disabled={isMe}
            title={isMe ? "Another admin has to change your role" : undefined}
            aria-label={`Role for ${u.name}`}
            className={`${selectClass} disabled:opacity-60`}
          >
            {roles.map((r) => (
              <option key={r} value={r}>
                {ROLE_LABELS[r]}
              </option>
            ))}
          </select>
        </td>
        <td className="px-5 py-3 text-slate-600 dark:text-slate-400">{formatDate(u.createdAt)}</td>
        <td className="px-5 py-3">
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setResetting((r) => !r)}>
              <KeyRound className="size-3.5" /> Password
            </Button>
            {!isMe && (
              <Button variant="destructive" size="sm" onClick={() => onDelete(u)} aria-label={`Delete ${u.name}`}>
                <Trash2 className="size-3.5" />
              </Button>
            )}
          </div>
        </td>
      </tr>
      {resetting && (
        <tr>
          <td colSpan={4} className="bg-slate-50 dark:bg-slate-800 px-5 py-3">
            <form onSubmit={savePassword} className="flex flex-wrap items-center gap-3">
              <label htmlFor={`pw-${u.id}`} className="text-sm text-slate-700 dark:text-slate-300">
                New password for {u.name}
              </label>
              <input
                id={`pw-${u.id}`}
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                required
                placeholder="At least 8 characters"
                className="min-w-48 flex-1 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
              />
              <Button type="submit" size="sm">Set password</Button>
              <Button type="button" variant="ghost" size="sm" onClick={() => setResetting(false)}>
                Cancel
              </Button>
            </form>
          </td>
        </tr>
      )}
    </>
  );
}

function CreateUserForm({ onCancel, onCreated }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "teacher" });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const update = (field) => (value) => setForm((f) => ({ ...f, [field]: value }));

  async function handleSubmit(e) {
    e.preventDefault();
    const found = {};
    if (!form.name.trim()) found.name = "Enter a name.";
    if (!emailPattern.test(form.email.trim())) found.email = "Enter a valid email address.";
    if (form.password.length < 8) found.password = "Use at least 8 characters.";
    setErrors(found);
    setFormError("");
    if (Object.keys(found).length > 0) return;

    setSaving(true);
    try {
      const { user } = await api("/admin/users", { method: "POST", body: form });
      onCreated(user);
    } catch (err) {
      setFormError(err.message);
      setSaving(false);
    }
  }

  return (
    <Section
      title="Create an account"
      className="mb-6"
      action={
        <button type="button" onClick={onCancel} aria-label="Close" className="rounded-md p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
          <X className="size-4" />
        </button>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="grid gap-4 p-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <FormError message={formError} />
        </div>
        <Field id="new-name" label="Full name" value={form.name} onChange={update("name")} error={errors.name} />
        <Field id="new-email" label="Email" type="email" value={form.email} onChange={update("email")} error={errors.email} />
        <Field
          id="new-password"
          label="Password"
          type="password"
          value={form.password}
          onChange={update("password")}
          error={errors.password}
          hint="They can use this to log in. Share it with them privately."
          autoComplete="new-password"
        />
        <div>
          <label htmlFor="new-role" className="block text-sm font-medium text-slate-800 dark:text-slate-200">
            Role
          </label>
          <select id="new-role" value={form.role} onChange={(e) => update("role")(e.target.value)} className={`${selectClass} mt-1.5 w-full py-2.5`}>
            {roles.map((r) => (
              <option key={r} value={r}>
                {ROLE_LABELS[r]}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-3 sm:col-span-2">
          <Button type="submit" disabled={saving}>
            {saving ? "Creating…" : "Create account"}
          </Button>
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </Section>
  );
}
