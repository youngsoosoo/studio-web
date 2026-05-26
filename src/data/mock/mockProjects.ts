export interface MockProject {
  id: string;
  title: string;
  summary: string;
  role: string;
  tags: string[];
}

export const mockProjects: MockProject[] = [
  {
    id: 'aurora',
    title: 'Aurora Insights',
    summary:
      'A streaming analytics dashboard that surfaces product usage signals to PMs in near real time.',
    role: 'Lead Frontend',
    tags: ['React', 'TypeScript', 'WebSockets'],
  },
  {
    id: 'foundry',
    title: 'Foundry CMS',
    summary:
      'Headless content platform powering marketing surfaces with editable, schema-driven blocks.',
    role: 'Fullstack',
    tags: ['Spring Boot', 'PostgreSQL', 'React'],
  },
  {
    id: 'orbital',
    title: 'Orbital Scheduler',
    summary:
      'A capacity-aware scheduler that balances long-running ETL jobs across an autoscaling fleet.',
    role: 'Backend',
    tags: ['Java', 'Kafka', 'Kubernetes'],
  },
];
