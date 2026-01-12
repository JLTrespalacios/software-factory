
import { ProjectOrchestrator } from './orchestrator';
import { ProjectConfig } from './interfaces';

async function test() {
    const orchestrator = new ProjectOrchestrator();
    
    console.log("Testing Java Generation...");
    const javaConfig: ProjectConfig = {
        projectName: 'JavaTest',
        description: 'A test java project',
        language: 'java',
        architecture: 'monolith'
    };
    const javaResult = await orchestrator.createProject(javaConfig);
    console.log("Java Files Generated:", javaResult.files.length);
    const hasPom = javaResult.files.some(f => f.path.includes('pom.xml'));
    console.log("Has pom.xml:", hasPom);
    const hasQualityJava = javaResult.files.some(f => f.path.includes('QUALITY_REPORT.md'));
    console.log("Has Quality Report:", hasQualityJava);

    console.log("\nTesting Python Generation...");
    const pyConfig: ProjectConfig = {
        projectName: 'PyTest',
        description: 'A test python project',
        language: 'python',
        architecture: 'monolith'
    };
    const pyResult = await orchestrator.createProject(pyConfig);
    console.log("Python Files Generated:", pyResult.files.length);
    const hasReqs = pyResult.files.some(f => f.path.includes('requirements.txt'));
    console.log("Has requirements.txt:", hasReqs);
    const hasCloudPy = pyResult.files.some(f => f.path.includes('CLOUD_DEPLOY.md'));
    console.log("Has Cloud Deploy Guide:", hasCloudPy);
}

test().catch(console.error);
