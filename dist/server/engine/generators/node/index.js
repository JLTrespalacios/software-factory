"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeGenerator = void 0;
const BaseGenerator_1 = require("../BaseGenerator");
class NodeGenerator extends BaseGenerator_1.BaseGenerator {
    async generate(config) {
        // const isMicro = config.architecture === 'microservices';
        const files = [
            ...this.getCommonFiles(config),
            this.createPackageJson(config),
            this.createTsConfig(),
            this.createIndexFile(config),
            this.createStructure(config)
        ].flat();
        return {
            files,
            instructions: [
                'npm install',
                'npm run dev'
            ],
            dependencies: {
                "express": "^4.18.2",
                "cors": "^2.8.5",
                "dotenv": "^16.3.1",
                "typescript": "^5.2.2",
                "tsx": "^3.14.0"
            }
        };
    }
    createPackageJson(config) {
        return this.createFile('package.json', JSON.stringify({
            name: config.projectName.toLowerCase().replace(/\s+/g, '-'),
            version: "1.0.0",
            description: config.description,
            main: "src/index.ts",
            scripts: {
                "dev": "tsx watch src/index.ts",
                "build": "tsc",
                "start": "node dist/index.js"
            },
            dependencies: {}, // Will be filled by Packager or Client logic
            devDependencies: {
                "@types/node": "^20.8.0",
                "@types/express": "^4.17.18"
            }
        }, null, 2));
    }
    createTsConfig() {
        return this.createFile('tsconfig.json', JSON.stringify({
            compilerOptions: {
                target: "ES2022",
                module: "NodeNext",
                moduleResolution: "NodeNext",
                outDir: "./dist",
                rootDir: "./src",
                strict: true,
                esModuleInterop: true
            },
            include: ["src/**/*"]
        }, null, 2));
    }
    createIndexFile(config) {
        return this.createFile('src/index.ts', `
import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';

config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: '${config.projectName}', 
    timestamp: new Date() 
  });
});

// Import Routes
import { router as apiRouter } from './routes/api';
app.use('/api', apiRouter);

app.listen(port, () => {
  console.log(\`Server running on http://localhost:\${port}\`);
});
    `);
    }
    createStructure(_config) {
        // Professional Structure: modules, routes, services, controllers
        return [
            this.createFile('src/routes/api.ts', `
import { Router } from 'express';
const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API' });
});

export { router };
      `),
            this.createFile('src/services/businessLogic.ts', `
export class BusinessService {
  process() {
    return { result: true };
  }
}
      `),
            this.createFile('.env', `PORT=3000\nNODE_ENV=development`)
        ];
    }
}
exports.NodeGenerator = NodeGenerator;
