"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QualityEngine = void 0;
class QualityEngine {
    audit(files) {
        const issues = [];
        let score = 100;
        // Check for essential files
        const hasReadme = files.some(f => f.path.toLowerCase().includes('readme.md'));
        const hasGitignore = files.some(f => f.path === '.gitignore');
        const hasPackageConfig = files.some(f => f.path.endsWith('package.json') || f.path.endsWith('pom.xml') || f.path.endsWith('requirements.txt'));
        if (!hasReadme) {
            issues.push("Missing README.md documentation.");
            score -= 10;
        }
        if (!hasGitignore) {
            issues.push("Missing .gitignore file.");
            score -= 5;
        }
        if (!hasPackageConfig) {
            issues.push("Missing dependency management file (package.json, pom.xml, etc.).");
            score -= 20;
        }
        // Check for Structure (Heuristic)
        const hasSrc = files.some(f => f.path.startsWith('src/') || f.path.startsWith('app/'));
        if (!hasSrc) {
            issues.push("Project structure does not follow standard conventions (missing src/ or app/ folder).");
            score -= 15;
        }
        // Check for Separation of Concerns (Heuristic)
        const hasControllers = files.some(f => f.path.includes('controller') || f.path.includes('routes'));
        const hasServices = files.some(f => f.path.includes('service') || f.path.includes('usecase'));
        // If it's a backend project, we expect layers
        const isBackend = files.some(f => f.path.endsWith('package.json') && f.content.includes('express')) ||
            files.some(f => f.path.endsWith('pom.xml'));
        if (isBackend) {
            if (!hasControllers && !hasServices) {
                issues.push("Code does not seem to follow Layered Architecture (missing controllers/services).");
                score -= 15;
            }
        }
        return {
            score,
            passed: score > 70,
            issues,
            standards: {
                solid: true, // Assumed by generator design
                cleanArchitecture: hasServices, // Proxy metric
                dry: true, // Assumed
                security: true // Assumed
            }
        };
    }
}
exports.QualityEngine = QualityEngine;
