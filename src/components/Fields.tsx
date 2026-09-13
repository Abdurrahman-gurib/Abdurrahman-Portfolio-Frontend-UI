import type { HTMLInputAutoCompleteAttribute, ReactNode } from 'react';

/* Form fields (DESIGN.md §6.6 / §6.7). Every control has a visible <label for>, helper and error text wired
   with aria-describedby, aria-invalid on error. Required is the default; pass required={false} to show "(optional)". */

interface BaseFieldProps {
  label: string;
  name: string;
  /** Defaults to `f-${name}`. */
  id?: string;
  /** Error message (without the "Error — " prefix, which CSS adds). */
  error?: string;
  /** Helper line under the control. */
  hint?: string;
  /** Default true. false appends "(optional)" to the label. */
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

function fieldIds(id: string | undefined, name: string, hint?: string, error?: string, extra?: string) {
  const base = id ?? `f-${name}`;
  const hintId = hint ? `${base}-help` : undefined;
  const errId = error ? `${base}-err` : undefined;
  const describedBy = [errId, hintId, extra].filter(Boolean).join(' ') || undefined;
  return { base, hintId, errId, describedBy };
}

function FieldShell({
  base,
  label,
  required,
  hint,
  hintId,
  error,
  errId,
  className,
  children,
}: {
  base: string;
  label: string;
  required: boolean;
  hint?: string;
  hintId?: string;
  error?: string;
  errId?: string;
  className?: string;
  children: ReactNode;
}) {
  const cls = ['field', error ? 'is-invalid' : '', className ?? ''].filter(Boolean).join(' ');
  return (
    <div className={cls}>
      <label className="field__label" htmlFor={base}>
        {label}
        {!required && <span className="opt">(optional)</span>}
      </label>
      {children}
      {hint && (
        <span className="field__help" id={hintId}>
          {hint}
        </span>
      )}
      {error && (
        <span className="field__error" id={errId}>
          {error}
        </span>
      )}
    </div>
  );
}

/* ---------- TextField ---------- */

export interface TextFieldProps extends BaseFieldProps {
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'tel' | 'url' | 'password' | 'search' | 'number';
  placeholder?: string;
  autoComplete?: HTMLInputAutoCompleteAttribute;
  inputMode?: 'text' | 'tel' | 'email' | 'url' | 'numeric' | 'decimal' | 'search';
  maxLength?: number;
  autoFocus?: boolean;
  /** Extra id(s) for aria-describedby. */
  describedBy?: string;
}

export function TextField(p: TextFieldProps) {
  const required = p.required ?? true;
  const { base, hintId, errId, describedBy } = fieldIds(p.id, p.name, p.hint, p.error, p.describedBy);
  return (
    <FieldShell base={base} label={p.label} required={required} hint={p.hint} hintId={hintId} error={p.error} errId={errId} className={p.className}>
      <input
        className="input"
        id={base}
        name={p.name}
        type={p.type ?? 'text'}
        value={p.value}
        onChange={(e) => p.onChange(e.target.value)}
        placeholder={p.placeholder}
        autoComplete={p.autoComplete}
        inputMode={p.inputMode}
        maxLength={p.maxLength}
        autoFocus={p.autoFocus}
        disabled={p.disabled}
        aria-required={required || undefined}
        aria-invalid={p.error ? true : undefined}
        aria-describedby={describedBy}
      />
    </FieldShell>
  );
}

/* ---------- TextAreaField ---------- */

export interface TextAreaFieldProps extends BaseFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
}

export function TextAreaField(p: TextAreaFieldProps) {
  const required = p.required ?? true;
  const { base, hintId, errId, describedBy } = fieldIds(p.id, p.name, p.hint, p.error);
  return (
    <FieldShell base={base} label={p.label} required={required} hint={p.hint} hintId={hintId} error={p.error} errId={errId} className={p.className}>
      <textarea
        id={base}
        name={p.name}
        value={p.value}
        onChange={(e) => p.onChange(e.target.value)}
        placeholder={p.placeholder}
        rows={p.rows ?? 6}
        maxLength={p.maxLength}
        disabled={p.disabled}
        aria-required={required || undefined}
        aria-invalid={p.error ? true : undefined}
        aria-describedby={describedBy}
      />
    </FieldShell>
  );
}

/* ---------- SelectField ---------- */

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectFieldProps extends BaseFieldProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  /** Rendered as the empty first option, e.g. "Choose a service". */
  placeholder?: string;
}

export function SelectField(p: SelectFieldProps) {
  const required = p.required ?? true;
  const { base, hintId, errId, describedBy } = fieldIds(p.id, p.name, p.hint, p.error);
  return (
    <FieldShell base={base} label={p.label} required={required} hint={p.hint} hintId={hintId} error={p.error} errId={errId} className={p.className}>
      <select
        id={base}
        name={p.name}
        value={p.value}
        onChange={(e) => p.onChange(e.target.value)}
        disabled={p.disabled}
        aria-required={required || undefined}
        aria-invalid={p.error ? true : undefined}
        aria-describedby={describedBy}
      >
        {p.placeholder !== undefined && <option value="">{p.placeholder}</option>}
        {p.options.map((o) => (
          <option key={o.value} value={o.value} disabled={o.disabled}>
            {o.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

/* ---------- CheckboxField ---------- */

export interface CheckboxFieldProps {
  label: string;
  name: string;
  id?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** 'radio' draws the round control; give each radio the same name and its own value. */
  type?: 'checkbox' | 'radio';
  value?: string;
  error?: string;
  hint?: string;
  /** Default false for checkboxes. */
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

/** A single checkbox or radio row (sentence-case label, custom square/round control). For ruled lists use .choice-list markup. */
export function CheckboxField(p: CheckboxFieldProps) {
  const required = p.required ?? false;
  const { base, hintId, errId, describedBy } = fieldIds(p.id, p.value ? `${p.name}-${p.value}` : p.name, p.hint, p.error);
  const cls = ['field', p.error ? 'is-invalid' : '', p.className ?? ''].filter(Boolean).join(' ');
  return (
    <div className={cls}>
      <label className="check" htmlFor={base}>
        <input
          id={base}
          name={p.name}
          type={p.type ?? 'checkbox'}
          value={p.value}
          checked={p.checked}
          onChange={(e) => p.onChange(e.target.checked)}
          disabled={p.disabled}
          aria-required={required || undefined}
          aria-invalid={p.error ? true : undefined}
          aria-describedby={describedBy}
        />
        <span>
          {p.label}
          {p.hint && (
            <span className="field__help" id={hintId}>
              {p.hint}
            </span>
          )}
        </span>
      </label>
      {p.error && (
        <span className="field__error" id={errId}>
          {p.error}
        </span>
      )}
    </div>
  );
}
