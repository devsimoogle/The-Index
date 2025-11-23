export interface TemplateConfig {
    id: string;
    name: string;
    description: string;
    previewIcon: string; // Icon name from lucide-react
    theme: {
        layout: 'classic' | 'grid' | 'magazine' | 'minimal';
        colors: {
            paper: string;
            ink: string;
            graphite: string;
            mist: string;
            accent: string;
        };
        fonts: {
            serif: string;
            sans: string;
            mono: string;
        };
        borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'full';
        scale: number;
    };
    customCSS?: string;
}

export const PREMADE_TEMPLATES: TemplateConfig[] = [
    {
        id: 'academic-journal',
        name: 'Academic Journal',
        description: 'Professional and scholarly design perfect for research and academic content',
        previewIcon: 'BookOpen',
        theme: {
            layout: 'classic',
            colors: {
                paper: '#fafafa',
                ink: '#1a1a1a',
                graphite: '#666666',
                mist: '#f5f5f5',
                accent: '#2563eb'
            },
            fonts: {
                serif: '"Merriweather"',
                sans: '"Inter"',
                mono: '"JetBrains Mono"'
            },
            borderRadius: 'none',
            scale: 1.05
        },
        customCSS: `
      /* Academic Journal Custom Styles */
      .post-title { letter-spacing: -0.02em; }
      .post-excerpt { line-height: 1.8; }
    `
    },
    {
        id: 'modern-magazine',
        name: 'Modern Magazine',
        description: 'Bold and contemporary design with vibrant colors and dynamic layouts',
        previewIcon: 'Sparkles',
        theme: {
            layout: 'magazine',
            colors: {
                paper: '#ffffff',
                ink: '#0a0a0a',
                graphite: '#737373',
                mist: '#fafafa',
                accent: '#f59e0b'
            },
            fonts: {
                serif: '"Playfair Display"',
                sans: '"Inter"',
                mono: '"Space Mono"'
            },
            borderRadius: 'lg',
            scale: 1
        },
        customCSS: `
      /* Modern Magazine Custom Styles */
      .featured-post { box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); }
      .post-card:hover { transform: translateY(-4px); }
    `
    },
    {
        id: 'minimalist-tech',
        name: 'Minimalist Tech',
        description: 'Clean and minimal design focused on content and readability',
        previewIcon: 'Zap',
        theme: {
            layout: 'grid',
            colors: {
                paper: '#ffffff',
                ink: '#171717',
                graphite: '#a3a3a3',
                mist: '#f5f5f5',
                accent: '#10b981'
            },
            fonts: {
                serif: '"Inter"',
                sans: '"Inter"',
                mono: '"JetBrains Mono"'
            },
            borderRadius: 'md',
            scale: 0.95
        },
        customCSS: `
      /* Minimalist Tech Custom Styles */
      * { transition: all 0.2s ease; }
      .post-card { border: 1px solid #e5e5e5; }
    `
    }
];
