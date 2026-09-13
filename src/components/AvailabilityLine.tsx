import { useSite } from '../lib/hooks';
import { COPY } from '../content/copy';

export interface AvailabilityLineProps {
  className?: string;
}

/**
 * The availability line: green dot + one sentence, edited by the owner in Settings.
 * Reads live settings via useSite(); renders the static fallback until the API answers.
 * Output: "Taking on new projects this month · replies within one business day"
 */
export function AvailabilityLine({ className }: AvailabilityLineProps) {
  const { settings } = useSite();
  const cls = ['avail', settings.accepting ? '' : 'avail--off', className ?? ''].filter(Boolean).join(' ');
  return (
    <p className={cls}>
      <span className="visually-hidden">{COPY.shell.availabilityLabel}: </span>
      <span>
        {settings.availabilityNote} · {COPY.shell.availabilityReplies} {settings.responseTime}
      </span>
    </p>
  );
}
