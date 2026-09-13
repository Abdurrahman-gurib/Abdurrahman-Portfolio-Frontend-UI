/**
 * Site-wide copy: navigation, page headings, contact form labels, back-office labels and SEO.
 * Plain strings only. Prices referenced here must match packages.ts (the fixed price sheet).
 */
import type { Faq, SectorExample } from './types';

export type EnquiryKind = 'quote' | 'audit' | 'callback' | 'contact';
export type EnquiryStatus = 'new' | 'contacted' | 'quoted' | 'won' | 'lost' | 'archived';
export type EnquiryPriority = 'low' | 'normal' | 'high';

export interface FieldCopy {
  label: string;
  placeholder?: string;
  hint?: string;
}

const SECTORS: SectorExample[] = [
  {
    sector: 'Garages & car rental',
    example: 'Booking-request form with dates and vehicle choice, confirmed by your team on WhatsApp.',
  },
  {
    sector: 'Hotels, guesthouses & villas',
    example: 'Six-page site with a photo gallery and a stay enquiry form that emails your front desk.',
  },
  {
    sector: 'Tour & excursion operators',
    example: 'Tour pages linked to your existing booking tool, plus a group enquiry workflow.',
  },
  {
    sector: 'Restaurants, cafés & bakeries',
    example: 'Menu, event gallery and order or quotation requests sent straight to WhatsApp.',
  },
  {
    sector: 'Furniture makers & retailers',
    example: 'Catalogue of 20 to 30 products with a quotation basket. No online payment needed in v1.',
  },
  {
    sector: 'Construction & contractors',
    example: 'Project gallery and a quotation form that collects dimensions and photos, with an admin view.',
  },
  {
    sector: 'Interior design & architecture',
    example: 'Portfolio site with a structured brief form, hosted behind Cloudflare.',
  },
  {
    sector: 'Accounting, HR & consulting firms',
    example: 'Service pages, a secure enquiry form, and a firewall and email review for client data.',
  },
  {
    sector: 'Spas & salons',
    example: 'Treatment list, appointment requests and a Google Business Profile that shows your hours.',
  },
  {
    sector: 'Events, photography & media',
    example: 'Gallery of past work, sponsor and vendor enquiry forms, and a monthly promo design pack.',
  },
  {
    sector: 'Tuition & training providers',
    example: 'Course pages with an enrolment form, and a practical AI workshop for your staff.',
  },
  {
    sector: 'Wholesalers & hardware retail',
    example: 'Trade price list with quotation requests, plus office network, CCTV and 3CX phones.',
  },
];

const KINDS: Array<{ value: EnquiryKind; label: string; short: string; hint: string }> = [
  { value: 'quote', label: 'Request a quote', short: 'A quote', hint: 'You know roughly what you need and want a price.' },
  { value: 'audit', label: 'Book an audit', short: 'An audit', hint: 'A review of your website, network or security, with a written report.' },
  { value: 'callback', label: 'Ask for a call back', short: 'A call back', hint: 'You would rather talk it through first.' },
  { value: 'contact', label: 'Something else', short: 'Something else', hint: 'A question, a partnership or an introduction.' },
];

const STATUSES: Record<EnquiryStatus, string> = {
  new: 'New',
  contacted: 'Contacted',
  quoted: 'Quoted',
  won: 'Won',
  lost: 'Lost',
  archived: 'Archived',
};

const PRIORITIES: Record<EnquiryPriority, string> = {
  low: 'Low',
  normal: 'Normal',
  high: 'High',
};

const FIELDS: Record<
  | 'name'
  | 'company'
  | 'email'
  | 'phone'
  | 'preferWhatsapp'
  | 'service'
  | 'package'
  | 'budget'
  | 'timeline'
  | 'website'
  | 'message'
  | 'consent',
  FieldCopy
