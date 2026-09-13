import type { Service, ServiceGroup } from './types';

/**
 * Service catalogue. Slugs, names and prices are fixed and must match packages.ts.
 * Copy is first person singular, British English, plain words.
 */

export const SERVICE_GROUPS: Record<ServiceGroup, { label: string; blurb: string }> = {
  web: {
    label: 'Websites',
    blurb: 'New sites, redesigns and online stores for any kind of business, at fixed prices.',
  },
  software: {
    label: 'Software & automation',
    blurb: 'Custom applications, mobile apps and automation that remove manual admin.',
  },
  it: {
    label: 'IT consulting & support',
    blurb: 'Advice, cloud, day-to-day support and repairs from one person who has run these systems.',
  },
  security: {
    label: 'Cyber security',
    blurb: 'Practical audits and fixes for firewalls, email, websites, backups and staff devices.',
  },
  infrastructure: {
    label: 'Networks & devices',
    blurb: 'Firewalls, switches, Wi-Fi, CCTV, phones and IoT sensors, installed and documented.',
  },
  growth: {
    label: 'Marketing & growth',
    blurb: 'Google, SEO, WhatsApp Business and promo design that turn a website into enquiries.',
  },
};

export const SERVICES: Service[] = [
  {
    slug: 'web-design',
    index: '01',
    group: 'web',
    name: 'Websites & landing pages',
    tagline: 'A mobile-friendly website for any business, built from your content, from MUR 20,000.',
    intro: [
      'I build websites for any kind of business: guesthouses, garages, restaurants, contractors, consultants, shops. Four to six pages, mobile-friendly, with an enquiry form and a WhatsApp button.',
      'You supply the photographs and text. I handle the design, build, search-engine basics, analytics and launch. You get a simple content area so you can update hours, prices and news yourself.',
      'Prices are fixed before I start. The Starter site is MUR 20,000 and the Business site is MUR 30,000. Hosting and domain are charged separately, with your approval.',
    ],
    deliverables: [
      'Up to four pages (Starter) or six pages (Business)',
      'Layout that works on phone, tablet and desktop',
      'Enquiry, quotation or booking-request form with email notification',
      'WhatsApp click-to-chat button',
      'Photo gallery of up to 30 items (Business)',
      'Basic on-page SEO and visitor analytics',
      'Simple content-management area (Business)',
      'Testing, launch and a short handover call',
    ],
    goodFor: [
      'A business with no website, or one that only exists on Facebook',
      'A single landing page for one offer, event or programme',
      'A guesthouse, villa or tour operator that needs enquiries by email and WhatsApp',
      'A contractor or consultant who wants a credible page to send to prospects',
    ],
    tools: ['React', 'TypeScript', 'NestJS', 'Node.js', 'PostgreSQL', 'Cloudflare', 'Azure', 'Google Analytics', 'Google Search Console'],
    priceFrom: 'From MUR 20,000',
    typicalTimeline: '2–4 weeks',
    enquiryKind: 'quote',
    ctaLabel: 'Request a quote',
    faqs: [
      {
        q: 'How much does a website cost?',
        a: 'The Starter site is MUR 20,000 for up to four pages. The Business site is MUR 30,000 for up to six pages, a gallery and a content area. Both are fixed prices agreed in writing before I start. Hosting and the domain are separate, usually a few thousand rupees a year.',
      },
      {
        q: 'How long does it take?',
        a: 'Two to three weeks for a Starter site, three to four for a Business site, once I have your content. Most delays come from waiting for photographs and text, so I ask for those first.',
      },
      {
        q: 'Who owns the website afterwards?',
        a: 'You do. The code, the content and the domain are yours. If you want to move to another developer later, you can.',
      },
      {
        q: 'What if I do not have good photos or text yet?',
        a: 'That is common. I can work with what you have and mark the gaps. If you need photography or copywriting, I will tell you what to ask for. I do not charge you for waiting.',
      },
    ],
    relatedPackages: ['site-starter', 'site-business', 'care-basic', 'care-standard', 'seo-starter'],
    metaTitle: 'Websites & landing pages · Abdurrahman Gurib',
    metaDescription:
      'Mobile-friendly websites for any business in Mauritius. Up to six pages, enquiry form, WhatsApp button, SEO and analytics. Fixed prices from MUR 20,000.',
  },
  {
    slug: 'web-redesign',
    index: '02',
    group: 'web',
    name: 'Redesign & rework',
    tagline: 'Fix, refresh or rebuild an existing site without starting from zero. From MUR 8,000.',
    intro: [
      'Most of the websites I look at are not broken beyond repair. They have a dead appointment link, template wording that was never replaced, a mobile layout that overflows, or opening hours that differ from page to page.',
      'I start with a free review of your current site and send you a short list of what I found. You pick what to fix. Small repairs start at MUR 8,000. A refresh of up to three pages is MUR 15,000. If the site is too old to keep, I will say so and quote a rebuild instead.',
      'You keep your domain, your hosting and your existing content. Nothing goes offline while I work.',
    ],
    deliverables: [
      'Written review of your current site with prioritised issues',
      'Fixes for broken links, forms, placeholder text and inconsistent details',
      'Mobile layout and loading-speed corrections',
      'Refreshed pages using your approved content',
      'Working enquiry form with email notification',
      'Updated navigation, contact details and WhatsApp link',
      'Testing on phone and desktop before and after changes',
      'Move to new hosting or Cloudflare if the current setup is the problem',
    ],
    goodFor: [
      'A site built years ago that looks dated on a phone',
      'Template text or "My Website" titles still showing',
      'Forms or booking links that stopped working',
      'A site you cannot update because the original developer is gone',
      'A site on a platform you do not control and want to move',
    ],
    tools: ['React', 'TypeScript', 'Cloudflare', 'Google Search Console', 'Cypress', 'Postman'],
    priceFrom: 'From MUR 8,000',
    typicalTimeline: '3 days to 2 weeks',
    enquiryKind: 'quote',
    ctaLabel: 'Request a free site review',
    faqs: [
      {
        q: 'Do I need to rebuild from scratch?',
        a: 'Usually not. If the structure is sound I fix and refresh what is there. I only recommend a rebuild when the platform is unsupported, hacked, or costs more to patch than to replace. Either way, the review is free and you decide.',
      },
      {
        q: 'My site was built by someone else. Can you still work on it?',
        a: 'Yes, as long as you can give me access to the hosting and the domain. If you have lost the logins, I can help recover them from the registrar or host before any work starts.',
      },
      {
        q: 'Will my Google ranking drop?',
        a: 'Not if the work is done carefully. I keep existing page addresses where possible, add redirects where they change, and check Search Console after launch.',
      },
      {
        q: 'What does MUR 8,000 actually cover?',
        a: 'Up to three agreed issues, tested, plus small text or image changes, in three to five working days. If your list is longer, I quote it as a page refresh instead.',
      },
    ],
    relatedPackages: ['site-fix', 'site-refresh', 'care-basic', 'care-standard'],
    metaTitle: 'Website redesign & rework · Abdurrahman Gurib',
    metaDescription:
      'Fix, refresh or rebuild your existing website. Free review, fixed prices from MUR 8,000, no downtime, and you keep your domain and content.',
  },
  {
    slug: 'ecommerce',
    index: '03',
    group: 'web',
    name: 'Online stores & catalogues',
    tagline: 'Catalogues with quotation requests, or a full online store with payments. From MUR 35,000.',
    intro: [
      'Not every business needs a checkout. A furniture maker or a wholesaler often does better with a catalogue of 20 to 30 products and a quotation basket. Customers pick items, send the request, and your staff reply with a price. That is MUR 35,000.',
      'If you do need to take payment online, I build a full store: products, cart, MIPS, Stripe or PayPal, order notifications, delivery or pick-up options and an admin area. That starts at MUR 55,000 and is quoted once I have seen your product range.',
      'Your team keeps control of prices and availability. Nothing gets published that you have not approved.',
    ],
    deliverables: [
      'Product or service catalogue with photos and descriptions',
      'Quotation-request basket with an admin view of requests (catalogue site)',
      'Cart, checkout and payment gateway: MIPS, Stripe or PayPal (online store)',
      'Order and enquiry notifications by email and WhatsApp',
      'Delivery and pick-up options',
      'Admin area to manage products, prices and orders',
      'Basic SEO for product pages and visitor analytics',
      'Training for the person who will run it',
    ],
    goodFor: [
      'Furniture, hardware, building-material and wholesale businesses that quote per order',
      'Bakeries, food producers and small retailers ready to sell online',
      'A shop that sells on Facebook and wants orders in one place',
      'A supplier that needs trade quotation forms',
    ],
    tools: ['React', 'NestJS', 'TypeScript', 'PostgreSQL', 'MIPS', 'Stripe', 'PayPal', 'Cloudflare', 'Azure'],
    priceFrom: 'From MUR 35,000',
    typicalTimeline: '4–8 weeks',
    enquiryKind: 'quote',
    ctaLabel: 'Request a quote',
    faqs: [
      {
        q: 'Catalogue or online store, which should I choose?',
        a: 'If most customers ask for a quote or call before buying, start with the catalogue. It costs less, launches sooner, and you can add payments later. If you sell fixed-price items to the public, go straight to the store.',
      },
      {
        q: 'Which payment gateway works in Mauritius?',
        a: 'MIPS is the local option for Mauritian cards. Stripe and PayPal suit international customers. I set up whichever you choose. Gateway fees are paid by you to the provider.',
      },
      {
        q: 'Can I manage stock levels?',
        a: 'The catalogue site does not track live stock in version one. The online store can, and I quote it based on how you manage stock today. Tell me if you use a till or accounting system and I will check whether it can connect.',
      },
      {
        q: 'Who owns the store and the customer data?',
        a: 'You do. The code, the product data and the customer records are yours, hosted in an account under your name.',
      },
    ],
    relatedPackages: ['site-catalogue', 'site-ecommerce', 'care-standard', 'care-plus'],
    metaTitle: 'Online stores & catalogues · Abdurrahman Gurib',
    metaDescription:
      'Product catalogues with quotation requests from MUR 35,000, or online stores with MIPS, Stripe or PayPal from MUR 55,000. Built in Mauritius.',
  },
  {
    slug: 'software-development',
    index: '04',
    group: 'software',
    name: 'Custom software & web applications',
    tagline: 'Portals, dashboards, integrations and APIs that replace spreadsheets and manual admin.',
    intro: [
      'I spend my working days building internal systems: a garage-management platform across six operational areas, payment flows in a core banking system, payroll features for UK clients. The same skills apply to a booking portal for a villa, an inventory tool for a store, or a dashboard for a construction company.',
      'Small pieces first. An enquiry automation connecting two systems is MUR 25,000. A booking or payment integration is MUR 30,000. A reporting dashboard from one data source is MUR 40,000. Larger applications start at MUR 80,000 and are quoted after a requirements session.',
      'Every project ends with documentation, testing and a handover. You own the code and the data.',
    ],
    deliverables: [
      'Written requirements and scope before any code',
      'Customer or staff portals with logins and roles',
      'Booking, quotation or payment integrations with your existing tools',
      'Reporting dashboards from an approved data source',
      'REST APIs and connections between systems',
      'Data import, validation and reconciliation',
      'Automated testing and a staging environment for review',
      'Deployment to Azure or your hosting, with backups and access controls',
      'Documentation, training and handover',
    ],
    goodFor: [
      'A process that lives in WhatsApp, paper and three spreadsheets',
      'You need a booking tool or payment gateway wired into your site',
      'Management wants a dashboard but the data sits in different systems',
      'An internal tool the old supplier no longer supports',
      'An agency that needs a developer for a client integration',
    ],
    tools: ['React', 'Angular', 'NestJS', 'Node.js', 'TypeScript', 'C#', '.NET', 'Python', 'PostgreSQL', 'SQL Server', 'Oracle', 'Azure', 'Azure DevOps', 'Docker'],
    priceFrom: 'From MUR 25,000',
    typicalTimeline: '3–12 weeks',
    enquiryKind: 'quote',
    ctaLabel: 'Request a scoped quote',
    faqs: [
      {
        q: 'How do you price custom work?',
        a: 'By scope, not by the hour. You and I agree what the first version does, I give a fixed price, and anything outside that scope is quoted separately. Payment is 50% to begin and 50% on approval before deployment.',
      },
      {
        q: 'Who owns the code?',
        a: 'You do. The repository is under your account, or I transfer it at handover. There is no lock-in and no licence fee to me.',
      },
      {
        q: 'Can it connect to my accounting or booking software?',
        a: 'Often, yes. Most modern tools have an API or an export. I check this during scoping and tell you plainly if a connection is not possible or would cost more than it saves.',
      },
      {
        q: 'What happens after launch?',
        a: "You can run it yourself, or take a monthly support option that covers monitoring, fixes and small changes. Support is optional, with no fixed-term contract.",
      },
    ],
    relatedPackages: ['automation-workflow', 'booking-integration', 'dashboard', 'custom-app'],
    metaTitle: 'Custom software & web apps · Abdurrahman Gurib',
    metaDescription:
      'Portals, dashboards, integrations and APIs built to a written scope. Fixed prices from MUR 25,000. You own the code. 7+ years in banking and enterprise.',
  },
  {
    slug: 'mobile-apps',
    index: '05',
    group: 'software',
    name: 'Mobile apps',
    tagline: 'Android and iOS apps from one Flutter codebase, scoped and quoted before work starts.',
    intro: [
      'I build mobile apps in Flutter, so one codebase covers both Android and iOS. That keeps the cost lower than two separate apps and makes updates simpler.',
      'Most businesses do not need an app. A mobile-friendly website or a WhatsApp flow is often enough, and I will say so if that is the case. An app makes sense when customers or staff need logins, offline use, notifications, camera or GPS features.',
      'Apps start at MUR 120,000 and are always quoted after a requirements session. Store accounts, backend hosting and any paid services are separate.',
    ],
    deliverables: [
      'Requirements document and screen plan',
      'Flutter app for Android and iOS',
      'Backend API and database if the app needs one',
      'Login, push notifications, camera, maps or offline features as scoped',
      'Testing on real devices',
      'Google Play and App Store submission',
      'Source code, documentation and handover',
    ],
    goodFor: [
      'Field staff who need to log jobs, photos or readings on site',
      'A loyalty, booking or ordering app for regular customers',
      'An internal app for stock counts, inspections or deliveries',
      'A start-up that needs a first version to show investors or users',
    ],
    tools: ['Flutter', 'Firebase', 'NestJS', 'PostgreSQL', 'Google Maps', 'Stripe', 'Azure'],
    priceFrom: 'From MUR 120,000',
    typicalTimeline: '8–16 weeks',
    enquiryKind: 'quote',
    ctaLabel: 'Request a scoped quote',
    faqs: [
      {
        q: 'Why does an app cost more than a website?',
        a: 'An app has more moving parts: two store accounts, device testing, a backend, and review processes at Google and Apple. Flutter keeps it to one codebase, which is why I can start at MUR 120,000 rather than double that.',
      },
      {
        q: 'Do I really need an app?',
        a: 'Maybe not. If the goal is bookings or enquiries, a good website with WhatsApp is cheaper and reaches everyone without an install. I will tell you which fits before you spend anything.',
      },
      {
        q: 'Who handles the app store accounts?',
        a: 'You open them in your business name and I do the submissions. That way the app stays yours if you stop working with me.',
      },
      {
        q: 'What about updates after launch?',
        a: 'Operating systems change and apps need occasional updates. I offer a monthly support option or quote updates as they are needed.',
      },
    ],
    relatedPackages: ['mobile-app', 'custom-app'],
    metaTitle: 'Mobile apps (Flutter) · Abdurrahman Gurib',
    metaDescription:
      'Android and iOS apps from one Flutter codebase. Scoped and quoted before work starts, from MUR 120,000. Honest advice on whether you need an app at all.',
  },
  {
    slug: 'automation-ai',
    index: '06',
    group: 'software',
    name: 'Automation & AI assistants',
    tagline: 'Enquiry automation and staff-reviewed AI assistants, using only your approved content.',
    intro: [
      'The most useful automation is small. A website form that lands in WhatsApp, email and a spreadsheet at the same time, sends the customer an acknowledgement, and tells the right staff member. That is one workflow, MUR 25,000, and it runs every day without anyone remembering to do it.',
      'For AI, I run pilots rather than make promises. The assistant answers only from content you have approved, drafts replies for your staff to check, and hands anything unclear to a person. I have built a WhatsApp AI concierge for a leisure and hospitality group in the south of Mauritius, and I am studying for an MSc in Artificial Intelligence.',
      'I ask about your current process before suggesting either. If a simpler fix does the job, I will tell you.',
    ],
    deliverables: [
      'Map of your current enquiry or admin process',
      'One workflow connecting two systems, e.g. form to WhatsApp, email and a spreadsheet',
      'Automatic acknowledgements to customers and notifications to staff',
      'WhatsApp or website AI assistant that answers from approved content only',
      'Escalation to a person and a staff review step',
      'Document extraction into a spreadsheet for staff review',
      'Usage and quality log so you can see what it did',
      'Optional monthly monitoring and improvement',
    ],
    goodFor: [
      'Enquiries arriving by WhatsApp, email and Facebook with no single record',
      'The same ten questions asked every day about hours, prices and availability',
      'Staff copying details from forms or invoices into spreadsheets',
      'A guesthouse, tour operator or clinic that wants faster first replies',
    ],
    tools: ['WhatsApp Business API', 'Azure AI', 'Node.js', 'NestJS', 'Python', 'PostgreSQL', 'Google Sheets'],
    priceFrom: 'From MUR 25,000',
    typicalTimeline: '2–6 weeks',
    enquiryKind: 'quote',
    ctaLabel: 'Request a quote',
    faqs: [
      {
        q: 'Will the AI say something wrong to my customers?',
        a: 'It can only answer from the content you approve, and in the pilot every reply is drafted for a staff member to check before it goes out. Anything outside the approved content is passed to a person. I only switch on automatic replies once you are satisfied with the log.',
      },
      {
        q: 'What does the monthly fee cover?',
        a: "Monitoring, fixing anything that breaks when a connected service changes, and small improvements to the workflow or the assistant's content. It is optional, MUR 3,500 to MUR 5,000 depending on the setup, with no fixed-term contract.",
      },
      {
        q: 'Do I need a new website for this?',
        a: 'No. Automation works with your existing forms, email and WhatsApp number. If your site cannot send form data anywhere, that is usually a small fix.',
      },
      {
        q: 'What data does the assistant see?',
        a: 'Only what you give it: your approved answers and the messages customers send. I set up the accounts in your name and document where data is stored.',
      },
    ],
    relatedPackages: ['automation-workflow', 'ai-assistant', 'ai-workshop', 'whatsapp-business'],
    metaTitle: 'Automation & AI assistants · Abdurrahman Gurib',
    metaDescription:
      'Enquiry automation from MUR 25,000 and staff-reviewed AI assistants for WhatsApp and web, answering only from your approved content. Mauritius.',
  },
  {
    slug: 'it-consulting',
    index: '07',
    group: 'it',
    name: 'IT consulting & project delivery',
    tagline: 'A day of practical advice from someone who has built and run these systems. MUR 15,000.',
    intro: [
      'Sometimes you do not need a developer yet. You need someone to write down what the business actually needs, compare the options, and tell you what it should cost. That is a consulting day: MUR 15,000, or MUR 8,000 for a half day, with written recommendations you can hand to any supplier.',
      "I have delivered projects in banking, payroll, public finance and hospitality. I can review a supplier's proposal, help get a late project moving, or help you choose between vendors without favouring any of them.",
      'You get a written report, not a slide deck. If you want me to implement it, I quote that separately.',
    ],
    deliverables: [
      'Requirements gathering with your team',
      'Written recommendations with options and costs',
      'System architecture and technology choices',
      'Vendor and quote comparison',
      'Project rescue: review, plan and priorities',
      'Release, testing and go-live checklists',
      'Practical AI workshop for a small team, MUR 8,000 per session',
    ],
    goodFor: [
      'You have three quotes and no way to compare them',
      'A project is late and nobody can say why',
      'A team that wants to use AI tools safely in daily work',
      'An owner who wants a second opinion before signing a contract',
      'A board or NGO that needs a written IT plan',
    ],
    tools: ['Azure', 'Azure DevOps', 'Microsoft 365', 'Google Workspace', 'Postman', 'Cypress', 'Selenium'],
    priceFrom: 'MUR 15,000 per day',
    typicalTimeline: '1–3 days',
    enquiryKind: 'quote',
    ctaLabel: 'Book a consulting day',
    faqs: [
      {
        q: 'Is a day really enough?',
        a: 'For most small businesses, yes. A half day covers one focused question. A full day covers requirements, options and a written plan. Larger reviews are quoted as several days with a fixed total.',
      },
      {
        q: 'Do you come on site?',
        a: 'Yes, anywhere in Mauritius. Remote sessions work for clients in Rodrigues, Réunion, Seychelles and further afield.',
      },
      {
        q: 'Will you just recommend your own services?',
        a: 'Only if they fit. The report stands on its own and you can take it to any supplier. I say clearly when I am not the right person for part of the work.',
      },
      {
        q: 'What is the AI workshop?',
        a: 'A hands-on session for a small team covering safe use of AI tools in daily work: drafting, summarising, spreadsheets, and what not to paste in. MUR 8,000 per session, at your office.',
      },
    ],
    relatedPackages: ['consulting', 'ai-workshop', 'security-audit'],
    metaTitle: 'IT consulting in Mauritius · Abdurrahman Gurib',
    metaDescription:
      'IT consulting days at MUR 15,000: requirements, architecture, vendor selection, project rescue and written recommendations. On site in Mauritius or remote.',
  },
  {
    slug: 'cloud-devops',
    index: '08',
    group: 'it',
    name: 'Cloud, hosting & DevOps',
    tagline: 'Azure hosting, Cloudflare migration, CI/CD pipelines and backups that have been tested.',
    intro: [
      'I run Azure-hosted environments, Azure DevOps pipelines, database provisioning, migrations and backups as part of my day job, and have done across banking, payroll and enterprise systems. I set up the same for smaller businesses at a size and cost that make sense.',
      'A cloud cost and backup review is MUR 12,000. I look at what you pay, what is backed up, whether a restore actually works, and who has access. You get a report with the fixes ranked. Optional monitoring is MUR 3,500 a month.',
      'Cloudflare migrations, domain and SSL setup, and deployment pipelines are quoted after the review.',
    ],
    deliverables: [
      'Cloud cost review with savings identified',
      'Backup audit and a tested restore',
      'Cloudflare migration: DNS, SSL, caching and basic protection',
      'Azure or other hosting setup with access controls',
      'CI/CD pipeline so deployments are repeatable',
      'Database provisioning and migration between environments',
      'Recovery procedure written down',
      'Monthly monitoring and reporting (optional)',
    ],
    goodFor: [
      'A hosting bill that has grown and nobody knows why',
      'Backups that exist on paper but have never been restored',
      'A site that goes down and the developer has left',
      'Moving a domain, email or site to Cloudflare or Azure',
      "Deployments done by hand from someone's laptop",
    ],
    tools: ['Azure', 'Azure DevOps', 'Cloudflare', 'Docker', 'Linux', 'Red Hat', 'PostgreSQL', 'SQL Server', 'Git'],
    priceFrom: 'From MUR 12,000',
    typicalTimeline: '1–2 weeks',
    enquiryKind: 'audit',
    ctaLabel: 'Book a cloud review',
    faqs: [
      {
        q: 'I am on a shared host. Is this for me?',
        a: 'Yes. Most of the review applies to any hosting: cost, backups, access, SSL, DNS. If shared hosting is right for you, I will say so and just tidy it up.',
      },
      {
        q: 'Do you need my passwords?',
        a: 'I need access, not your personal passwords. I ask for a separate account with the right permissions, and it is removed when the work is finished. Everything I change is documented.',
      },
      {
        q: 'Can you work with my current IT supplier?',
        a: 'Yes. I share the findings with them and agree who does what. I am not trying to replace a supplier that is doing a good job.',
      },
      {
        q: 'What is the monthly monitoring?',
        a: "Uptime checks, backup verification, cost alerts and a short monthly summary. MUR 3,500 a month, optional, with no fixed-term contract.",
      },
    ],
    relatedPackages: ['cloud-review', 'security-audit', 'care-plus'],
    metaTitle: 'Cloud, hosting & DevOps · Abdurrahman Gurib',
    metaDescription:
      'Cloud cost and backup review for MUR 12,000, Azure hosting, Cloudflare migration, CI/CD pipelines and tested recovery for small businesses in Mauritius.',
  },
  {
    slug: 'it-support-repairs',
    index: '09',
    group: 'it',
    name: 'IT support & computer repairs',
    tagline: 'Remote and on-site support from MUR 6,000 a month, or computer repairs from MUR 1,500.',
    intro: [
      'For businesses: an IT support retainer of MUR 6,000 a month covers remote support for up to 10 users, one on-site visit a month, updates and backup checks. You message me on WhatsApp and I reply within one business day.',
      'For anyone: computer repair and tune-up from MUR 1,500 per device. Diagnosis, clean-up, SSD and RAM upgrades, data recovery attempts, and setting up new machines properly. Drop off, or collection by arrangement in the south of Mauritius.',
      'I hold the Google IT Support Professional Certificate and have resolved incidents within SLAs for UK HR clients. I am used to fixing things quickly and writing down what I did.',
    ],
    deliverables: [
      'Remote support by WhatsApp, phone or screen-share',
      'One scheduled on-site visit per month (retainer)',
      'Windows, macOS and Microsoft 365 or Google Workspace setup',
      'Updates, antivirus and backup checks',
      'Laptop and desktop repair, clean-up and diagnosis',
      'SSD and RAM upgrades',
      'Data recovery attempts and file transfer to a new machine',
      'New device setup and old device wipe',
      'A simple log of every ticket',
    ],
    goodFor: [
      'A small office with no IT person',
      'A slow laptop that just needs an SSD',
      'A hard drive with the family photos on it that stopped working',
      'New staff who need a machine set up on day one',
      'An owner who wants one number to call',
    ],
    tools: ['Windows', 'macOS', 'Linux', 'Microsoft 365', 'Google Workspace'],
    priceFrom: 'From MUR 1,500 per device',
    typicalTimeline: 'Same week for repairs; retainer starts at the next month',
    enquiryKind: 'callback',
    ctaLabel: 'Request a callback',
    faqs: [
      {
        q: 'Do you travel to my office or home?',
        a: 'Yes, across Mauritius. The retainer includes one visit a month. Extra visits are quoted per trip. For repairs, you can drop off or I arrange collection.',
      },
      {
        q: 'What if my data cannot be recovered?',
        a: 'Then you pay for the diagnosis only. I attempt recovery with standard tools. If the drive needs a specialist lab I say so and give you the options rather than charging for a failed attempt.',
      },
      {
        q: 'Can I get support without a monthly retainer?',
        a: 'Yes. Pay per visit or per repair. The retainer is cheaper if you call more than once a month.',
      },
      {
        q: 'Do you work with my existing supplier?',
        a: 'Yes. Many clients keep a hardware supplier or a software vendor and use me for day-to-day support. I coordinate with them when a ticket needs it.',
      },
    ],
    relatedPackages: ['it-support', 'repair', 'care-basic'],
    metaTitle: 'IT support & computer repairs · Abdurrahman Gurib',
    metaDescription:
      'IT support retainer at MUR 6,000 a month for up to 10 users, and computer repairs from MUR 1,500 per device. Remote and on site in Mauritius.',
  },
  {
    slug: 'cyber-security',
    index: '10',
    group: 'security',
    name: 'Cyber security',
    tagline: 'Practical security checks for small firms: firewall, email, website, backups, devices.',
    intro: [
      'I hold a BSc (Hons) in Cyber Security from the University of Mauritius. My dissertation was a web vulnerability scanner. I have supported audits, disaster recovery and database security exercises inside a bank. I apply the same checks to businesses that cannot afford a security department.',
      'The audit is MUR 12,000. I review your firewall, email setup, website, backups and staff devices, then send a written report with fixes in priority order and what each one costs. Many fixes are free or cheap: enabling two-factor login, correcting email records, removing old accounts.',
      'No scare tactics. Just a list, in order, in plain language.',
    ],
    deliverables: [
      'Firewall and remote-access review',
      'Email security: SPF, DKIM, DMARC and phishing exposure',
      'Website vulnerability scan and fixes',
      'Backup and recovery check',
      'Staff device and account review: updates, antivirus, two-factor login',
      'Written report with prioritised fixes and costs',
      'Short staff briefing on phishing and passwords',
      'Follow-up check after fixes',
    ],
    goodFor: [
      'A business that has had a phishing incident or a suspicious invoice',
      'Shared passwords and old staff accounts still active',
      'A website that was hacked or flagged by Google',
      'Insurance, bank or client questionnaires asking about your security',
      'An owner who wants to know where they stand, without a sales pitch',
    ],
    tools: ['Fortinet', 'Cloudflare', 'Microsoft 365', 'Google Workspace', 'OWASP ZAP', 'Nmap', 'Veracode'],
    priceFrom: 'From MUR 12,000',
    typicalTimeline: '1–2 weeks',
    enquiryKind: 'audit',
    ctaLabel: 'Book a security audit',
    faqs: [
      {
        q: 'Is my business too small to be a target?',
        a: 'No. Small businesses in Mauritius get the same phishing emails and fake invoices as everyone else, and usually have less protection. The audit finds the cheap fixes first.',
      },
      {
        q: 'Will the audit disrupt my business?',
        a: 'No. Scans run outside working hours where possible and I never test anything destructive without written agreement. Most of the work is reading configurations and talking to your staff.',
      },
      {
        q: 'Do you fix the issues or just report them?',
        a: 'Both. The report is written so you can act on it yourself or with your existing supplier. If you want me to do the fixes, I quote them separately.',
      },
      {
        q: 'Do you travel on site?',
        a: 'Yes, across Mauritius. Device and firewall checks are easier in person. Email and website checks can be done remotely for clients elsewhere.',
      },
    ],
    relatedPackages: ['security-audit', 'network-setup', 'it-support'],
    metaTitle: 'Cyber security audits · Abdurrahman Gurib',
    metaDescription:
      'Security audit for MUR 12,000: firewall, email, website, backups and staff devices, with a written report of prioritised fixes. BSc (Hons) Cyber Security.',
  },
  {
    slug: 'network-infrastructure',
    index: '11',
    group: 'infrastructure',
    name: 'Networks, firewalls & Wi-Fi',
    tagline: 'Fortinet firewalls, Cisco Catalyst switches, Wi-Fi and VPN, installed and documented.',
    intro: [
      'I configure Fortinet firewalls and Cisco Catalyst switches, set up VLANs so guests and staff are separated, and give you a VPN so you can reach the office from home. Everything gets written down, with a diagram, so the next person can understand it.',
      'Office network and firewall setup starts at MUR 25,000 for the work. Hardware is quoted separately, and I will help you choose what to buy without overbuying.',
      'This suits offices, guesthouses, restaurants, workshops and small warehouses. I come on site, install, test with your staff, and leave documentation.',
    ],
    deliverables: [
      'Site survey and network diagram',
      'Fortinet firewall installation and configuration',
      'Cisco Catalyst switch configuration',
      'Wi-Fi with separate staff and guest networks',
      'VLANs, VPN and remote access',
      'Hardware recommendation and supplier quotes',
      'Testing with your team and a handover walk-through',
      'Documentation with passwords stored securely',
    ],
    goodFor: [
      'A new office, shop or guesthouse that needs a network from scratch',
      'Wi-Fi that drops in half the building',
      'Guests on the same network as your till and CCTV',
      'Staff who need to reach files or systems from home',
      'A network nobody has documented',
    ],
    tools: ['Fortinet', 'Cisco Catalyst', 'Cloudflare', 'VLANs', 'VPN'],
    priceFrom: 'From MUR 25,000',
    typicalTimeline: '1–3 weeks',
    enquiryKind: 'callback',
    ctaLabel: 'Request a site visit',
    faqs: [
      {
        q: 'Do I have to buy Fortinet and Cisco?',
        a: 'No. They are what I know best and what I recommend where security matters. For a very small shop a simpler setup can be enough. I quote the option that fits the size and the budget.',
      },
      {
        q: 'Can you work with what I already have?',
        a: 'Usually. I audit the existing equipment first. If it is supported and can be configured properly, I keep it.',
      },
      {
        q: 'How long is the office down?',
        a: 'Most changeovers are done after hours or in a planned window of a few hours. I tell you in advance what will be off and for how long.',
      },
      {
        q: 'Do you offer ongoing support?',
        a: 'Yes. The IT support retainer covers the network as well as your users. Or you can call me when something breaks and pay per visit.',
      },
    ],
    relatedPackages: ['network-setup', 'security-audit', 'it-support'],
    metaTitle: 'Networks, firewalls & Wi-Fi · Abdurrahman Gurib',
    metaDescription:
      'Fortinet firewalls, Cisco Catalyst switches, Wi-Fi, VLANs and VPN for offices and guesthouses in Mauritius. From MUR 25,000, fully documented.',
  },
  {
    slug: 'cctv-telephony-iot',
    index: '12',
    group: 'infrastructure',
    name: 'CCTV, telephony & IoT',
    tagline: 'Hikvision and Dahua cameras, 3CX phones and IoT sensors, all viewable from your phone.',
    intro: [
      'Cameras: I design and configure Hikvision or Dahua systems with recording, remote viewing on your phone and sensible retention. Setup starts at MUR 15,000. Cameras and recorders are quoted separately.',
      'Phones: 3CX gives a small business proper extensions, call routing, voicemail to email and a mobile app, and it can connect to WhatsApp and your CRM. Setup from MUR 20,000.',
      'IoT: I won the IoT Agriculture Cup in 2022. Temperature sensors for a cold room, water-level monitoring, gate and door automation, and simple dashboards that alert you when something is out of range.',
    ],
    deliverables: [
      'Camera placement plan and hardware list',
      'Hikvision or Dahua configuration with recording and retention',
      'Mobile and remote viewing set up securely',
      '3CX phone system: extensions, menus, routing, voicemail to email',
      '3CX mobile app, WhatsApp and CRM integration',
      'IoT sensors and alerts for temperature, water, doors or energy',
      'Integration with your network, firewall and VLANs',
      'Testing, staff training and documentation',
    ],
    goodFor: [
      'A shop, warehouse, guesthouse or garage you want to watch from home',
      'Missed calls because the one landline is always busy',
      'A cold room, tank or greenhouse that needs monitoring',
      'Existing cameras that record but nobody can view remotely',
      'A phone system that should follow staff onto their mobiles',
    ],
    tools: ['Hikvision', 'Dahua', '3CX', 'WhatsApp Business', 'Fortinet', 'IoT sensors'],
    priceFrom: 'From MUR 15,000',
    typicalTimeline: '1–3 weeks',
    enquiryKind: 'callback',
    ctaLabel: 'Request a site visit',
    faqs: [
      {
        q: 'Can I use my existing cameras?',
        a: 'Often, yes. If they are Hikvision, Dahua or a compatible brand, I can reconfigure them, secure remote access and sort out the recording. I will tell you if any are worth replacing.',
      },
      {
        q: 'Is remote viewing safe?',
        a: "Only if it is set up properly. Default passwords and open ports are how cameras get hijacked. I use the vendor's secure relay or a VPN, change every default, and put cameras on their own VLAN.",
      },
      {
        q: 'What does 3CX cost to run?',
        a: '3CX has licence tiers depending on the size of the team, and you need a line from a local provider for calls. I set out the running costs before you commit.',
      },
      {
        q: 'Do you do installations yourself or with a partner?',
        a: 'I configure and commission everything myself. For cabling and mounting at height I work with an electrician or installer, quoted separately.',
      },
    ],
    relatedPackages: ['cctv', 'telephony', 'network-setup'],
    metaTitle: 'CCTV, telephony & IoT · Abdurrahman Gurib',
    metaDescription:
      'Hikvision and Dahua CCTV with remote viewing from MUR 15,000, 3CX phone systems from MUR 20,000, and IoT monitoring. Installed and documented in Mauritius.',
  },
  {
    slug: 'marketing-growth',
    index: '13',
    group: 'growth',
    name: 'Marketing, SEO & WhatsApp Business',
    tagline: 'Get found on Google, answer on WhatsApp, and have something to post. From MUR 2,500.',
    intro: [
      'Most small businesses in Mauritius win customers through Google Maps, WhatsApp and Facebook. I set those up properly so a website brings enquiries: Google Business Profile, on-page SEO, Search Console and analytics, MUR 10,000 with a month of monitoring.',
      'WhatsApp Business setup is MUR 12,000: a catalogue, quick replies, greeting and away messages, click-to-chat links on your site and social pages, and a briefing for your staff.',
      'If you need promotional graphics, a pack of three layouts is MUR 2,500. A monthly pack of eight designs with captions and scheduling is MUR 6,500. I do not sell paid ad campaigns, but I set up the tracking so you can see whether they work.',
    ],
    deliverables: [
      'Google Business Profile set up or cleaned up, with categories, hours and photos',
      'On-page SEO: titles, descriptions, headings, image names',
      'Google Search Console and analytics with a monthly summary',
      'WhatsApp Business catalogue, quick replies and automatic messages',
      'Click-to-chat links and QR codes for print, site and social',
      'Promotional designs for posts, posters and menus',
      'Captions and a posting schedule (monthly pack)',
      'Short staff briefing on responding to enquiries',
    ],
    goodFor: [
      'A business that is not on Google Maps or has the wrong hours listed',
      'Enquiries coming in but nobody tracking where from',
      'One person answering WhatsApp from a personal number',
      'A restaurant, salon or shop that needs a monthly set of posts',
      'A new website that nobody has found yet',
    ],
    tools: ['Google Business Profile', 'Google Search Console', 'Google Analytics', 'WhatsApp Business', 'Meta Business Suite'],
    priceFrom: 'From MUR 2,500',
    typicalTimeline: '1–2 weeks',
    enquiryKind: 'quote',
    ctaLabel: 'Request a quote',
    faqs: [
      {
        q: 'Can you guarantee a first-page ranking?',
        a: 'No, and be careful of anyone who does. I can make sure Google can read your site, your Business Profile is complete and accurate, and you can see the numbers. For most local searches in Mauritius that is what matters.',
      },
      {
        q: 'Do I need a website first?',
        a: 'Not for Google Business Profile or WhatsApp Business. Both work on their own. A website helps because it gives Google more to index and gives customers somewhere to go, but you can start without one.',
      },
      {
        q: 'Who writes the posts and captions?',
        a: 'I do, from your approved information and photos, and you approve each batch before it is scheduled. I write in English or French. You supply the specialist content.',
      },
      {
        q: 'Do you run Facebook or Google ads?',
        a: 'No. I set up the tracking so you can see whether ads are working, and I can recommend people who run campaigns.',
      },
    ],
    relatedPackages: ['seo-starter', 'whatsapp-business', 'content-pack'],
    metaTitle: 'Marketing, SEO & WhatsApp · Abdurrahman Gurib',
    metaDescription:
      'Google Business Profile and SEO setup for MUR 10,000, WhatsApp Business setup for MUR 12,000, and promo design packs from MUR 2,500. Mauritius.',
  },
];

export const SERVICE_BY_SLUG: Record<string, Service> = Object.fromEntries(
  SERVICES.map((service) => [service.slug, service]),
);

export function getService(slug: string): Service | undefined {
  return SERVICE_BY_SLUG[slug];
}
