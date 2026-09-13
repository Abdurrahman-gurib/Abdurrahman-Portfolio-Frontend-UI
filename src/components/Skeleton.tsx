import { COPY } from '../content/copy';

export interface SkeletonProps {
  /** Number of empty ruled rows that hold the height while data loads. Default 5. */
  lines?: number;
  /** Screen-reader text. Default "Loading". */
  label?: string;
  className?: string;
}

/** Static empty ruled rows (DESIGN.md §6.18). No shimmer, no spinner. */
export function Skeleton({ lines = 5, label, className }: SkeletonProps) {
  return (
    <div className={['placeholder-rows', className ?? ''].filter(Boolean).join(' ')} role="status" aria-busy="true">
      <span className="visually-hidden">{label ?? COPY.backoffice.loading}</span>
      {Array.from({ length: lines }, (_, i) => (
        <div key={i} aria-hidden="true" />
      ))}
    </div>
  );
}

export interface LoadingLineProps {
  /** e.g. "Loading enquiries". CSS appends the ellipsis. */
  label?: string;
  className?: string;
}

/** One mono line: "Loading enquiries…". */
export function LoadingLine({ label, className }: LoadingLineProps) {
  return (
    <p className={['loading', className ?? ''].filter(Boolean).join(' ')} role="status">
      {label ?? COPY.backoffice.loading}
    </p>
  );
}