> = {
  name: { label: 'Your name', placeholder: 'Full name' },
  company: { label: 'Business name', placeholder: 'Company or trading name', hint: 'Optional.' },
  email: { label: 'Email', placeholder: 'you@example.com' },
  phone: {
    label: 'Phone',
    placeholder: '+230 5xxx xxxx',
    hint: 'Include the country code if you are outside Mauritius.',
  },
  preferWhatsapp: {
    label: 'Reply on WhatsApp',
    hint: 'Tick this if you would rather I reply on WhatsApp than by email.',
  },
  service: {
    label: 'Service',
    placeholder: 'Choose a service',
    hint: 'Pick the closest one. I will adjust once I know more.',
  },
  package: { label: 'Package', placeholder: 'Choose a package (optional)' },
  budget: {
    label: 'Budget',
    placeholder: 'Choose a range',
    hint: 'A range helps me suggest the right package. It is not a commitment.',
  },
  timeline: { label: 'Timeframe', placeholder: 'Choose a timeframe' },
  website: {
    label: 'Current website',
    placeholder: 'https://',
    hint: 'If you have one. A Facebook or Instagram page counts.',
  },
  message: {
    label: 'What do you need',
    placeholder: 'Two or three lines about your business and the problem you want solved.',
    hint: 'Links, photos and documents can follow on WhatsApp or email.',
  },
  consent: {
    label: 'I agree that you keep these details to reply to my enquiry.',
    hint: 'I do not share your details or add you to a mailing list.',
  },
};

