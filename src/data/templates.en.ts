import type { ResumeTemplate } from './templates';

interface EnglishTemplateSeed extends Omit<ResumeTemplate, 'markdown'> {
  summary: string;
  skills: string;
  achievement: string;
  project: string;
}

const createEnglishMarkdown = (seed: EnglishTemplateSeed) => `# Ethan Chen

**${seed.title}**

Shanghai | +86 138 0000 0000 | ethan.chen@example.com | [github.com/ethanchen](https://github.com/ethanchen)

## Professional Summary

${seed.summary}

## Core Skills

${seed.skills}

## Experience

### ${seed.title} | Farview Technology
*Apr 2021 - Present | Shanghai*

- ${seed.achievement}
- Owned critical initiatives from requirements through delivery and review, meeting targets for eight consecutive quarters
- Established collaboration standards and quality metrics that reduced cross-team communication overhead by 30%

### ${seed.title} | CloudSail Networks
*Jul 2018 - Mar 2021 | Hangzhou*

- Led development of three core business modules serving more than one million users
- Reduced the average delivery cycle from four weeks to 2.5 weeks through process and tooling improvements

## Selected Project

### ${seed.project}

- Identified business bottlenecks, created a phased plan, and coordinated product, design, and engineering delivery
- Improved the primary success metric by 35%; the approach was adopted by three additional business units

## Certifications & Awards

- Named Employee of the Year; led a project selected as a company-wide best-practice case study
- Earned an advanced professional certification and regularly attend industry courses and technical workshops

## Community & Knowledge Sharing

- Organized 12 internal sessions on engineering practice, business methods, and cross-functional collaboration
- Maintain a personal knowledge base and contribute to open source; published articles have received 50,000+ views

## Education

### Zhejiang University | B.S. in Computer Science
*Sep 2014 - Jun 2018*

## Additional Information

- **Languages:** Mandarin (native), English (professional)
- **Website:** [ethanchen.dev](https://ethanchen.dev)`;

