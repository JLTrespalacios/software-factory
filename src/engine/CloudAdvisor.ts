
export interface CloudProvider {
  name: string;
  url: string;
  freeTier: boolean;
  supportedLanguages: string[];
  description: string;
}

export class CloudAdvisor {
  private providers: CloudProvider[] = [
    {
      name: "Railway",
      url: "https://railway.app",
      freeTier: true,
      supportedLanguages: ['node', 'python', 'java', 'go', 'docker'],
      description: "Great for full-stack apps and databases. Easy deployment."
    },
    {
      name: "Render",
      url: "https://render.com",
      freeTier: true,
      supportedLanguages: ['node', 'python', 'go', 'rust', 'static'],
      description: "Good alternative to Heroku. Free web services spin down."
    },
    {
      name: "Vercel",
      url: "https://vercel.com",
      freeTier: true,
      supportedLanguages: ['node', 'frontend', 'python', 'go'],
      description: "Best for frontend and serverless functions (Next.js, React)."
    },
    {
      name: "Netlify",
      url: "https://netlify.com",
      freeTier: true,
      supportedLanguages: ['frontend'],
      description: "Excellent for static sites and JAMstack."
    },
    {
      name: "Fly.io",
      url: "https://fly.io",
      freeTier: true,
      supportedLanguages: ['docker', 'node', 'python', 'go'],
      description: "Run your apps close to users. Good for dockerized apps."
    },
    {
      name: "Heroku",
      url: "https://heroku.com",
      freeTier: false,
      supportedLanguages: ['node', 'python', 'java', 'php', 'go'],
      description: "The classic PaaS. Paid plans only now."
    },
    {
      name: "AWS Free Tier",
      url: "https://aws.amazon.com/free",
      freeTier: true,
      supportedLanguages: ['all'],
      description: "Enterprise grade, 12 months free on EC2/Lambda."
    }
  ];

  recommend(language: string, type: 'frontend' | 'backend' | 'fullstack'): CloudProvider[] {
    const lang = language.toLowerCase();
    
    return this.providers.filter(p => {
      // Check language support
      const supportsLang = p.supportedLanguages.includes('all') || 
                           p.supportedLanguages.includes(lang) ||
                           (lang === 'javascript' && p.supportedLanguages.includes('node')) ||
                           (lang === 'typescript' && p.supportedLanguages.includes('node'));
      
      // Check type suitability (simplified logic)
      if (type === 'frontend' && (p.name === 'Vercel' || p.name === 'Netlify')) return true;
      if (type === 'backend' && (p.name === 'Railway' || p.name === 'Render' || p.name === 'Fly.io')) return true;
      
      return supportsLang;
    }).sort((a, b) => {
        // Prioritize Free Tier
        if (a.freeTier && !b.freeTier) return -1;
        if (!a.freeTier && b.freeTier) return 1;
        return 0;
    });
  }
}
