export interface ProjectConfig {
  projectName: string;
  description?: string;
  domain?: string;
  language: 'node' | 'python' | 'java' | 'frontend' | string;
  architecture: 'monolith' | 'microservices' | 'serverless' | string;
  cloudProvider?: string;
  database?: string;
  license?: 'mit' | 'proprietary';
}

export interface GeneratedFile {
  path: string;
  content: string;
}

export interface GeneratorOutput {
  files: GeneratedFile[];
  instructions: string[]; // For README
  dependencies: Record<string, string>;
}

export interface IGenerator {
  generate(config: ProjectConfig): Promise<GeneratorOutput>;
}
