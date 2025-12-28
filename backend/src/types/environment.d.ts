declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      PORT: string;
      MONGODB_URI: string;
      JWT_SECRET: string;
      JWT_EXPIRES_IN: string;
      
      // Email
      EMAIL_HOST: string;
      EMAIL_PORT: string;
      EMAIL_USER: string;
      EMAIL_PASS: string;
      EMAIL_FROM: string;
      
      // Frontend URL
      FRONTEND_URL: string;
      
      // Stripe
      STRIPE_SECRET_KEY: string;
      STRIPE_WEBHOOK_SECRET: string;
      STRIPE_PRICE_PRO_MONTHLY: string;
      STRIPE_PRICE_PRO_YEARLY: string;
      STRIPE_PRICE_ENTERPRISE: string;
      
      // AI/OpenAI (optional)
      OPENAI_API_KEY?: string;
      
      // Deployment providers (optional)
      VERCEL_TOKEN?: string;
      NETLIFY_TOKEN?: string;
      AWS_ACCESS_KEY_ID?: string;
      AWS_SECRET_ACCESS_KEY?: string;
      AWS_REGION?: string;
      
      // Rate limiting
      RATE_LIMIT_WINDOW_MS?: string;
      RATE_LIMIT_MAX_REQUESTS?: string;
    }
  }
}

export {};
