"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectOrchestrator = void 0;
const node_1 = require("./generators/node");
const frontend_1 = require("./generators/frontend");
const java_1 = require("./generators/java");
const python_1 = require("./generators/python");
const QualityEngine_1 = require("./QualityEngine");
const CloudAdvisor_1 = require("./CloudAdvisor");
class ProjectOrchestrator {
    generators;
    qualityEngine;
    cloudAdvisor;
    constructor() {
        this.generators = new Map();
        this.generators.set('node', new node_1.NodeGenerator());
        this.generators.set('frontend', new frontend_1.FrontendGenerator());
        this.generators.set('java', new java_1.JavaGenerator());
        this.generators.set('python', new python_1.PythonGenerator());
        this.qualityEngine = new QualityEngine_1.QualityEngine();
        this.cloudAdvisor = new CloudAdvisor_1.CloudAdvisor();
    }
    async createProject(config) {
        console.log(`[Orchestrator] Creating project: ${config.projectName} (${config.language})`);
        // Select correct generator
        let generator = this.generators.get(config.language.toLowerCase());
        if (!generator) {
            // Try to infer or fallback
            if (config.language.includes('java'))
                generator = this.generators.get('java');
            else if (config.language.includes('python'))
                generator = this.generators.get('python');
            else {
                console.warn(`[Orchestrator] No generator found for ${config.language}, defaulting to Node`);
                generator = this.generators.get('node');
            }
        }
        // Generate Code
        const output = await generator.generate(config);
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
        const recommendations = this.cloudAdvisor.recommend(config.language, config.language === 'frontend' ? 'frontend' : 'backend');
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
exports.ProjectOrchestrator = ProjectOrchestrator;
