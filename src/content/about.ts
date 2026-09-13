import type { Award, Commitment, Credential, ProcessStep, TimelineEntry } from './types';

export interface AboutContent {
  headline: string;
  bio: string[];
  languages: string[];
  tools: Array<{ group: string; items: string[] }>;
  location: string;
  yearsExperience: string;
}

export const ABOUT: AboutContent = {
  headline:
    "I'm Abdurrahman Gurib, a senior software engineer based in the south of Mauritius, and I build websites, business software and IT systems for companies as a freelancer.",
  bio: [
    'I have spent more than seven years writing software for organisations where mistakes are expensive. At the International Monetary Fund I led development of public-finance applications for the Ministries of Finance of Guinea-Bissau, Lesotho and Yemen. At MCB Group I delivered payment and core banking changes on Temenos T24, including SWIFT and MACSS. At SD Worx I built UK payroll, HR and banking features. Before that I worked on projects for Volkswagen, BMW UK, Mercedes and Nissan at RAPP Indian Ocean, and supported Dayforce HR clients at Ceridian.',
    'Today I lead software delivery for a leisure and hospitality group in the south of Mauritius, and I take on freelance work for businesses of any size. That means websites, online stores, custom applications, booking and payment integrations, dashboards, workflow automation and AI assistants. I handle every stage myself: requirements, build, testing, deployment and support.',
    'I also look after the physical side of IT. I configure Fortinet firewalls and Cisco Catalyst switches, migrate domains to Cloudflare, set up 3CX phone systems, install Hikvision and Dahua camera systems and build IoT systems. I repair and tune up computers too. If you want one person who can see the whole picture, from the website to the firewall, that is what I offer.',
    'I hold a BSc (Hons) in Cyber Security from the University of Mauritius and a Diploma in IT and Cyber Security from Polytechnics Mauritius, and I am studying for an MSc in Artificial Intelligence at the University of Mauritius. Security is not an extra on my quotes. It is how I build by default.',
    'My approach is straightforward. I take time to understand how your business works, agree a written scope and a fixed price, then build something practical and maintainable. I explain things in plain words. I would rather start with a small, useful project and earn the next one than sell you a large system you do not need yet.',
    'I am based in Surinam, Savanne. I work on site anywhere in Mauritius and take remote projects from Rodrigues and further afield. I have built for a fintech start-up, accounting firms, SMEs, a bank, an HR software company and government ministries. The quickest way to reach me is WhatsApp on +230 5908 6131.',
  ],
  languages: [
    'English (full professional)',
    'French (full professional)',
    'Arabic (proficient)',
    'Mauritian Creole (native)',
  ],
  tools: [
    {
      group: 'Front-end',
      items: ['React', 'Angular', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'Flutter'],
    },
    {
      group: 'Back-end',
      items: ['Node.js', 'NestJS', 'C#', '.NET / ASP.NET Core', 'Java', 'Python', 'REST APIs'],
    },
    {
      group: 'Databases',
      items: ['PostgreSQL', 'SQL Server', 'Oracle SQL', 'MySQL', 'MongoDB', 'Data migration and reconciliation'],
    },
    {
      group: 'Cloud & DevOps',
      items: ['Azure', 'Azure DevOps (repos, CI/CD)', 'Git', 'Docker', 'Linux / Red Hat', 'Cloudflare', 'Backups and recovery'],
    },
    {
      group: 'Security',
      items: [
        'OAuth 2.0 and JWT',
        'AES-256 and RSA encryption',
        'Web vulnerability scanning',
        'Secure coding and code review',
        'Security testing (Cypress, Selenium, Postman)',
        'Incident investigation',
      ],
    },
    {
      group: 'Infrastructure & telephony',
      items: [
        'Fortinet firewalls',
        'Cisco Catalyst switches',
        'Wi-Fi, VLANs and VPN',
        '3CX phone systems',
        'Hikvision and Dahua CCTV',
        'IoT devices',
        'Computer repair and upgrades',
      ],
    },
    {
      group: 'Integrations',
      items: [
        'Stripe, MIPS and PayPal',
        'Firebase',
        'Google Maps',
        'WhatsApp Business and WhatsApp assistants',
        'Email platforms',
        'Booking tools',
        'ERP interfacing',
      ],
    },
  ],
  location: 'Surinam, Savanne, Mauritius',
  yearsExperience: '7+ years',
};

