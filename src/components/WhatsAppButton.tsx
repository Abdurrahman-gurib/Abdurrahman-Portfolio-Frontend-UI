import { OWNER, whatsappLink } from '../content/site';
import { COPY } from '../content/copy';
import { Button } from './Button';

export interface WhatsAppButtonProps {
  /** Pre-filled opening message. Plain text, no emoji. Defaults to whatsappLink()'s own default. */
  message?: string;
  /** Defaults to "WhatsApp +230 5908 6131" (the number in mono). Any custom label must still contain the word WhatsApp. */
  label?: string;
  size?: 'sm';
  block?: boolean;
  className?: string;
}

/** Filled green WhatsApp button. Colour + the word + the number; never an icon. Opens in a new tab. */
export function WhatsAppButton({ message, label, size, block, className }: WhatsAppButtonProps) {
  return (
    <Button as="a" href={whatsappLink(message)} target="_blank" variant="whatsapp" size={size} block={block} className={className}>
      {label ?? (
        <>
          {COPY.shell.whatsappWord} <span className="mono">{OWNER.phoneDisplay}</span>
        </>
      )}
    </Button>
  );
}
