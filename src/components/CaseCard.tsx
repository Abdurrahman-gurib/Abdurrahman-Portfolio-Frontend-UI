import { Link } from 'react-router-dom';
import { COPY } from '../content/copy';
import type { CaseStudy } from '../content/types';

export interface CaseCardProps {
  study: CaseStudy;
  className?: string;
}

/** A case study as a glass card: context, title, the problem, stack chips, read link. The whole card is the link. */
export function CaseCard({ study, className }: CaseCardProps) {
  const L = COPY.work.labels;
  const titleId = `case-${study.slug}`;
  return (
    <Link className={['card', 'card--hover', 'case-card', className ?? ''].filter(Boolean).join(' ')} to={`/work/${study.slug}`} aria-labelledby={titleId}>
      <span className="case-card__ctx">
        {study.context} · {study.period}
      </span>
      <h3 id={titleId}>{study.title}</h3>
      <p>{study.problem}</p>
      <ul className="tag-row" aria-label={L.stack}>
        {study.stack.map((item) => (
          <li className="tag" key={item}>
            {item}
          </li>
        ))}
      </ul>
      <span className="link-arrow case-card__more">{COPY.work.readCase}</span>
    </Link>
  );
}