export const TIMELINE: TimelineEntry[] = [
  {
    period: 'January 2026 to present',
    role: 'Lead Software Engineer',
    org: 'Leisure & hospitality group, south of Mauritius',
    summary:
      'I lead delivery of web platforms and internal systems. I built a garage-management platform covering six operational areas in React, NestJS, TypeScript and PostgreSQL, and I own the Azure DevOps pipelines, cloud environments, database migrations and backups. Current work includes a WhatsApp AI concierge, QR-based customer journeys and modernising the public website.',
  },
  {
    period: 'March 2025 to December 2025',
    role: 'Senior Software Engineer',
    org: 'MCB Group',
    summary:
      'Payment and core banking changes on Temenos T24 R24 in a regulated Agile environment: MACSS, SWIFT MT102/MT103/MT202, remittances, funds transfer, direct debits and cheques. Production deployments, incident analysis, audits and disaster-recovery exercises on Red Hat systems.',
  },
  {
    period: 'October 2023 to February 2025',
    role: 'Senior Full-Stack Engineer',
    org: 'SD Worx Mauritius',
    summary:
      'UK payroll, HR and banking features in Angular 17, TypeScript, ASP.NET Core, C# and SQL. Git and Azure DevOps workflows, CI/CD, testing and releases. Legacy modernisation, code reviews and knowledge transfer.',
  },
  {
    period: 'March 2023 to September 2023',
    role: 'Software Engineer',
    org: 'RAPP Indian Ocean',
    summary:
      'Development, QA, DevOps and business analysis for Volkswagen, BMW UK, Mercedes and Nissan. Angular, React, .NET and Node.js features, with automated functional, regression, performance and security testing in Cypress, Selenium, Postman and Swagger.',
  },
  {
    period: 'October 2022 to March 2023',
    role: 'Application Analyst',
    org: 'Ceridian Dayforce Mauritius',
    summary:
      'Supported Dayforce Talent Management for UK HR clients, investigating and resolving incidents within SLAs using VB Classic, SQL and XML.',
  },
  {
    period: 'January 2020 to September 2022',
    role: 'Software Engineer',
    org: 'International Monetary Fund',
    summary:
      'Led development of public-finance and cross-border financial applications for the Ministries of Finance of Guinea-Bissau, Lesotho and Yemen in React, Node.js, PostgreSQL and MongoDB. Document authentication and secure financial-data transmission with OAuth 2.0, AES-256 and RSA.',
  },
  {
    period: 'January 2016 to January 2020',
    role: 'Freelance Software Engineer, Web and Mobile',
    org: 'Independent',
    summary:
      'Web and mobile applications for a fintech start-up, accounting firms and SMEs, integrating Stripe, Firebase, Google Maps, OAuth / JWT and real-time dashboards.',
  },
];

export const EDUCATION: Credential[] = [
  {
    title: 'MSc Artificial Intelligence (in progress)',
    issuer: 'University of Mauritius',
    year: '2026 to 2028',
  },
  {
    title: 'BSc (Hons) Cyber Security, Second Class First Division',
    issuer: 'University of Mauritius',
    year: '2024 to 2025',
  },
  {
    title: 'Diploma in IT and Cyber Security, GPA 4.0, Best Performer Student Award',
    issuer: 'Polytechnics Mauritius',
    year: '2020 to 2023',
  },
];

export const CERTIFICATIONS: Credential[] = [
  { title: 'Google Project Management', issuer: 'Google / Coursera' },
  { title: 'IBM Cybersecurity Analyst Professional Certificate', issuer: 'IBM / Coursera', year: '2024' },
  { title: 'Google Cybersecurity Professional Certificate', issuer: 'Google / Coursera', year: '2023' },
  { title: 'Google IT Support Professional Certificate', issuer: 'Google / Coursera', year: '2024' },
  { title: 'Google Data Analytics Professional Certificate', issuer: 'Google / Coursera', year: '2024' },
  { title: 'Microsoft Certified: Azure AI Fundamentals', issuer: 'Microsoft', year: '2024' },
  { title: 'Microsoft Azure Fundamentals (AZ-900)', issuer: 'Microsoft' },
  {
    title: 'Microsoft Azure Developer Associate (AZ-204), Coursera Professional Certificate',
    issuer: 'Microsoft / Coursera',
    year: '2024',
  },
  { title: 'Veracode Security Labs Certificate, Level 3', issuer: 'Veracode', year: '2024' },
  { title: 'Postman API Fundamentals Student Expert', issuer: 'Postman', year: '2023' },
];