const seeds: EnglishTemplateSeed[] = [
  { id: 'frontend-developer', title: 'Frontend Engineer', category: 'Engineering', description: 'For React, TypeScript, and modern web developers', summary: 'Frontend engineer with 6 years of experience building complex web applications, design systems, and high-performance interfaces. Skilled at turning product goals into reliable, maintainable solutions.', skills: '- **Frontend:** React, TypeScript, Vite, CSS, accessibility\n- **Engineering:** Performance optimization, component libraries, automated testing, CI/CD', achievement: 'Modernized the core platform architecture with React, reducing initial load time from 3.2s to 1.4s', project: 'Enterprise Design System' },
  { id: 'fullstack-developer', title: 'Full-Stack Engineer', category: 'Engineering', description: 'For engineers who own the complete product stack', summary: 'Full-stack engineer experienced across frontend, backend, and cloud infrastructure, with a track record of shipping reliable products and improving system and developer performance.', skills: '- **Frontend:** React, Next.js, TypeScript\n- **Backend:** Node.js, Go, PostgreSQL, Redis\n- **Cloud:** Docker, Kubernetes, AWS', achievement: 'Designed and delivered an order platform handling five million API requests per day', project: 'Unified SaaS Workspace' },
  { id: 'devops-engineer', title: 'DevOps Engineer', category: 'Engineering', description: 'Infrastructure, reliability, and platform engineering', summary: 'Cloud infrastructure and platform engineer specializing in developer productivity, production reliability, and operating large-scale cloud-native systems.', skills: '- **Platform:** Kubernetes, Terraform, AWS, Linux\n- **Delivery:** GitHub Actions, Argo CD, observability\n- **Languages:** Go, Python, Shell', achievement: 'Built a unified delivery platform that reduced deployment time from 45 minutes to 8 minutes', project: 'Cloud-Native Developer Platform' },
  { id: 'senior-engineer', title: 'Senior Software Engineer', category: 'Engineering', description: 'Highlights technical leadership and complex systems work', summary: 'Software engineer with 10 years of experience in system design, technical decision-making, and team mentorship, including deep expertise in high-throughput, highly available services.', skills: '- **Architecture:** Distributed systems, domain modeling, event-driven design\n- **Engineering:** Java, Go, microservices, performance tuning\n- **Leadership:** Technical planning, reviews, mentoring', achievement: 'Led a payments platform redesign that increased throughput 4x while maintaining 99.99% annual availability', project: 'Next-Generation Transaction Infrastructure' },
  { id: 'modern-developer', title: 'Software Engineer', category: 'Engineering', description: 'A versatile template for software engineering roles', summary: 'Product-minded software engineer focused on code quality and user value, able to independently clarify requirements, implement systems, test releases, and support production.', skills: '- **Languages:** Java, Python, TypeScript\n- **Data:** MySQL, Redis, Elasticsearch\n- **Practices:** Unit testing, code review, agile delivery', achievement: 'Rebuilt a customer management system, reducing API errors by 60% and improving delivery velocity by 25%', project: 'Intelligent Customer Service Platform' },
  { id: 'research-engineer', title: 'Research Engineer', category: 'Engineering', description: 'Bridges academic research and production engineering', summary: 'Research engineer with strengths in both algorithms and product development, translating research methods into scalable, measurable production systems.', skills: '- **Research:** Machine learning, NLP, experimental design\n- **Engineering:** Python, PyTorch, CUDA, MLOps\n- **Outputs:** Reproductions, patents, technical reports', achievement: 'Deployed a new retrieval algorithm that improved relevance by 18% while lowering inference cost by 22%', project: 'Multimodal Content Understanding Platform' },
  { id: 'data-scientist', title: 'Data Scientist', category: 'Data & AI', description: 'Showcases measurable machine learning and analytics impact', summary: 'Data scientist skilled at extracting business insight from complex data, building interpretable predictive models, and embedding them into operational workflows.', skills: '- **Modeling:** Python, SQL, PyTorch, causal inference\n- **Data:** Spark, Airflow, feature platforms\n- **Business:** Metrics, A/B testing, visualization', achievement: 'Built a churn model with 87% recall that protected more than $1.7M in annual revenue', project: 'Intelligent Growth Decision Platform' },
  { id: 'product-manager', title: 'Product Manager', category: 'Product', description: 'For B2B, SaaS, and platform product roles', summary: 'Product manager with 8 years of enterprise software experience spanning user research, product strategy, and cross-functional delivery, with a focus on measurable business results.', skills: '- **Product:** Strategy, requirements, roadmaps, analytics\n- **Collaboration:** User interviews, prototyping, agile delivery\n- **Business:** SaaS, platforms, monetization', achievement: 'Launched a collaboration product from zero to 300 paying customers in 12 months with 92% retention', project: 'Enterprise Collaboration Platform 2.0' },
  { id: 'ux-designer', title: 'UX / UI Designer', category: 'Design', description: 'Highlights user research and product design outcomes', summary: 'Research-led product designer focused on complex workflows, information architecture, and design systems, balancing user needs with business goals.', skills: '- **Design:** Figma, prototyping, interaction, visual design\n- **Research:** Interviews, usability testing, journey mapping\n- **Systems:** Design language, components, accessibility', achievement: 'Redesigned a core workflow, increasing task completion by 28% and satisfaction by 16 points', project: 'Cross-Platform Design System' },
  { id: 'creative-professional', title: 'Creative Designer', category: 'Design', description: 'Balances creative craft with commercial impact', summary: 'Creative professional experienced in brand, digital content, and integrated campaigns, building coherent visual narratives and delivering polished work.', skills: '- **Creative:** Brand strategy, art direction, content\n- **Tools:** Adobe CC, Figma, photography, video\n- **Management:** Vendors, budgets, project coordination', achievement: 'Led a brand refresh that increased awareness by 34% and campaign conversion by 21%', project: 'Annual Integrated Brand Campaign' },
  { id: 'graphic-designer', title: 'Graphic Designer', category: 'Design', description: 'Minimal, typography-led portfolio resume', summary: 'Detail-oriented visual designer with experience in brand identity, editorial design, and digital marketing assets, with particular strength in typography and layout.', skills: '- **Visual:** Typography, layout, identity, infographics\n- **Tools:** Illustrator, InDesign, Photoshop\n- **Production:** Print, digital assets, color management', achievement: 'Created a brand template library that improved marketing production efficiency by 45%', project: 'Global Brand Identity Guidelines' },
  { id: 'business-analyst', title: 'Business Analyst', category: 'Business', description: 'Connects business requirements with technical delivery', summary: 'Business analyst experienced in process analysis, data insight, and requirements management, creating shared clarity between business and engineering teams.', skills: '- **Analysis:** SQL, Excel, Tableau, metrics\n- **Process:** BPMN, requirements modeling, UAT\n- **Industries:** Retail, supply chain, digital transformation', achievement: 'Optimized procurement workflows, reducing inventory days by 18% and saving $1.1M annually', project: 'Supply Chain Digital Transformation' },
  { id: 'project-manager', title: 'Project Manager', category: 'Management', description: 'Emphasizes on-time delivery and cross-team coordination', summary: 'Project manager experienced in large digital programs, managing scope, risk, budgets, vendors, and stakeholders to deliver complex initiatives predictably.', skills: '- **Management:** Planning, risk, budgets, vendors\n- **Methods:** Agile, Scrum, PMP, OKR\n- **Tools:** Jira, Confluence, Microsoft Project', achievement: 'Managed a $4.2M transformation program delivered three weeks early and within budget', project: 'Enterprise ERP Modernization' },
  { id: 'career-changer', title: 'Career Changer', category: 'General', description: 'Surfaces transferable skills and a clear transition story', summary: 'Experienced professional who completed structured technical training and now applies customer insight, project delivery, and analytical skills to a new career path.', skills: '- **Transferable:** Communication, project management, problem solving\n- **New skills:** Web development, SQL, data analysis\n- **Learning:** Bootcamp, certifications, independent projects', achievement: 'Led a digital process redesign in a previous role, reducing customer response time by 40%', project: 'Portfolio and Task Management Application' },
  { id: 'recent-graduate', title: 'Recent Graduate', category: 'General', description: 'Turns coursework, internships, and projects into evidence', summary: 'Recent computer science graduate with strong programming fundamentals, internship experience, and collaborative project work, with a focus on engineering quality and user experience.', skills: '- **Coursework:** Data structures, operating systems, databases, networks\n- **Technology:** Java, Python, React, MySQL\n- **Experience:** Internship, competitions, open source', achievement: 'Built an automated reporting tool during an internship that saved the team 12 hours per week', project: 'Campus Marketplace Platform' },
  { id: 'student-resume', title: 'Student Resume', category: 'General', description: 'A first resume for internships and entry-level roles', summary: 'Proactive computer science student building software development and teamwork experience through coursework, student groups, and programming competitions.', skills: '- **Foundations:** C++, Python, JavaScript, Git\n- **Coursework:** Algorithms, databases, web development\n- **Activities:** Programming contests, tech club, volunteering', achievement: 'Led a four-person course project that earned the top project rating', project: 'Smart Study Planner' },
  { id: 'academic-cv', title: 'Academic Researcher', category: 'Academic', description: 'Centers publications, grants, and teaching experience', summary: 'Human-computer interaction and visual analytics researcher experienced in independent research, publication, funded project management, and undergraduate teaching.', skills: '- **Research:** Experimental design, statistics, qualitative methods\n- **Outputs:** Publications, patents, grants, talks\n- **Teaching:** Course design, student advising, public lectures', achievement: 'Published five first-author papers at leading venues, including two best-paper nominations', project: 'National Early-Career Research Grant' },
  { id: 'executive-resume', title: 'Executive', category: 'Leadership', description: 'For director, VP, and C-level positions', summary: 'Executive with 15 years of business growth and organizational leadership experience, setting strategy, building high-performing teams, and leading multi-region transformations.', skills: '- **Strategy:** Business planning, market entry, M&A integration\n- **Operations:** P&L, growth, efficiency, risk\n- **Organization:** Executive teams, succession, board communication', achievement: 'Led a 300-person business unit to 42% three-year revenue CAGR and a 9-point margin increase', project: 'Second Growth Curve Strategy' },
];

export const englishTemplates: ResumeTemplate[] = seeds.map((seed) => ({ ...seed, markdown: createEnglishMarkdown(seed) }));
