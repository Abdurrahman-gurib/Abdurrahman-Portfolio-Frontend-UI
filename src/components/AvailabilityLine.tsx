import { useSite } from '../lib/hooks';
import { COPY } from '../content/copy';

export interface AvailabilityLineProps {
  className?: string;
}

/**
 * The availability line (DESIGN.md §6.5): 7px green dot + one mono sentence, edited by the owner in Settings.
 * Reads live settings via useSite(); renders the static fallback until the API answers.
 * Output: "Availability — Taking on new projects this month · replies within one business day"
 */
export function AvailabilityLine({ className }: AvailabilityLineProps) {
  const { settings } = useSite();
  const cls = ['avail', settings.accepting ? '' : 'avail--off', className ?? ''].filter(Boolean).join(' ');
  return (
    <p className={cls}>
      {COPY.shell.availabilityLabel} — {settings.availabilityNote} · {COPY.shell.availabilityReplies} {settings.responseTime}
    </p>
  );
}
