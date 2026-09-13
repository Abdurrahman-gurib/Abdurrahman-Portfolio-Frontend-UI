import type { CaseStudy } from './types';

/**
 * Selected work. Every entry is drawn from the owner's CV and profile brief.
 * No metrics are invented; the `facts` arrays only carry counts that appear in the source material.
 * The current employer is not named: it is described as a leisure and hospitality group in the south of Mauritius.
 */
export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: 'garage-management-platform',
    title: 'Garage management platform',
    context: 'Leisure and hospitality group · south of Mauritius',
    period: '2026',
    problem:
      'The group runs its own garage and needed one system covering mechanics, spare parts, wheels, fuel, vehicle entry and exit, and portals for administrators and guests.',
    approach:
      'I gathered requirements with management, Finance, the garage, the store and operations teams, then built one platform covering six areas: mechanics, spare parts, wheels, fuel, vehicle entry and exit, and administrator and guest portals. It runs on React, NestJS, TypeScript and PostgreSQL, hosted in Azure with CI/CD pipelines in Azure DevOps.',
    outcome:
      'The platform is in production and I support it day to day. I demonstrated each release, trained the users, documented the processes and own the repositories, pipelines, backups and access controls.',
    stack: ['React', 'NestJS', 'TypeScript', 'PostgreSQL', 'Azure', 'Azure DevOps'],
    facts: [
      { label: 'Operational areas', value: '6' },
      { label: 'Hosting', value: 'Azure' },
      { label: 'Delivery', value: 'Requirements to production' },
    ],
  },
  {
    slug: 'whatsapp-ai-concierge',
    title: 'WhatsApp AI concierge and QR customer journeys',
    context: 'Leisure and hospitality group · south of Mauritius',
    period: '2026',
    problem:
      'The group wanted guests to get answers on WhatsApp without staff typing the same replies, and to reach the right information on site by scanning a code rather than searching a website.',
    approach:
      'I built a WhatsApp AI concierge that answers from approved content and hands over to a person when it cannot help. Alongside it I set up QR-based customer journeys, so a scan at a given point leads straight to the relevant page or action. This sat within a wider modernisation of the web platform to React and NestJS.',
    outcome:
      'The concierge answers only from approved content, and staff keep control of what it is allowed to say. The same approach is what I now offer as an AI assistant pilot.',
    stack: ['WhatsApp', 'AI assistant', 'QR journeys', 'React', 'NestJS', 'TypeScript'],
    facts: [
      { label: 'Channel', value: 'WhatsApp' },
      { label: 'Answers from', value: 'Approved content only' },
    ],
  },
  {
    slug: 'temenos-t24-payments',
    title: 'Payments and core banking changes on Temenos T24',
    context: 'MCB Group · banking · Mauritius',
    period: '2025',
    problem:
      'A regulated bank needed changes to its payment and core banking flows on Temenos T24 R24, delivered without disrupting live operations. Every change had to stand up to audits and recovery exercises.',
    approach:
      'I delivered changes to MACSS, SWIFT MT102, MT103 and MT202 messaging, remittances, funds transfer, direct debits and cheques, including T24 customisations and ERP interfacing. The work used Java, jBASE, Oracle SQL and JBoss on Unix and Red Hat systems, within an Agile team.',
    outcome:
      'I owned Change-the-Bank and Run-the-Bank tickets, supported production deployments and incident analysis, and took part in audits, disaster recovery and database security exercises. That is the level of care I bring to any system that handles money.',
    stack: ['Temenos T24', 'Java', 'jBASE', 'Oracle SQL', 'JBoss', 'SWIFT'],
    facts: [
      { label: 'SWIFT message types', value: 'MT102, MT103, MT202' },
      { label: 'Environment', value: 'Regulated, audited' },
    ],
  },
  {
    slug: 'uk-payroll-hr-features',
    title: 'UK payroll and HR features',
    context: 'SD Worx · payroll and HR software · UK clients',
    period: '2023 to 2025',
    problem:
      'A payroll provider serving UK employers needed new payroll, HR and banking features in a large, long-lived codebase. Older parts of the system had to be modernised without breaking what customers relied on.',
    approach:
      'I delivered features across Angular 17, TypeScript, ASP.NET Core, C# and SQL. I managed the Git and Azure DevOps workflows, CI/CD, testing and releases, and contributed to the legacy modernisation work.',
    outcome:
      'Features shipped through a reviewed, automated release process. I led code reviews and knowledge transfer within the team, and finished in the top five of the internal AI hackathon.',
    stack: ['Angular 17', 'TypeScript', 'ASP.NET Core', 'C#', 'SQL', 'Azure DevOps'],
    facts: [
      { label: 'Front end', value: 'Angular 17' },
      { label: 'Release process', value: 'CI/CD on Azure DevOps' },
    ],
  },
  {
    slug: 'public-finance-applications',
    title: 'Public-finance applications for three Ministries of Finance',
    context: 'International Monetary Fund · Guinea-Bissau, Lesotho and Yemen',
    period: '2020 to 2022',
    problem:
      'Three Ministries of Finance needed applications to manage public finances and cross-border financial data. Documents had to be verifiable and financial data had to move between parties without being exposed.',
    approach:
      'I led development using React, Node.js, PostgreSQL and MongoDB. Document authentication and secure transmission of financial data were built on OAuth 2.0, AES-256 and RSA encryption.',
    outcome:
      'The applications were delivered for the Ministries of Finance of Guinea-Bissau, Lesotho and Yemen. I later took part in the IMF hackathons for Lesotho and Yemen in 2023, finishing runner-up in both.',
    stack: ['React', 'Node.js', 'PostgreSQL', 'MongoDB', 'OAuth 2.0', 'AES-256 / RSA'],
    facts: [
      { label: 'Ministries served', value: '3' },
      { label: 'Security', value: 'OAuth 2.0, AES-256, RSA' },
    ],
  },
  {
    slug: 'web-vulnerability-scanner',
    title: 'Web vulnerability scanner',
    context: 'BSc (Hons) Cyber Security dissertation · University of Mauritius',
    period: '2025',
    problem:
      'My dissertation set out to build a practical scanner that finds common web vulnerabilities and reports them clearly, so a small business can check its own site.',
    approach:
      'I designed and built the scanner as my final-year project, applying the secure-coding and vulnerability-testing methods from the degree. The work was assessed as part of a BSc (Hons) in Cyber Security awarded with Second Class First Division honours.',
    outcome:
      'The research was presented at the UoM / MRIC National Research Week 2025. The same checks now inform the security and website audits I offer to clients.',
    stack: ['Web security', 'Vulnerability scanning', 'Secure coding'],
    facts: [
      { label: 'Presented at', value: 'National Research Week 2025' },
      { label: 'Degree', value: 'BSc (Hons) Cyber Security' },
    ],
  },
];

/** Slugs shown in the "Selected work" section on the home page, in display order. */
export const SELECTED_WORK_SLUGS: string[] = [
  'garage-management-platform',
  'temenos-t24-payments',
  'public-finance-applications',
];
