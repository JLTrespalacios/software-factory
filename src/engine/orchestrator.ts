import { ProjectConfig, GeneratorOutput, IGenerator } from './interfaces';
import { NodeGenerator } from './generators/node';
import { FrontendGenerator } from './generators/frontend';
import { JavaGenerator } from './generators/java';
import { PythonGenerator } from './generators/python';
import { QualityEngine } from './QualityEngine';
import { CloudAdvisor } from './CloudAdvisor';

export class ProjectOrchestrator {
  private generators: Map<string, IGenerator>;
  private qualityEngine: QualityEngine;
  private cloudAdvisor: CloudAdvisor;

  constructor() {
    this.generators = new Map();
    this.generators.set('node', new NodeGenerator());
    this.generators.set('frontend', new FrontendGenerator());
    this.generators.set('java', new JavaGenerator());
    this.generators.set('python', new PythonGenerator());

    this.qualityEngine = new QualityEngine();
    this.cloudAdvisor = new CloudAdvisor();
  }

  async createProject(config: ProjectConfig): Promise<GeneratorOutput> {
    console.log(`[Orchestrator] Creating project: ${config.projectName} (${config.language})`);
    
    // Select correct generator
    let generator = this.generators.get(config.language.toLowerCase());
    
    if (!generator) {
       // Try to infer or fallback
       if (config.language.includes('java')) generator = this.generators.get('java');
       else if (config.language.includes('python')) generator = this.generators.get('python');
       else {
           console.warn(`[Orchestrator] No generator found for ${config.language}, defaulting to Node`);
           generator = this.generators.get('node');
       }
    }

    // Generate Code
    const output = await generator!.generate(config);

    // Run Quality Audit
    const auditReport = this.qualityEngine.audit(output.files);
    console.log(`[Orchestrator] Quality Audit Score: ${auditReport.score}`);
    
    // Add Audit Report to files (as a report file)
    output.files.push({
        path: 'QUALITY_REPORT.md',
        content: `# Quality Audit Report
Score: ${auditReport.score}/100
Passed: ${auditReport.passed ? 'YES' : 'NO'}

## Issues Found
${auditReport.issues.map(i => `- ${i}`).join('\n') || 'None'}

## Standards Check
- SOLID: ${auditReport.standards.solid ? '✅' : '❌'}
- Clean Architecture: ${auditReport.standards.cleanArchitecture ? '✅' : '❌'}
- DRY: ${auditReport.standards.dry ? '✅' : '❌'}
`
    });

    // Get Cloud Recommendations
    const recommendations = this.cloudAdvisor.recommend(
        config.language, 
        config.language === 'frontend' ? 'frontend' : 'backend'
    );

    // Add Cloud Guide
    const cloudGuide = `
# Cloud Deployment Guide
Based on your stack (${config.language}), we recommend the following providers:

${recommendations.map(r => `## ${r.name} ${r.freeTier ? '(FREE TIER AVAILABLE)' : ''}
- **URL**: ${r.url}
- **Why**: ${r.description}
`).join('\n')}
`;
    
    output.files.push({
        path: 'CLOUD_DEPLOY.md',
        content: cloudGuide
    });

    return output;
  }
}