export const COPY = {
  nav: {
    items: [
      { label: 'Services', to: '/services' },
      { label: 'Pricing', to: '/pricing' },
      { label: 'Work', to: '/work' },
      { label: 'About', to: '/about' },
      { label: 'Contact', to: '/contact' },
    ],
    cta: 'Request a quote',
    /** The numbered document index (DESIGN.md §5.4). Shared by the mobile drawer and the footer. */
    index: [
      { n: '01', label: 'Overview', to: '/' },
      { n: '02', label: 'Services', to: '/services' },
      { n: '03', label: 'Process', to: '/#process' },
      { n: '04', label: 'Pricing', to: '/pricing' },
      { n: '05', label: 'Work', to: '/work' },
      { n: '06', label: 'About', to: '/about' },
      { n: '07', label: 'Contact', to: '/contact' },
    ],
  },

  /** Application shell: header, drawer, mobile bar, availability line. */
  shell: {
    skipLink: 'Skip to content',
    brand: 'A. Gurib',
    brandTagline: 'software & IT',
    backofficeTagline: 'back office',
    menuOpen: 'Menu',
    menuClose: 'Close',
    drawerLabel: 'Site menu',
    mainNavLabel: 'Main',
    whatsappWord: 'WhatsApp',
    mobileBarWhatsapp: 'WhatsApp',
    mobileBarQuote: 'Request a quote',
    availabilityLabel: 'Availability',
    availabilityReplies: 'replies',
    contactStripLabel: 'Ways to reach me',
    phoneLabel: 'Phone',
    emailLabel: 'Email',
    linkedinLabel: 'LinkedIn',
    portraitAlt: 'Abdurrahman Gurib',
    homeLabel: 'Home',
    breadcrumbLabel: 'Breadcrumb',
  },

  notFound: {
    eyebrow: 'Not found',
    title: 'That page does not exist',
    body: 'The link may be out of date or mistyped. The pages that do exist are listed below, and the contact form is one click away.',
    home: 'Back to the home page',
    contact: 'Request a quote',
    seoTitle: 'Page not found · Abdurrahman Gurib',
  },

  home: {
    eyebrow: 'Software engineer & IT consultant · Mauritius',
    headline: 'Websites, software and IT that businesses depend on.',
    sub: 'One engineer for your website, your business software and your office network. Fixed prices in Mauritian rupees, scope agreed in writing, and a reply within one business day.',
    primaryCta: 'Request a quote',
    secondaryCta: 'WhatsApp me',
    proofLine:
      '7+ years in banking and enterprise software. BSc (Hons) Cyber Security. Based in Mauritius, working remotely with clients worldwide.',
    sectors: SECTORS,
    servicesIntro:
      'Thirteen services, one point of contact. Start with the problem that costs you the most and add the rest when it makes sense.',
    whyTitle: 'Why one engineer instead of an agency',
    whyIntro:
      'You speak to the person who does the work. No account manager, no hand-offs, no surprises on the invoice. I spent more than seven years building and supporting systems for banks and large companies, and I bring the same habits to a four-page website.',
    /** Second About paragraph on the home page: the commitments in one paragraph; the full list is on /about. */
    whyBody:
      'Every job comes with a fixed scope and price in writing, you own the code, the domain and the content, and I reply within one business day. Security is built in from the start: encrypted connections, backups, access controls and updates are part of the quote, not extras.',
    processTitle: 'How a project runs',
    processIntro:
      'The same steps every time, from a small repair to a custom application. You know what happens next and what you receive at the end of each step.',
    pricingTitle: 'Fixed prices, no hourly billing',
    pricingIntro:
      'Every package has a price in Mauritian rupees and a written list of what is included. You pay 50% to begin and 50% on approval, before launch. Monthly support is optional, with no fixed-term contract.',
    workTitle: 'Selected work',
    workIntro:
      'Garage management, banking payments, public-finance systems, payroll. A few of the things I have built and supported, with the details I am allowed to share.',
    faqTitle: 'Questions business owners ask first',
    contactTitle: 'Tell me what you need',
    contactIntro:
      'Send a few lines about your business and the problem. I reply within one business day with questions or a price.',
    closingHeadline: 'Start with one small, useful job.',
    closingBody:
      'Most clients begin with a repair, a page refresh or an audit. If that goes well, you decide what comes next. Message me on WhatsApp or use the form below.',
    /** Labels used only by the home page: hero facts, list headings, table headers and link labels. */
    facts: {
      based: 'Based',
      serving: 'Serving',
      response: 'Response',
      pricing: 'Pricing',
      stack: 'Stack',
      servingValue: 'Businesses in Mauritius, remote clients worldwide',
      replies: 'Replies',
      pricingValue: 'Fixed prices in Mauritian rupees, scope agreed in writing',
      stackValue: 'React · NestJS · .NET · PostgreSQL · Azure · Fortinet',
      /* Experience and qualification rows: the value is "7+ years" from about.ts followed by this phrase. */
      experience: 'Experience',
      experienceValue: 'in banking and enterprise software',
      qualification: 'Qualification',
      qualificationValue: 'BSc (Hons) Cyber Security, University of Mauritius',
    },
    sectorsLabel: 'Sectors I work with',
    allServices: 'All services',
    outputLabel: 'Output',
    sheet: {
      caption: 'Headline packages, one per group, with price and delivery time',
      package: 'Package',
      bestFor: 'Best for',
      delivery: 'Delivery',
      price: 'Price',
      request: 'Request',
    },
    fullPriceSheet: 'See the full price sheet',
    caseLabels: {
      context: 'Context',
      period: 'Period',
      stack: 'Stack',
      problem: 'Problem',
      approach: 'What I did',
      outcome: 'Result',
      /** Accessible name of the facts list under each entry (not printed). */
      facts: 'Facts',
      read: 'Read the case study',
    },
    allWork: 'All work',
    moreAbout: 'More about me',
  },

  services: {
    title: 'Services',
    intro:
      'Websites, custom software, automation, networks, security and support. Each service explains what you receive, what it costs and how long it takes. If your problem does not fit one box, tell me and I will scope it.',
    // ADDED by the services page owner: /services and /services/:slug labels.
    headline: 'Everything I build, fix and look after',
    factsLabel: 'At a glance',
    factServices: 'Services',
    factResponse: 'Response',
    factPricing: 'Pricing',
    factPricingValue: 'Fixed prices in Mauritian rupees, agreed in writing',
    factBased: 'Based',
    /** Prefix of the Response fact: "Replies within one business day". */
    factRepliesPrefix: 'Replies',
    /** Plain h2 above the grouped list (the 02 eyebrow already sits on the h1). */
    listTitle: 'Every service, by category',
    processIntro: 'The same six steps for a small repair or a full build.',
    outputLabel: 'Output',
    contactBody: 'Send a few lines about your business and the problem, or message me on WhatsApp. I reply within one business day with questions or a price.',
    detail: {
      scopeTitle: 'Scope',
      deliverablesTitle: 'What you get',
      goodForTitle: 'Good for',
      processTitle: 'How it goes',
      costTitle: 'Typical cost',
      costIntro: 'The packages that belong to this service, taken from the price sheet.',
      costCols: { package: 'Package', bestFor: 'Best for', delivery: 'Delivery', price: 'Price', request: 'Request' },
      allPrices: 'See the full price sheet',
      faqTitle: 'Questions I get asked',
      faqEyebrow: 'Questions',
      otherTitle: 'Other services',
      otherIntro: 'The services either side of this one in the index.',
      previous: 'Previous',
      next: 'Next',
      allServices: 'All services',
      askTitle: 'Ask about this',
      askBody: 'Tell me what you have and what you need. I reply within one business day with questions or a price.',
      whatsappMessage: 'Hello Abdurrahman, I would like to ask about {service}.',
      facts: { stack: 'Stack', timeline: 'Typical timeline', from: 'Price', monthly: 'Monthly support', group: 'Category' },
      notFoundTitle: 'That service does not exist',
      notFoundBody: 'The link may be out of date or mistyped. Every service I offer is listed on the services page.',
      notFoundLink: 'All services',
      notFoundSeoTitle: 'Service not found · Abdurrahman Gurib',
    },
  },

  pricing: {
    title: 'Pricing',
    intro:
      'All prices are in Mauritian rupees and include testing and handover. Scope is agreed in writing before work starts. Hosting, domains and paid third-party services are charged separately with your approval. New features are quoted separately.',
    tabsHint: 'Jump to a group of packages. Each package lists what is included, what is not, and how long it takes.',
    /** /pricing page labels (page owner: pricing). */
    headline: 'Packages in Mauritian rupees',
    indexLabel: 'Package groups',
    indexUnit: 'packages',
    groupEyebrow: 'Packages',
    /** Group headings on the sheet; the eyebrow carries the group name ("04.1 — WEBSITES"), so the h2 says what the group covers. */
    groupTitles: {
      websites: 'From a repair to an online store',
      support: 'Keeping the site working after launch',
      software: 'Automation, dashboards and custom builds',
      it: 'Audits, networks, repairs and marketing',
    },
    /** Mobile ledger: the includes list sits behind a native details/summary. */
    moreLabel: 'What is included',
    backToIndex: 'Back to the package list',
    columns: { package: 'Package', includes: 'Includes', delivery: 'Delivery', price: 'Price', request: 'Request' },
    recommended: 'Recommended',
    notIncluded: 'Not included',
    request: 'Request',
    requestAria: 'Request {name}',
    termsEyebrow: 'Terms',
    termsTitle: 'Standard terms',
    termsIntro: 'The same terms apply to every package, from a website repair to a custom application.',
    notesEyebrow: 'Notes',
    notesTitle: 'Before you choose',
    notesIntro: 'Three things worth knowing before you pick a package.',
    contactTitle: 'Not sure which package fits',
    contactIntro:
      'Send a few lines about your business and the problem. I will suggest a package, or quote something that fits better, within one business day.',
  },

  work: {
    title: 'Work',
    headline: 'Selected work',
    intro: 'Projects I have delivered as an employee and as a freelancer since 2016.',
    note: 'Some of this work was for banks and private companies. Where I cannot share names, screenshots or figures, I describe the problem and the approach instead.',
    noteLabel: 'Note',
    /** Labels on each work entry and on the case-study page. */
    labels: {
      context: 'Context',
      period: 'Period',
      stack: 'Stack',
      problem: 'Problem',
      approach: 'What I did',
      outcome: 'Result',
      facts: 'Facts',
    },
    readCase: 'Read the case study',
    allWork: 'All work',
    /** Case-study page sections. */
    sections: {
      context: 'Context',
      built: 'What I built',
      result: 'Result',
      stack: 'Stack in detail',
      related: 'Related service',
    },
    relatedIntro: 'The service this kind of work falls under, with its price and timeline.',
    notFoundTitle: 'That case study does not exist',
    notFoundBody: 'The link may be out of date. The projects I can describe are listed on the work page.',
  },

  about: {
    title: 'About',
    headline: 'One engineer, end to end',
    /** Labels for the facts column. */
    facts: {
      location: 'Based',
      experience: 'Experience',
      languages: 'Languages',
    },
    /** Section titles and their short muted intros. */
    sections: {
      timeline: 'Timeline',
      timelineIntro: 'Roles since 2016, most recent first.',
      education: 'Education & certifications',
      educationIntro: 'Degrees and professional certificates.',
      degrees: 'Degrees',
      certifications: 'Certifications',
      awards: 'Awards',
      awardsIntro: 'Competitions and hackathons, 2021 to 2024.',
      tools: 'Tools',
      toolsIntro: 'What I work with day to day, grouped by layer.',
      commitments: 'How I work',
      commitmentsIntro: 'The terms every project runs on, whatever its size.',
    },
    closingLine: 'I answer my own phone.',
    /** Lead paragraph under the h1 (ADDED: the same sentence as ABOUT.headline without the contraction). */
    lead: 'I am Abdurrahman Gurib, a senior software engineer based in the south of Mauritius, and I build websites, business software and IT systems for companies as a freelancer.',
    intro:
      'I am Abdurrahman Gurib, a senior software engineer from Surinam in the south of Mauritius. I lead software delivery for a leisure and hospitality group in the south of Mauritius and take on freelance projects alongside it. Before that I worked on core banking at MCB Group, UK payroll at SD Worx, automotive brands at RAPP Indian Ocean, HR software at Ceridian and public-finance systems for the International Monetary Fund.',
  },

  contact: {
    title: 'Contact',
    /** Page h1 (ADDED by the contact page owner). */
    headline: 'Start with a message',
    intro:
      'WhatsApp is the fastest way to reach me. Email and the form work too. I reply within one business day, usually sooner.',
    channels: [
      {
        label: 'WhatsApp',
        value: '+230 5908 6131',
        hint: 'Fastest reply. Message any time and I answer during working hours.',
      },
      {
        label: 'Email',
        value: 'abdurrahmangurib@gmail.com',
        hint: 'Good for briefs, documents and quotes.',
      },
      {
        label: 'Phone',
        value: '+230 5908 6131',
        hint: 'Calls answered on working days. If I miss you, I call back.',
      },
      {
        label: 'LinkedIn',
        value: 'linkedin.com/in/abdurrahman-g-863ab7238',
        hint: 'Profile and work history.',
      },
    ],
    formTitle: 'Send an enquiry',
    formIntro: 'A few lines are enough. I reply within one business day with questions or a price.',
    kinds: KINDS,
    budgets: [
      'Under MUR 15,000',
      'MUR 15,000 – 30,000',
      'MUR 30,000 – 60,000',
      'MUR 60,000 – 120,000',
      'Over MUR 120,000',
      'Not sure yet',
    ],
    timelines: ['As soon as possible', 'Within a month', 'In one to three months', 'Later this year', 'No date yet'],
    fields: FIELDS,
    submit: 'Send enquiry',
    /** Submit label per "I need" choice (ADDED by the contact page owner). Falls back to `submit`. */
    submitByKind: {
      quote: 'Request a quote',
      audit: 'Book an audit',
      callback: 'Ask for a call back',
      contact: 'Send enquiry',
    } satisfies Record<EnquiryKind, string>,
    submitting: 'Sending…',
    successTitle: 'Received',
    successBody:
      'Your reference is {reference}. I will reply {responseTime}. If it is urgent, message me on WhatsApp and quote the reference.',
    successWhatsapp: 'Continue on WhatsApp',
    errorGeneric:
      'Something went wrong and the enquiry was not sent. Please try again, or message me on WhatsApp.',
    privacyNote:
      'Your details are used only to reply to this enquiry. They are not shared with anyone else and you are not added to a mailing list.',
    /** Contact page: section labels, the "I need" legend, ladder rows and client-side validation text. */
    formEyebrow: 'Enquiry form',
    questionsEyebrow: 'Questions',
    questionsTitle: 'Asked before most enquiries',
    kindLegend: 'I need',
    replyTimeLabel: 'Reply time',
    locationLabel: 'Location',
    honeypotLabel: 'Leave this field empty',
    sendAnother: 'Send another enquiry',
    errorsOne: 'Please check one field',
    errorsMany: 'Please check {count} fields',
    whatsappFallback: 'Message me on WhatsApp instead',
    validation: {
      name: 'Enter your name, at least two characters.',
      email: 'Enter an email address I can reply to.',
      service: 'Choose the closest service.',
      message: 'Tell me a little more, at least ten characters.',
      consent: 'Tick the box so I can keep your details to reply.',
      /** ADDED by the contact page owner: the WhatsApp or phone number is required on /contact. */
      phone: 'Enter a number I can reach you on, e.g. +230 5xxx xxxx',
    },
    /** ADDED by the contact page owner: /contact asks for the number as the main channel (DESIGN.md §6.6). */
    phoneLabel: 'WhatsApp or phone',
    /** ADDED by the contact page owner: summary of the collapsed optional fields on /contact. */
    moreSummary: 'Add details (optional)',
    moreHint: 'Business name, package, budget, timeframe and your current website. All optional.',
  },

  footer: {
    line: 'Websites, software and IT for businesses in Mauritius and beyond, built by one engineer you can reach directly.',
    availabilityLabel: 'Taking new projects',
    indexHeading: 'Index',
    servicesHeading: 'Services',
    contactHeading: 'Contact',
    backofficeLink: 'Back office',
    copyright: '© {year} Abdurrahman Gurib · Mauritius',
  },

  backoffice: {
    title: 'Back office',
    loginTitle: 'Sign in',
    loginIntro: 'Owner access only. Enter your email and password.',
    emailLabel: 'Email',
    passwordLabel: 'Password',
    signIn: 'Sign in',
    signOut: 'Sign out',
    dashboard: 'Dashboard',
    enquiries: 'Enquiries',
    settings: 'Settings',
    emptyEnquiries: 'No enquiries yet. New ones appear here as soon as the form is submitted.',
    statuses: STATUSES,
    priorities: PRIORITIES,
    navLabel: 'Back office',
    groupEnquiries: 'Enquiries',
    groupSite: 'Site',
    viewSite: 'View site',
    checkingSession: 'Checking your sign-in',
    loading: 'Loading',
    signedInAs: 'Signed in as',
    /* Back-office pages (dashboard, enquiry list, enquiry detail, settings). Same voice, denser. */
    eyebrow: 'Back office',
    errorTitle: 'Something went wrong',
    errorGeneric: 'The request did not go through. Reload the page and try again.',
    loginFailed: 'Sign-in failed',
    loginMissing: 'Enter both your email and your password.',
    signingIn: 'Signing in…',
    loadingEnquiries: 'Loading enquiries',
    kinds: {
      quote: 'Quote',
      audit: 'Audit',
      callback: 'Call back',
      contact: 'Other',
    },
    dashboardTitle: 'At a glance',
    stats: {
      total: 'Total',
      new: 'New',
      last7: 'Last 7 days',
      last30: 'Last 30 days',
      today: 'Today',
    },
    editAvailability: 'Edit in settings',
    byStatus: 'By status',
    byService: 'By service',
    latest: 'Latest enquiries',
    allEnquiries: 'All enquiries',
    columns: {
      ref: 'Ref',
      received: 'Received',
      name: 'Name / Business',
      service: 'Service',
      kind: 'Type',
      status: 'Status',
      priority: 'Priority',
      count: 'Count',
      open: 'Open',
    },
    filters: {
      search: 'Search',
      searchPlaceholder: 'Search',
      searchHint: 'Name, business, email or reference.',
      searchPlaceholderLong: 'Name, business, email or reference',
      status: 'Status',
      service: 'Service',
      open: 'Open',
      all: 'All',
      allServices: 'All services',
      exportCsv: 'Export CSV',
      clear: 'Clear filters',
      showAll: 'Show all',
    },
    showing: 'Showing {from}–{to} of {total}',
    previous: 'Previous',
    next: 'Next',
    emptyTitle: 'No enquiries yet.',
    emptyFilteredTitle: 'Nothing matches.',
    emptyFilteredBody: 'Try clearing the filters.',
    detail: {
      received: 'Received',
      updated: 'Updated',
      notFoundTitle: 'Enquiry not found.',
      notFound: 'That enquiry does not exist or has been deleted.',
      statusLabel: 'Status',
      priorityLabel: 'Priority',
      saving: 'Saving',
      saved: 'Saved',
      saveFailed: 'The change was not saved. Try again.',
      savedBody: 'The change is listed under Activity.',
      actions: {
        contacted: 'Mark contacted',
        quoted: 'Mark quoted',
        won: 'Mark won',
        lost: 'Mark lost',
      },
      email: 'Email',
      phone: 'Phone',
      whatsapp: 'Open in WhatsApp',
      whatsappMessage: 'Hello {name}, this is Abdurrahman Gurib about your enquiry {reference}.',
      emailSubject: 'Re: {reference}',
      fields: {
        kind: 'Type',
        service: 'Service',
        package: 'Package',
        budget: 'Budget',
        timeline: 'Timeline',
        website: 'Website',
        preferWhatsapp: 'Reply on WhatsApp',
        sourcePage: 'Source page',
        userAgent: 'Browser',
      },
      yes: 'Yes',
      no: 'No',
      none: '—',
      message: 'Message',
      notes: 'Notes',
      noteLabel: 'New note',
      notePlaceholder: 'What was said, what was quoted, what happens next.',
      addNote: 'Save note',
      addingNote: 'Saving…',
      noNotes: 'No notes yet.',
      deleteNote: 'Delete note',
      confirmDeleteNote: 'Delete this note?',
      activity: 'Activity',
      events: {
        created: 'Received via the website form',
        status_changed: 'Status changed from {from} to {to}',
        priority_changed: 'Priority changed from {from} to {to}',
        note_added: 'Note added',
        email_sent: 'Notification email sent',
        emailOwner: 'to you',
        emailClient: 'to the client',
        by: 'by {by}',
      },
      deleteEnquiry: 'Delete enquiry',
      deleting: 'Deleting…',
      confirmDelete: 'Delete {reference}? This cannot be undone.',
    },
    settingsPage: {
      availabilityTitle: 'Availability',
      availabilityIntro: 'Shown under the home page heading, in the footer and on the contact page.',
      accepting: 'Accepting new projects',
      acceptingHint: 'Untick to show the availability line with a hollow dot.',
      availabilityNote: 'Availability line',
      availabilityNoteHint: 'One short sentence, up to 120 characters.',
      responseTime: 'Reply promise',
      responseTimeHint: 'Completes the sentence "replies …", for example: within one business day.',
      preview: 'Preview',
      save: 'Save',
      saving: 'Saving…',
      saved: 'Saved',
      notificationsTitle: 'Notifications',
      notificationsIntro: 'Every enquiry is stored here whether or not email is set up.',
      mailLabel: 'Email notifications',
      mailOn: 'On. Each new enquiry emails you and sends the client an acknowledgement.',
      mailOff: 'Off. Enquiries are stored here, but no email is sent.',
      mailHint: 'To turn them on, set SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER and SMTP_PASS on the server and restart it.',
      passwordTitle: 'Password',
      passwordIntro: 'At least 10 characters. You stay signed in after the change.',
      currentPassword: 'Current password',
      newPassword: 'New password',
      confirmPassword: 'Confirm new password',
      changePassword: 'Change password',
      changingPassword: 'Changing…',
      passwordMismatch: 'The two new passwords do not match.',
      passwordTooShort: 'Use at least 10 characters.',
      passwordChanged: 'Password changed',
      passwordFailed: 'Password not changed',
    },
  },

  seo: {
    home: {
      title: 'Abdurrahman Gurib · Software engineer & IT consultant, Mauritius',
      description:
        'Websites, custom software, automation, networks, CCTV, cyber security and IT support for businesses in Mauritius and beyond. Fixed prices in MUR, one engineer, reply within one business day.',
    },
    services: {
      title: 'Services · Websites, software, IT and security',
      description:
        'Thirteen services from one engineer: website design and redesign, online stores, custom applications, mobile apps, automation and AI, cloud, cyber security, networks, CCTV, telephony, IT support and marketing.',
    },
    pricing: {
      title: 'Pricing · Fixed packages in Mauritian rupees',
      description:
        'Website repair from MUR 8,000, new websites from MUR 20,000, care plans from MUR 1,500 per month, IT support and security audits. Scope in writing, 50% to begin, 50% on approval.',
    },
    work: {
      title: 'Work · Projects and case studies',
      description:
        'Garage management platform, core banking payments, UK payroll, public-finance systems and business websites. Selected projects by Abdurrahman Gurib, software engineer in Mauritius.',
    },
    about: {
      title: 'About Abdurrahman Gurib',
      description:
        'Senior software engineer in Surinam, Mauritius. 7+ years across banking, enterprise software and business systems. BSc (Hons) Cyber Security, MSc Artificial Intelligence in progress.',
    },
    contact: {
      title: 'Contact · Request a quote',
      description:
        'WhatsApp +230 5908 6131 or send the enquiry form. Fixed-price quotes for websites, software, automation, networks, CCTV, security and IT support in Mauritius. Reply within one business day.',
    },
  },
};

