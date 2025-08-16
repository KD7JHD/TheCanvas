/**
 * Webhook Test Utilities
 * 
 * Utility functions for real webhook testing with actual n8n endpoints.
 * These utilities help create test scenarios and validate webhook functionality.
 */

import { simpleWebhookService, WebhookRequest, WebhookResponse } from '../services/simpleWebhookService';

export interface TestScenario {
  name: string;
  description: string;
  request: WebhookRequest;
  timeoutMs?: number;
}

export interface TestResult {
  scenario: TestScenario;
  success: boolean;
  response?: WebhookResponse;
  error?: string;
  duration: number;
  timestamp: number;
}

/**
 * Generate a unique session ID for testing
 */
export function generateTestSessionId(prefix: string = 'test'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Create a test webhook request
 */
export function createTestRequest(
  action: string,
  data: any,
  sessionId?: string
): WebhookRequest {
  return {
    sessionId: sessionId || generateTestSessionId(),
    action,
    data,
    timestamp: Date.now()
  };
}

/**
 * Run a single webhook test with real endpoint
 */
export async function runWebhookTest(
  url: string,
  scenario: TestScenario
): Promise<TestResult> {
  const startTime = Date.now();
  
  return new Promise((resolve) => {
    const callback = {
      onSuccess: (response: WebhookResponse) => {
        const result: TestResult = {
          scenario,
          success: true,
          response,
          duration: Date.now() - startTime,
          timestamp: Date.now()
        };
        resolve(result);
      },
      onError: (error: string) => {
        const result: TestResult = {
          scenario,
          success: false,
          error,
          duration: Date.now() - startTime,
          timestamp: Date.now()
        };
        resolve(result);
      },
      onTimeout: () => {
        const result: TestResult = {
          scenario,
          success: false,
          error: 'Request timed out',
          duration: Date.now() - startTime,
          timestamp: Date.now()
        };
        resolve(result);
      }
    };

    // Send the webhook request to the real endpoint
    simpleWebhookService.sendWebhook(
      url,
      scenario.request,
      callback,
      scenario.timeoutMs || 30000
    );
  });
}

/**
 * Run multiple webhook tests
 */
export async function runWebhookTests(
  url: string,
  scenarios: TestScenario[]
): Promise<TestResult[]> {
  const results: TestResult[] = [];
  
  for (const scenario of scenarios) {
    console.log(`Running test: ${scenario.name}`);
    const result = await runWebhookTest(url, scenario);
    results.push(result);
    
    // Add a small delay between tests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  return results;
}

/**
 * Validate test results
 */
export function validateTestResults(results: TestResult[]): {
  passed: number;
  failed: number;
  total: number;
  details: TestResult[];
} {
  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  return {
    passed,
    failed,
    total: results.length,
    details: results
  };
}

/**
 * Generate test scenarios for common use cases
 */
export function generateTestScenarios(): TestScenario[] {
  return [
    {
      name: 'Basic Test',
      description: 'Simple test with minimal data',
      request: createTestRequest('test', {
        message: 'Hello from test',
        timestamp: Date.now()
      })
    },
    {
      name: 'Project Generation',
      description: 'Test project attribute generation',
      request: createTestRequest('generate-project-attributes', {
        projectName: 'Test Project',
        goal: 'Create a simple test application',
        instructions: 'Build a web app for testing purposes'
      })
    },
    {
      name: 'Large Data Test',
      description: 'Test with larger payload',
      request: createTestRequest('process-data', {
        items: Array.from({ length: 10 }, (_, i) => ({
          id: i,
          name: `Item ${i}`,
          value: Math.random() * 1000
        })),
        metadata: {
          source: 'test-suite',
          version: '1.0.0',
          timestamp: Date.now()
        }
      })
    },
    {
      name: 'Error Handling Test',
      description: 'Test error handling with invalid data',
      request: createTestRequest('invalid-action', {
        invalidData: 'This should cause an error'
      })
    }
  ];
}

/**
 * Test webhook connectivity
 */
export async function testWebhookConnectivity(url: string): Promise<{
  available: boolean;
  responseTime: number;
  error?: string;
}> {
  const startTime = Date.now();
  
  try {
    const available = await simpleWebhookService.testWebhook(url);
    const responseTime = Date.now() - startTime;
    
    return {
      available,
      responseTime,
      error: available ? undefined : 'Webhook endpoint not responding'
    };
  } catch (error) {
    return {
      available: false,
      responseTime: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Clean up test environment
 */
export function cleanupTestEnvironment(): void {
  simpleWebhookService.clearAll();
}
