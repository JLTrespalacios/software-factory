"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const main_1 = require("../engine/main");
const packager_1 = require("../engine/packager");
const fastify = (0, fastify_1.default)({
    logger: true
});
// --- HEALTH CHECK (Requested by User) ---
fastify.get("/api/health", async () => {
    return { status: "ok", service: "software-factory-backend" };
});
// --- FACTORY START (Requested by User) ---
fastify.post("/api/factory/start", async (request, reply) => {
    try {
        const requirements = request.body;
        // Integrate with Engine
        // For now, we just acknowledge receipt as the frontend drives the stages
        // const result = await runFactory(requirements); 
        return reply.send({ success: true, message: "Factory Process Started", requirements });
    }
    catch (error) {
        reply.status(500).send({ error: "Factory execution failed" });
    }
});
fastify.register(cors_1.default, {
    origin: true
});
// --- ENGINE & STATE ---
const engine = new main_1.SoftwareFactoryEngine();
let projectState = {};
// --- IN-MEMORY DATABASE (Legacy Support for Requirements Console) ---
// ... (Keeping existing DB for Requirements Console compatibility if needed, but Engine takes precedence for the Factory Line)
const db = {
    stakeholders: [],
    elicitation: [],
    questions: { C: [], FR: [], D: [], Q: [], R: [] },
    requirements: [],
    qa: { checklist: { "Code Quality": false, "Security": false, "Performance": false } },
    techStack: {
        languages: {
            "Web & Scripting": ["JavaScript", "TypeScript", "Python", "PHP", "HTML", "CSS"],
            "Systems & Enterprise": ["Java", "C#", "Go", "Rust"]
        },
        frameworks: {
            "Frontend": ["React", "Vue", "Angular", "Svelte", "Next.js"],
            "Backend": ["Express", "NestJS", "Django", "Spring Boot", ".NET Core"]
        },
        cloud: {
            "Providers": ["AWS", "Azure", "GCP", "DigitalOcean"],
            "Services": ["Lambda", "EC2", "S3", "Kubernetes"]
        },
        databases: {
            "SQL": ["PostgreSQL", "MySQL", "SQL Server"],
            "NoSQL": ["MongoDB", "Redis", "Cassandra", "DynamoDB"]
        },
        tools: ["Docker", "Git", "Jenkins", "Terraform", "Ansible"],
        devops: ["Docker", "Kubernetes", "Jenkins", "GitHub Actions", "GitLab CI"],
        testing: ["Jest", "Cypress", "Selenium", "Playwright", "JUnit"],
        security: ["SonarQube", "OWASP ZAP", "Snyk", "Auth0", "Keycloak"],
        observability: ["Prometheus", "Grafana", "ELK Stack", "Datadog", "New Relic"],
        ai: ["OpenAI API", "TensorFlow", "PyTorch", "Hugging Face", "LangChain"],
        integration: ["RabbitMQ", "Kafka", "Zapier", "MuleSoft", "GraphQL"],
        documentation: ["Swagger", "Postman", "Confluence", "Notion", "Docusaurus"]
    },
    selectedStack: { languages: [], frameworks: [], tools: [], cloud: [], database: [] },
    methodologies: [
        { id: 'scrum', name: 'Scrum', description: 'Iterative, sprint-based approach.' },
        { id: 'kanban', name: 'Kanban', description: 'Visual flow management.' },
        { id: 'waterfall', name: 'Waterfall', description: 'Linear sequential phases.' }
    ],
    selectedMethodology: { id: 'scrum' },
    summary: { totalStakeholders: 0, totalRequirements: 0, riskScore: 0 }
};
// --- THEMES ---
const themes = [
    { id: 'hybrid', name: 'Híbrido (Neon/Slate)' },
    { id: 'light', name: 'Light Mode' },
    { id: 'dark', name: 'Dark Mode' },
    { id: 'cyberpunk', name: 'Cyberpunk' }
];
let selectedTheme = { id: 'hybrid' };
// --- ROUTES ---
fastify.get('/', async (_request, _reply) => {
    return { hello: 'Software Factory API' };
});
// THEME ROUTES
fastify.get('/api/themes', async () => themes);
fastify.get('/api/selected-theme', async () => selectedTheme);
fastify.post('/api/selected-theme', async (req) => {
    selectedTheme = { id: req.body.id };
    return { success: true };
});
// GENERIC ENGINE PROCESSOR
fastify.post('/api/engine/process/:stageId', async (request, reply) => {
    try {
        const { stageId } = request.params;
        const inputData = request.body;
        // Invoke Engine
        const result = await engine.processStage(parseInt(stageId), inputData, projectState);
        // Update State
        projectState = result.projectState;
        return { success: true, result: result.output, logs: result.logs };
    }
    catch (error) {
        request.log.error(error);
        reply.status(500).send({ error: "Engine processing failed" });
    }
});
// PACKAGER ROUTE
fastify.post('/api/engine/package', async (request, reply) => {
    try {
        const { files, projectName } = request.body;
        const packager = new packager_1.Packager();
        // Convert map to array if strictly map, but usually JSON comes as object
        // files is { "path": "content" }
        const fileArray = Object.entries(files).map(([path, content]) => ({
            path,
            content: content
        }));
        const zipStream = await packager.createZipStream(fileArray, projectName || 'project');
        reply.header('Content-Type', 'application/zip');
        reply.header('Content-Disposition', `attachment; filename="${projectName || 'project'}.zip"`);
        return zipStream;
    }
    catch (error) {
        request.log.error(error);
        reply.status(500).send({ error: "Packaging failed" });
    }
});
// --- EXISTING ROUTES (Keep them for compatibility) ---
fastify.get('/api/stakeholders', async () => db.stakeholders);
fastify.post('/api/stakeholders', async (req) => { db.stakeholders.push({ id: `SH-${Date.now()}`, ...req.body }); return { success: true }; });
fastify.delete('/api/stakeholders/:id', async (req) => { db.stakeholders = db.stakeholders.filter((s) => s.id !== req.params.id); return { success: true }; });
fastify.get('/api/elicitation', async () => db.elicitation);
fastify.post('/api/elicitation', async (req) => { db.elicitation.push({ id: `ACT-${Date.now()}`, ...req.body }); return { success: true }; });
fastify.delete('/api/elicitation/:id', async (req) => { db.elicitation = db.elicitation.filter((s) => s.id !== req.params.id); return { success: true }; });
fastify.get('/api/questions', async () => db.questions);
fastify.post('/api/questions', async (req) => {
    const { category, id, answer } = req.body;
    if (db.questions[category]) {
        db.questions[category] = db.questions[category].map((q) => q.id === id ? { ...q, answer } : q);
    }
    return { success: true };
});
fastify.get('/api/requirements', async () => db.requirements);
fastify.post('/api/requirements', async (req) => {
    db.requirements.push({ id: `REQ-${Date.now()}`, status: 'Pendiente', ...req.body });
    return { success: true };
});
fastify.delete('/api/requirements/:id', async (req) => { db.requirements = db.requirements.filter((r) => r.id !== req.params.id); return { success: true }; });
fastify.get('/api/qa', async () => db.qa.checklist);
fastify.post('/api/qa', async (req) => {
    db.qa.checklist = { ...db.qa.checklist, ...req.body };
    return { success: true };
});
fastify.get('/api/tech-stack', async () => db.techStack);
fastify.get('/api/selected-stack', async () => db.selectedStack);
fastify.post('/api/selected-stack', async (req) => {
    db.selectedStack = { ...db.selectedStack, ...req.body };
    return { success: true };
});
fastify.get('/api/methodologies', async () => db.methodologies);
fastify.get('/api/selected-methodology', async () => db.selectedMethodology);
fastify.post('/api/selected-methodology', async (req) => {
    db.selectedMethodology = req.body;
    return { success: true };
});
fastify.get('/api/summary', async () => {
    const reqCount = db.requirements.length;
    const estimatedWeeks = Math.max(2, Math.ceil(reqCount * 0.5));
    const traditionalWeeks = Math.ceil(estimatedWeeks * 1.6);
    const estimatedCost = estimatedWeeks * 2500;
    // Simple logic to recommend team based on stack
    const recommendedTeam = ['Project Manager', 'Lead Developer'];
    if (db.selectedStack.languages && db.selectedStack.languages.length > 0)
        recommendedTeam.push('Backend Developer');
    if (db.selectedStack.frameworks && db.selectedStack.frameworks.length > 0)
        recommendedTeam.push('Frontend Developer');
    if (db.qa.checklist['Security'])
        recommendedTeam.push('Security Specialist');
    if (reqCount > 5)
        recommendedTeam.push('QA Engineer');
    return {
        requirementsCount: reqCount,
        estimatedCost: estimatedCost,
        recommendedTeam: recommendedTeam,
        traditionalWeeks: traditionalWeeks,
        estimatedWeeks: estimatedWeeks,
        riskScore: Math.floor(Math.random() * 100)
    };
});
const start = async () => {
    try {
        await fastify.listen({ port: 3010 });
    }
    catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};
start();