export const AWARDS: Award[] = [
  { title: 'Winner, Inter-University Web Cup Challenge, hosted by the University of Mauritius', year: '2021' },
  { title: 'Regional and national winner, National Leadership Engine, representing Savanne', year: '2024' },
  { title: 'Runner-up, National Innovator Hall of Fame, Best Individual Innovator category', year: '2023' },
  { title: 'Runner-up, UNESCO India-Africa Hackathon, hosted onsite in India', year: '2022' },
  { title: 'Runner-up, IMF Lesotho Hackathon, hosted onsite in Lesotho', year: '2023' },
  { title: 'Runner-up, IMF Yemen Hackathon', year: '2023' },
  { title: 'Winner, IoT Agriculture Cup', year: '2022' },
  { title: 'Winner, TechStars Start-up Business Hackathon', year: '2022' },
  { title: 'Fourth place, MCB InovApp 3.0 Challenge, MCB Group', year: '2023' },
  { title: 'MCB-sponsored Future Fintech Champion', year: '2023' },
];

export const PROCESS: ProcessStep[] = [
  {
    index: '01',
    title: 'First conversation',
    body:
      'You and I talk on WhatsApp or by phone, free of charge. You tell me what the business does, what is not working and what you want to happen. I ask about your current process before suggesting anything.',
    output: 'A clear picture of the problem and a first view on what is worth building.',
  },
  {
    index: '02',
    title: 'Scope and fixed quote in writing',
    body:
      'I write down exactly what is included, what is not, the price and the delivery time. Nothing starts until you have agreed it. If I think you should start smaller, I say so.',
    output: 'A written scope and fixed price. You pay 50% to begin.',
  },
  {
    index: '03',
    title: 'Design and build with previews',
    body:
      'I build on a private preview link so you can see progress as it happens, not at the end. You supply photos and text, or approve what I draft. Changes to the agreed scope are quoted before I do them.',
    output: 'A working preview you can open on your phone at any point.',
  },
  {
    index: '04',
    title: 'Review and testing on real devices',
    body:
      'I test every page, form and integration on real phones, tablets and desktops. Forms are checked end to end, including the emails and notifications they send. You review and I fix what you find.',
    output: 'A tested version you have approved. The second 50% is due here, before launch.',
  },
  {
    index: '05',
    title: 'Launch, training and handover',
    body:
      'I put the site or system live on your domain and hosting, in your name. I show you or your staff how to update content and handle enquiries, and I hand over the login details and documentation.',
    output: 'A live system you own, with access details, documentation and a short training session.',
  },
  {
    index: '06',
    title: 'Support and improvements',
    body:
      'After launch you can carry on with a monthly care plan or call me when you need something. Backups, checks, small updates and fixes are covered by the plan. Bigger features are quoted separately.',
    output: 'A named person to contact, a reply within one business day and a monthly summary if you are on a plan.',
  },
];

export const COMMITMENTS: Commitment[] = [
  {
    title: 'Fixed scope and price, in writing',
    body:
      'You know what you are getting and what it costs before I start. No hourly meter. If the scope changes, you get a new figure before the work, not a surprise on the invoice.',
  },
  {
    title: 'You own your code, domain and content',
    body:
      'Everything is registered and built in your name. At handover you have the source code, the logins and the right to take it anywhere. No lock-in.',
  },
  {
    title: 'Reply within one business day',
    body:
      'WhatsApp, email or a call. I answer every message within one business day, during a project and after it.',
  },
  {
    title: 'Plain explanations, no jargon',
    body:
      'I tell you what I am doing and why in words you can act on. If you do not understand something, that is my problem to fix, not yours.',
  },
  {
    title: 'Security by default',
    body:
      'I hold a BSc (Hons) in Cyber Security and have worked in banking and public finance. Encrypted connections, backups, access controls and updates are built in from the start, not sold as extras.',
  },
  {
    title: 'One person, start to finish',
    body:
      'You deal with me. I gather the requirements, write the code, test it, launch it and support it. Nothing gets lost between a salesperson, a designer and a developer.',
  },
  {
    title: 'Honest about what to build first',
    body:
      'I will tell you when a smaller project makes more sense, or when something you asked for will not pay for itself. A useful first version, delivered on time, is worth more than a big plan that never launches.',
  },
];
