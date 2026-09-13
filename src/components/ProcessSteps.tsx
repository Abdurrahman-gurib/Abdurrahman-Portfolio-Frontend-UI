import type { ProcessStep } from '../content/types';
import { Reveal } from './Reveal';

export interface ProcessStepsProps {
  steps: ProcessStep[];
  /** Label before the output line, e.g. "Output". */
  outputLabel: string;
  /** Heading level for step titles. Default h3. */
  as?: 'h3' | 'h4';
  /** Two columns from 900px. Default true. */
  twoColumns?: boolean;
  className?: string;
}

/** Connected timeline with gradient markers. */
export function ProcessSteps({ steps, outputLabel, as = 'h3', twoColumns = true, className }: ProcessStepsProps) {
  const Heading = as;
  const cls = ['timeline-steps', twoColumns ? 'timeline-steps--2col' : '', className ?? ''].filter(Boolean).join(' ');
  return (
    <ol className={cls}>
      {steps.map((step, i) => (
        <Reveal as="li" key={step.title} delay={(i % 2) * 80}>
          <div className="timeline-steps__body">
            <Heading>{step.title}</Heading>
            <p>{step.body}</p>
            <p className="out">
              <b>{outputLabel}:</b> {step.output}
            </p>
          </div>
        </Reveal>
      ))}
    </ol>
  );
}