export const FAQS: Faq[] = [
  {
    q: 'How do I start?',
    a: 'Message me on WhatsApp or send the form with a few lines about your business. I reply within one business day with questions. Then I send a short written scope with a fixed price and a delivery time. Work starts when you approve it and pay the first half.',
  },
  {
    q: 'How do you charge?',
    a: 'Fixed prices per package, in Mauritian rupees. No hourly billing. Larger projects are quoted after a short scoping call. Monthly support plans are optional and separate from the build.',
  },
  {
    q: 'I only have a Facebook page. Is that a problem?',
    a: 'No, it is the most common starting point. The Starter website at MUR 20,000 gives you four pages, an enquiry form and a WhatsApp button, using photos and text you already have. Your Facebook and Instagram pages keep working and link to it.',
  },
  {
    q: 'Can you fix my current site instead of rebuilding it?',
    a: 'Usually, yes. Website repair at MUR 8,000 covers up to three agreed issues. A page refresh at MUR 15,000 reworks up to three pages and one enquiry form. If the site is not worth saving, I will tell you before you spend anything.',
  },
  {
    q: 'Do you come on-site?',
    a: 'Yes, for network, firewall, CCTV, telephony and repair work anywhere in Mauritius. Website and software work is done remotely, with a call or a visit when it helps. IT support retainers include one on-site visit per month.',
  },
  {
    q: 'What happens after launch?',
    a: 'You get a walkthrough, the logins and a short written guide. After that you can choose a care plan from MUR 1,500 per month, or call me when something comes up and pay for that job alone.',
  },
  {
    q: 'Who owns the code and the domain?',
    a: 'You do. The domain and hosting accounts are registered in your name, and you receive the source code and content at handover. If you move to another developer later, nothing is locked to me.',
  },
  {
    q: 'How do I pay?',
    a: '50% to begin and 50% on approval, before launch. Monthly plans are billed monthly and are optional. Hosting, domains and paid third-party services are charged separately, with your approval.',
  },
  {
    q: 'Do you work with businesses outside Mauritius?',
    a: 'Yes. I take remote projects from Rodrigues, Réunion, Seychelles, Madagascar, South Africa, Europe and the Middle East. Prices are quoted in Mauritian rupees, and I can show the equivalent in your currency for reference.',
  },
  {
    q: 'Can you handle both the software and the network or CCTV side?',
    a: 'Yes. I build the website or application, and I also configure the Fortinet firewall, the Cisco switches, the 3CX phones and the Hikvision or Dahua cameras behind it. One person, one number to call when something stops working.',
  },
];
