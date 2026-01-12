
import { BaseGenerator } from '../../BaseGenerator';
import { ProjectConfig, GeneratorOutput, GeneratedFile } from '../../interfaces';

export class JavaGenerator extends BaseGenerator {
  async generate(config: ProjectConfig): Promise<GeneratorOutput> {
    const packageName = "com.company.app";
    const packagePath = packageName.replace(/\./g, '/');
    const basePath = `src/main/java/${packagePath}`;

    const files = [
      ...this.getCommonFiles(config),
      this.createPomXml(config, packageName),
      this.createApplicationClass(config, basePath, packageName),
      this.createResources(config),
      this.createController(basePath, packageName),
      this.createService(basePath, packageName)
    ].flat();

    return {
      files,
      instructions: [
        'mvn spring-boot:run'
      ],
      dependencies: {
        "spring-boot-starter-web": "3.1.2"
      }
    };
  }

  private createPomXml(config: ProjectConfig, _packageName: string): GeneratedFile {
    return this.createFile('pom.xml', `
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.1.2</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>
    <groupId>com.company</groupId>
    <artifactId>${config.projectName.toLowerCase().replace(/\s+/g, '-')}</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>${config.projectName}</name>
    <description>${config.description || 'Generated Project'}</description>
    <properties>
        <java.version>17</java.version>
    </properties>
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency> 
            <groupId>org.projectlombok</groupId> 
            <artifactId>lombok</artifactId> 
            <optional>true</optional> 
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>

</project>
    `.trim());
  }

  private createApplicationClass(_config: ProjectConfig, basePath: string, packageName: string): GeneratedFile {
    return this.createFile(`${basePath}/Application.java`, `
package ${packageName};

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Application {

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

}
    `.trim());
  }

  private createResources(config: ProjectConfig): GeneratedFile {
    return this.createFile('src/main/resources/application.yml', `
server:
  port: 8080

spring:
  application:
    name: ${config.projectName}
    `.trim());
  }

  private createController(basePath: string, packageName: string): GeneratedFile {
    return this.createFile(`${basePath}/controller/HealthController.java`, `
package ${packageName}.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
public class HealthController {

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "UP");
    }
}
    `.trim());
  }

  private createService(basePath: string, packageName: string): GeneratedFile {
    return this.createFile(`${basePath}/service/ExampleService.java`, `
package ${packageName}.service;

import org.springframework.stereotype.Service;

@Service
public class ExampleService {
    
    public String getGreeting() {
        return "Hello from Software Factory!";
    }
}
    `.trim());
  }
}
