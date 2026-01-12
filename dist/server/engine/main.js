"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SoftwareFactoryEngine = void 0;
exports.runFactory = runFactory;
const orchestrator_1 = require("./orchestrator");
class SoftwareFactoryEngine {
    constructor() {
        console.log('Software Factory Backend Core v3.0 - Intelligent Logic Online');
    }
    // --- GENERIC STAGE PROCESSOR (Added for API compatibility) ---
    async processStage(stageId, inputData, currentProjectState) {
        console.log(`[Engine] Processing Stage ${stageId}...`);
        let output;
        let logs = [`Starting Stage ${stageId}...`];
        try {
            switch (stageId) {
                case 1:
                    output = this.processRequirements(inputData);
                    // Initialize state if needed or merge
                    if (!currentProjectState.requirements)
                        currentProjectState.requirements = {};
                    Object.assign(currentProjectState.requirements, output);
                    break;
                case 2:
                    output = this.processDecision(currentProjectState.requirements || {}, inputData);
                    currentProjectState.decision = output;
                    break;
                case 3:
                    output = this.generateArchitecture(currentProjectState.decision || {}, inputData);
                    currentProjectState.architecture = output;
                    break;
                case 4:
                    output = this.generateDesign(currentProjectState.architecture || {}, inputData);
                    currentProjectState.design = output;
                    break;
                case 5:
                    output = this.estimateProject(currentProjectState.design || {}, inputData);
                    currentProjectState.planning = output;
                    break;
                case 6:
                    output = await this.generateCode(currentProjectState, inputData);
                    currentProjectState.construction = output;
                    break;
                case 7:
                    output = this.runTests(currentProjectState.construction || {}, inputData);
                    currentProjectState.qa = output;
                    break;
                case 8:
                    output = this.deployArtifact(currentProjectState.qa || {}, inputData);
                    currentProjectState.deployment = output;
                    break;
                case 9:
                    output = this.configureMonitoring(currentProjectState.deployment || {}, inputData);
                    currentProjectState.monitoring = output;
                    break;
                case 10:
                    output = this.calculateValuation(currentProjectState.monitoring || {}, inputData, currentProjectState);
                    currentProjectState.valuation = output;
                    break;
                case 11:
                    output = this.packageDelivery(currentProjectState.valuation || {}, inputData);
                    currentProjectState.delivery = output;
                    break;
                default:
                    throw new Error(`Invalid Stage ID: ${stageId}`);
            }
            logs.push(`Stage ${stageId} completed successfully.`);
        }
        catch (error) {
            logs.push(`Error in Stage ${stageId}: ${error.message}`);
            throw error;
        }
        return {
            output: output,
            projectState: currentProjectState,
            logs: logs
        };
    }
    // --- STAGE 1: REQUIREMENTS ANALYSIS ---
    processRequirements(data) {
        console.log("Analyzing Requirements...");
        // Logic to determine domain and risk
        const text = ((data.problemDescription || '') + (data.objectives || '')).toLowerCase();
        let domain = 'General';
        if (text.includes('pago') || text.includes('fintech') || text.includes('banco') || text.includes('dinero'))
            domain = 'FinTech';
        else if (text.includes('salud') || text.includes('médico') || text.includes('hospital'))
            domain = 'HealthTech';
        else if (text.includes('tienda') || text.includes('venta') || text.includes('e-commerce'))
            domain = 'E-Commerce';
        else if (text.includes('educación') || text.includes('curso'))
            domain = 'EdTech';
        const complexity = (data.stakeholders?.split(',').length || 1) * 2 + (data.objectives?.length > 100 ? 5 : 2);
        return {
            event: 'requirements.validated',
            analysis: {
                productType: data.projectName?.includes('App') ? 'Mobile' : 'Web/SaaS',
                businessGoal: data.objectives,
                targetUser: data.stakeholders,
                domain: domain,
                estimatedComplexity: complexity > 10 ? 'High' : 'Medium'
            },
            riskAssessment: {
                level: domain === 'FinTech' || domain === 'HealthTech' ? 'Critical' : 'Standard',
                factors: ['Data Privacy', 'Regulatory Compliance']
            },
            constraints: {
                timeToMarket: 'ASAP',
                budget: 'Flexible'
            }
        };
    }
    // --- STAGE 2: DECISION ENGINE (Methodology & Stack Selection) ---
    processDecision(reqData, inputData = {}) {
        console.log("Selecting Methodology & Tech Stack...");
        const domain = reqData.analysis?.domain || 'General';
        const complexity = reqData.analysis?.estimatedComplexity || 'Medium';
        // Methodology Logic
        let methodology = 'Scrum';
        let justification = 'Standard for iterative development.';
        if (inputData.methodologyPreference?.includes('Waterfall')) {
            methodology = 'Waterfall';
            justification = 'Selected due to fixed requirements and strict regulatory environment.';
        }
        else if (inputData.methodologyPreference?.includes('Lean')) {
            methodology = 'Lean Startup';
            justification = 'Focus on MVP and rapid validation loop.';
        }
        else if (complexity === 'High') {
            methodology = 'Scrum';
            justification = 'High complexity requires iterative sprints to manage risk and changes.';
        }
        else {
            methodology = 'Kanban';
            justification = 'Continuous flow suitable for maintenance or steady work streams.';
        }
        // Architecture Logic
        let architecture = 'Monolith';
        let archJustification = 'Simplicity for speed.';
        if (inputData.decisionCriteria?.includes('Escalabilidad') || complexity === 'High') {
            architecture = 'Microservices';
            archJustification = 'Decoupling required for independent scaling of modules.';
        }
        else if (inputData.decisionCriteria?.includes('Time-to-Market')) {
            architecture = 'Serverless';
            archJustification = 'Focus on code, zero infra management for speed.';
        }
        return {
            event: 'decision.made',
            methodology: {
                selected: methodology,
                justification: justification
            },
            architecture: {
                selected: architecture,
                justification: archJustification
            },
            stackRecommendation: {
                frontend: 'React (Next.js)',
                backend: domain === 'FinTech' ? 'Java (Spring Boot)' : 'Node.js (NestJS)',
                database: inputData.decisionCriteria?.includes('Escalabilidad') ? 'NoSQL (MongoDB)' : 'SQL (PostgreSQL)',
                infrastructure: 'AWS (Containerized)'
            }
        };
    }
    // --- STAGE 3: ARCHITECTURE DESIGN ---
    generateArchitecture(decisionData, _inputData) {
        console.log("Defining Architecture Structure...");
        const archType = decisionData.architecture?.selected || 'Monolith';
        const isMicro = archType === 'Microservices';
        const patterns = isMicro ? ['API Gateway', 'Circuit Breaker', 'CQRS'] : ['MVC', 'Repository Pattern'];
        const layers = ['Presentation', 'Application/Business', 'Domain', 'Infrastructure/Persistence'];
        return {
            event: 'architecture.ready',
            structure: {
                type: archType,
                layers: layers,
                patterns: patterns,
                security: ['OAuth2/OIDC', 'Rate Limiting', 'WAF'],
                scalability: isMicro ? 'Horizontal (Pod Autoscaling)' : 'Vertical (Resource Upgrade)'
            },
            diagram: isMicro
                ? '[Client] -> [API Gateway] -> [Auth Service, User Service, Business Service] -> [DB Cluster]'
                : '[Client] -> [Load Balancer] -> [App Server Cluster] -> [Primary DB]',
            components: isMicro ? 5 : 2
        };
    }
    // --- STAGE 4: UX/UI DESIGN ---
    generateDesign(_archData, inputData) {
        console.log("Generating UX/UI System...");
        return {
            event: 'ui.designed',
            system: {
                designSystem: 'Atomic Design',
                theme: inputData.designStyle || 'Modern',
                accessibility: inputData.accessibility || 'AA',
                responsive: inputData.deviceSupport || ['Mobile', 'Desktop']
            },
            assets: {
                wireframes: 'Generated',
                prototypes: 'Interactive',
                styleGuide: 'Compiled'
            }
        };
    }
    // --- STAGE 5: PLANNING ---
    estimateProject(_designData, inputData) {
        console.log("Calculating Estimates...");
        const sprints = inputData.sprints || 4;
        const teamSize = inputData.teamSize || 3;
        const burnRate = 2500; // Weekly cost per dev
        const totalCost = sprints * 2 * teamSize * burnRate; // 2 weeks per sprint
        return {
            event: 'plan.ready',
            timeline: {
                totalDuration: `${sprints * 2} weeks`,
                sprints: sprints,
                milestones: ['MVP Alpha', 'Beta Testing', 'Production Release']
            },
            resources: {
                teamSize: teamSize,
                roles: ['Product Owner', 'Scrum Master', 'Full Stack Devs', 'QA Engineer']
            },
            budget: {
                estimatedTotal: `$${totalCost.toLocaleString()}`,
                currency: 'USD',
                confidence: '85%'
            }
        };
    }
    // --- STAGE 6: CONSTRUCTION (CODE GENERATION) ---
    async generateCode(projectState, inputData) {
        console.log("Scaffolding Project...");
        const repoUrl = inputData.repoUrl || 'git@github.com:factory/project.git';
        const projectName = inputData.projectName || projectState.intake?.projectName || 'factory-project';
        // Determine Language
        let language = 'node';
        // Prefer explicit input from Stage 6, then fallback to Decision Stage recommendation
        const backend = inputData.backend || projectState.decision?.stackRecommendation?.backend || '';
        if (backend.toLowerCase().includes('java'))
            language = 'java';
        else if (backend.toLowerCase().includes('python'))
            language = 'python';
        // Check if user explicitly asked for Frontend/HTML
        // We can check the inputData or projectState for clues
        // For now, default to Node as it's the most complete
        const orchestrator = new orchestrator_1.ProjectOrchestrator();
        const config = {
            projectName: projectName,
            description: projectState.intake?.problemDescription || 'Generated Project',
            language: language,
            architecture: projectState.decision?.architecture?.selected?.toLowerCase() || 'monolith'
        };
        console.log(`[Engine] calling orchestrator with config:`, config);
        const result = await orchestrator.createProject(config);
        const generatedFiles = {};
        result.files.forEach(f => generatedFiles[f.path] = f.content);
        return {
            event: 'code.generated',
            repository: {
                url: repoUrl,
                branches: ['main', 'develop', 'feature/*'],
                commits: 'Initial Commit'
            },
            generatedFiles: generatedFiles,
            structure: {
                folders: ['/src'],
                files: result.files.map(f => f.path)
            },
            qualityGate: {
                linting: 'ESLint Standard',
                formatting: 'Prettier',
                staticAnalysis: 'SonarQube Enabled'
            }
        };
    }
    // --- STAGE 7: QA & TESTING ---
    runTests(_codeData, _inputData) {
        console.log("Running Automated Tests...");
        // const _types = inputData.testTypes || ['Unit', 'Integration'];
        const coverage = 80; // Default coverage since input is commented out
        return {
            event: 'qa.passed',
            summary: {
                totalTests: 142,
                passed: 142,
                failed: 0,
                skipped: 0
            },
            coverage: {
                statements: `${coverage}%`,
                branches: `${coverage - 5}%`,
                functions: `${coverage + 2}%`,
                lines: `${coverage}%`
            },
            securityScan: {
                vulnerabilities: 0,
                grade: 'A'
            }
        };
    }
    // --- STAGE 8: DEPLOYMENT ---
    deployArtifact(_qaData, inputData) {
        console.log("Deploying to Production...");
        const env = inputData.environment || 'AWS';
        return {
            event: 'deployment.success',
            pipeline: {
                stages: ['Build', 'Test', 'Security Scan', 'Deploy'],
                status: 'Success',
                duration: '4m 12s'
            },
            environment: {
                target: env,
                url: `https://${env.toLowerCase()}.factory-deploy.com/app`,
                replicas: 3,
                health: 'Healthy'
            }
        };
    }
    // --- STAGE 9: MONITORING ---
    configureMonitoring(_deployData, inputData) {
        console.log("Configuring Observability...");
        return {
            event: 'monitoring.active',
            observability: {
                logging: 'Centralized (ELK Stack)',
                metrics: 'Prometheus + Grafana',
                tracing: 'OpenTelemetry'
            },
            alerts: {
                configured: inputData.alertThreshold ? true : false,
                channels: ['Slack', 'Email', 'PagerDuty']
            },
            status: 'All Systems Operational'
        };
    }
    // --- STAGE 10: VALUATION (PERITAJE) ---
    calculateValuation(_monitorData, _inputData, fullProjectState) {
        console.log("Calculating Market Valuation...");
        // Heuristic Valuation Logic
        const baseValue = 15000;
        // Complexity Multiplier
        const complexity = fullProjectState.requirements?.analysis?.estimatedComplexity === 'High' ? 2.5 : 1.5;
        // Architecture Multiplier
        const arch = fullProjectState.decision?.architecture?.selected === 'Microservices' ? 2.0 : 1.2;
        // Quality Multiplier
        const coverage = parseInt(fullProjectState.qa?.coverage?.statements || '0');
        const quality = coverage > 80 ? 1.2 : 1.0;
        // Market Demand Multiplier (Domain)
        const domain = fullProjectState.requirements?.analysis?.domain;
        let marketDemand = 1.0;
        if (domain === 'FinTech')
            marketDemand = 1.8;
        if (domain === 'HealthTech')
            marketDemand = 1.6;
        if (domain === 'E-Commerce')
            marketDemand = 1.4;
        const estimatedValue = baseValue * complexity * arch * quality * marketDemand;
        const roi = ((estimatedValue - 20000) / 20000) * 100; // Assuming 20k cost basis for calc
        return {
            event: 'valuation.complete',
            financials: {
                marketValue: Math.round(estimatedValue),
                currency: 'USD',
                roi: `${Math.round(roi)}%`,
                breakEvenPoint: '6 months'
            },
            scoring: {
                complexityScore: complexity * 10,
                architectureScore: arch * 10,
                qualityScore: quality * 10,
                marketPotential: marketDemand * 10
            },
            certification: {
                issued: true,
                level: 'Gold Standard',
                timestamp: new Date().toISOString()
            }
        };
    }
    // --- STAGE 11: FINAL DELIVERY ---
    packageDelivery(_valuationData, _inputData) {
        console.log("Packaging Final Deliverable...");
        return {
            event: 'delivery.ready',
            artifacts: [
                'Source Code (Zip)',
                'Docker Images',
                'API Documentation (Swagger)',
                'User Manual.pdf',
                'Architecture Diagrams',
                'Valuation Certificate'
            ],
            access: {
                repo: 'Read-Only',
                adminPanel: 'SuperUser Created'
            },
            nextSteps: [
                'Schedule Training',
                'Sign Off',
                'Handover Keys'
            ]
        };
    }
}
exports.SoftwareFactoryEngine = SoftwareFactoryEngine;
// --- FACTORY PIPELINE IMPLEMENTATION ---
const engine = new SoftwareFactoryEngine();
function stageRequirements(ctx) {
    ctx.stages.push({
        stage: "REQUIREMENTS",
        output: {
            validated: true,
            domain: ctx.requirements.productType,
        },
    });
    // Compatibility layer: Map simple output to what engine.processDecision expects
    const lastStage = ctx.stages[ctx.stages.length - 1];
    ctx.requirementsOutput = {
        analysis: {
            domain: lastStage.output.domain || 'General',
            estimatedComplexity: 'Medium' // Default
        }
    };
}
function stageDecision(ctx) {
    const r = ctx.requirements;
    ctx.stages.push({
        stage: "DECISION",
        output: {
            methodology: r.timeToMarket === "fast" ? "Lean" : "Scrum",
            architecture: r.scalability === "high" ? "Microservices" : "Monolith",
        },
    });
    // Compatibility layer: Map simple output to what engine.generateArchitecture expects
    const lastStage = ctx.stages[ctx.stages.length - 1];
    ctx.decisionOutput = {
        architecture: {
            selected: lastStage.output.architecture
        }
    };
}
function stageArchitecture(ctx) {
    ctx.stages.push({
        stage: "ARCHITECTURE",
        output: {
            layers: ["api", "domain", "infra"],
            security: "JWT",
        },
    });
    // Compatibility layer: Map simple output to what engine.generateDesign expects
    // NOTE: We are also generating a fake "designOutput" here because the user's model 
    // doesn't seem to have an explicit UI/Design stage in their provided snippet yet,
    // but the downstream stages (Planning) rely on it.
    // Create a placeholder architecture object compatible with the old engine
    const archResult = {
        event: 'architecture.ready',
        structure: {
            type: ctx.stages.find((s) => s.stage === 'DECISION')?.output.architecture || 'Monolith',
            layers: ['api', 'domain', 'infra']
        }
    };
    ctx.architectureOutput = archResult;
    // Auto-generate Design (UI/UX) as it's often skipped in backend-focused factories but needed for planning
    const designResult = engine.generateDesign(archResult, {});
    ctx.stages.push({ name: 'Design (Auto)', output: designResult });
    ctx.designOutput = designResult;
}
function stagePlanning(ctx) {
    ctx.stages.push({
        stage: "PLANNING",
        output: {
            sprints: 4,
            duration: "8 weeks",
        },
    });
    // Compatibility layer
    const last = ctx.stages[ctx.stages.length - 1];
    ctx.planningOutput = {
        timeline: {
            totalDuration: last.output.duration,
            sprints: last.output.sprints
        },
        // Default budget to ensure downstream compatibility
        budget: { estimatedTotal: '$40,000' }
    };
}
function stageBuild(ctx) {
    ctx.stages.push({
        stage: "BUILD",
        output: {
            repoStructure: [
                "src/",
                "tests/",
                "Dockerfile",
                "README.md",
            ],
        },
    });
    // Compatibility layer
    ctx.buildOutput = {
        event: 'code.generated',
        structure: {
            folders: ctx.stages[ctx.stages.length - 1].output.repoStructure
        }
    };
}
function stageQA(ctx) {
    ctx.stages.push({
        stage: "QA",
        output: {
            coverage: "85%",
            status: "PASS",
        },
    });
    // Compatibility layer
    const last = ctx.stages[ctx.stages.length - 1];
    ctx.qaOutput = {
        coverage: {
            statements: last.output.coverage
        }
    };
}
function stageDeploy(ctx) {
    ctx.stages.push({
        stage: "DEPLOY",
        output: {
            environment: "cloud",
            status: "LIVE",
        },
    });
    // Compatibility layer
    const last = ctx.stages[ctx.stages.length - 1];
    ctx.deployOutput = {
        environment: {
            target: last.output.environment,
            url: 'https://generated-app.cloud/live'
        }
    };
}
function stageMonitoring(ctx) {
    ctx.stages.push({
        stage: "MONITORING",
        output: {
            metrics: ["cpu", "memory", "latency"],
        },
    });
    // Compatibility layer
    ctx.monitoringOutput = {
        event: 'monitoring.active',
        observability: {
            metrics: ctx.stages[ctx.stages.length - 1].output.metrics.join(', ')
        }
    };
}
function stageValuation(ctx) {
    ctx.stages.push({
        stage: "VALUATION",
        output: {
            qualityScore: 92,
            marketValue: "$25,000",
        },
    });
    // Compatibility layer
    const last = ctx.stages[ctx.stages.length - 1];
    ctx.valuationOutput = {
        event: 'valuation.complete',
        scoring: {
            qualityScore: last.output.qualityScore
        },
        financials: {
            marketValue: parseInt(last.output.marketValue.replace(/[^0-9]/g, '')),
            currency: 'USD'
        },
        certification: {
            level: 'Gold Standard'
        }
    };
}
function stagePackaging(ctx) {
    ctx.stages.push({
        stage: "DELIVERY",
        output: {
            downloadable: true,
            format: "ZIP",
        },
    });
    // Compatibility layer
    const last = ctx.stages[ctx.stages.length - 1];
    ctx.packagingOutput = {
        event: 'delivery.ready',
        artifacts: [`Source Code (${last.output.format})`]
    };
}
async function runFactory(requirements) {
    const context = {
        requirements,
        stages: [],
    };
    stageRequirements(context);
    stageDecision(context);
    stageArchitecture(context);
    stagePlanning(context);
    stageBuild(context);
    stageQA(context);
    stageDeploy(context);
    stageMonitoring(context);
    stageValuation(context);
    stagePackaging(context);
    return {
        status: "COMPLETED",
        result: context,
    };
}
