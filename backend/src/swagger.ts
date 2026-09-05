import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Coal Mine Statutory Compliance & Governance Monitoring API',
    version: '1.0.0',
    description: 'National Digital Platform for DGMS statutory compliance, coal mine inspections, violation lifecycle, and explainable AI risk governance.',
    contact: {
      name: 'Ministry of Coal - Digital Governance Cell',
      email: 'support@coal.gov.in'
    }
  },
  servers: [
    {
      url: 'http://localhost:5000/api',
      description: 'Local Development Server'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  },
  security: [
    {
      bearerAuth: []
    }
  ],
  paths: {
    '/auth/login': {
      post: {
        summary: 'User Login & JWT Token issuance',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string', example: 'admin@coal.gov.in' },
                  password: { type: 'string', example: 'CoalGov@2026' }
                },
                required: ['email', 'password']
              }
            }
          }
        },
        responses: {
          200: { description: 'Authenticated successfully' },
          401: { description: 'Invalid official credentials' }
        }
      }
    },
    '/auth/switch-demo': {
      post: {
        summary: 'Instant Demo Role Switcher for Evaluators',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  role: { type: 'string', example: 'SAFETY_INSPECTOR' }
                },
                required: ['role']
              }
            }
          }
        },
        responses: { 200: { description: 'Role switched successfully' } }
      }
    },
    '/mines': {
      get: {
        summary: 'Retrieve all coal mines with filters and risk scores',
        tags: ['Mines'],
        responses: { 200: { description: 'List of registered collieries' } }
      },
      post: {
        summary: 'Register a new coal mine project',
        tags: ['Mines'],
        responses: { 201: { description: 'Colliery registered' } }
      }
    },
    '/compliance': {
      get: {
        summary: 'Get statutory compliance records with multi-dimensional filters',
        tags: ['Compliance'],
        responses: { 200: { description: 'Compliance obligations' } }
      }
    },
    '/violations': {
      get: {
        summary: 'Get statutory violations across mines',
        tags: ['Violations'],
        responses: { 200: { description: 'Violations list' } }
      }
    },
    '/actions': {
      get: {
        summary: 'Get corrective and preventive actions (CAPA)',
        tags: ['Corrective Actions'],
        responses: { 200: { description: 'CAPA records' } }
      }
    },
    '/ai/dashboard': {
      get: {
        summary: 'Get AI Governance overview and risk model benchmarks',
        tags: ['AI Governance'],
        responses: { 200: { description: 'AI Governance metrics' } }
      }
    },
    '/analytics/dashboard': {
      get: {
        summary: 'Get real-time KPI metrics and aggregated charts data',
        tags: ['Analytics'],
        responses: { 200: { description: 'Dashboard metrics' } }
      }
    }
  }
};

export const setupSwagger = (app: Express) => {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.get('/api/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerDocument);
  });
};

