# Estructura del Proyecto: Lógica Estructural Funcional

Para cumplir con el requerimiento de una estructura **directa, escalable y sin desorden**, hemos adoptado una arquitectura modular basada en dominios funcionales, centralizada en una carpeta `src` para mantener la raíz limpia.

## Árbol de Directorios Principal

```text
/
├── src/                    # CÓDIGO FUENTE ÚNICO
│   ├── client/             # INTERFAZ (Frontend) - La experiencia "nunca vista"
│   │   ├── features/       # Módulos funcionales (Auth, Dashboard, Editor)
│   │   ├── components/     # UI Kit base (átomos, moléculas)
│   │   └── core/           # Configuración base, hooks globales
│   │
│   ├── server/             # API & NEGOCIO (Backend)
│   │   ├── modules/        # Lógica vertical por funcionalidad
│   │   └── core/           # Configuración de servidor, DB, middlewares
│   │
│   ├── engine/             # MOTOR DE LA FÁBRICA (Automation Core)
│   │   ├── generators/     # Algoritmos de creación de código
│   │   └── templates/      # Plantillas base inteligentes
│   │
│   └── shared/             # CÓDIGO COMPARTIDO (Agnóstico)
│       ├── types/          # Definiciones de tipos (Contratos de interfaz)
│       └── utils/          # Funciones puras compartidas
│
├── infra/                  # INFRAESTRUCTURA (IaC)
│   ├── docker/             # Contenedores
│   └── cloud/              # Configuraciones de nube
│
├── scripts/                # AUTOMATIZACIÓN INTERNA
│   └── setup/              # Scripts de inicialización
│
└── docs/                   # DOCUMENTACIÓN VIVA
```

## Principios de Orden

1.  **Encapsulamiento por Funcionalidad (Feature-First):**
    En lugar de agrupar por tipo de archivo (ej. no tener una carpeta gigante de `controllers` o `views`), agrupamos por **funcionalidad**.
    *   *Ejemplo:* Todo lo relacionado con "Usuarios" (UI, API, Lógica) vive en sus respectivos módulos de usuario, facilitando la escalabilidad. Si borras el módulo, borras la feature completa sin dejar basura.

2.  **Separación de Intereses (Separation of Concerns):**
    *   `client`: Solo se preocupa por la presentación y experiencia de usuario.
    *   `server`: Solo se preocupa por los datos y reglas de negocio.
    *   `engine`: Es el cerebro especial de este proyecto, separado del backend convencional porque su ciclo de vida y complejidad son diferentes (procesamiento pesado, IA, generación de archivos).

3.  **Raíz Limpia:**
    La raíz del proyecto solo contendrá archivos de configuración esenciales (`package.json`, `.gitignore`, `README.md`) y las carpetas de alto nivel. Todo el código vive en `src`.

Esta estructura permite que el proyecto crezca a cientos de módulos sin que la navegación se vuelva caótica.
