/**
 * Webhook Test Component
 * 
 * A real webhook testing interface for testing with actual n8n endpoints.
 * This demonstrates how to test webhook functionality with real responses.
 */

import React, { useState, useEffect } from 'react';
import { useSimpleWebhook } from '../hooks/useSimpleWebhook';
import { simpleWebhookService } from '../services/simpleWebhookService';

export const WebhookTest: React.FC = () => {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [testData, setTestData] = useState('');
  const [responseData, setResponseData] = useState('');

  const {
    isSending,
    hasResponse,
    hasError,
    response,
    error,
    pendingCount,
    sendWebhook,
    testWebhook,
    clearState,
    clearAll,
    updatePendingCount
  } = useSimpleWebhook({
    onSuccess: (response) => {
      console.log('Webhook response received:', response);
    },
    onError: (error) => {
      console.error('Webhook error:', error);
    },
    onTimeout: () => {
      console.warn('Webhook request timed out');
    }
  });

  // Update pending count periodically
  useEffect(() => {
    const interval = setInterval(updatePendingCount, 1000);
    return () => clearInterval(interval);
  }, [updatePendingCount]);

  const handleSendTest = async () => {
    if (!webhookUrl.trim()) {
      alert('Please enter a webhook URL');
      return;
    }

    const data = testData.trim() || {
      message: 'Test webhook from SPA',
      timestamp: Date.now(),
      userAgent: navigator.userAgent
    };

    await sendWebhook(webhookUrl, 'test', data);
  };

  const handleTestConnectivity = async () => {
    if (!webhookUrl.trim()) {
      alert('Please enter a webhook URL');
      return;
    }

    const isAvailable = await testWebhook(webhookUrl);
    alert(isAvailable ? 'Webhook is available!' : 'Webhook is not available');
  };

  const handleSimulateN8nResponse = () => {
    if (!responseData.trim()) {
      alert('Please enter response data');
      return;
    }

    try {
      const responseDataObj = JSON.parse(responseData);
      const sessionId = `simulate-${Date.now()}`;
      
      // Simulate n8n sending a response back to the SPA
      simpleWebhookService.handleWebhookResponse({
        sessionId,
        success: true,
        data: responseDataObj,
        timestamp: Date.now()
      });

      alert(`n8n response simulated for session: ${sessionId}`);
    } catch (error) {
      alert('Invalid JSON in response data');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Real Webhook Testing</h1>
      
      {/* Configuration */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Configuration</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Webhook URL (n8n endpoint)
          </label>
          <input
            type="url"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            placeholder="https://your-n8n-instance.com/webhook/abc123"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Test Data (JSON)
          </label>
          <textarea
            value={testData}
            onChange={(e) => setTestData(e.target.value)}
            placeholder='{"message": "Hello from SPA", "user": "test-user"}'
            className="w-full p-2 border border-gray-300 rounded-md h-20"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleTestConnectivity}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Test Connectivity
          </button>
        </div>
      </div>

      {/* n8n Response Simulation */}
      <div className="mb-6 p-4 bg-purple-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">n8n Response Simulation</h2>
        <p className="text-sm text-gray-600 mb-4">
          Simulate n8n sending a response back to the SPA (for testing response handling)
        </p>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            n8n Response Data (JSON)
          </label>
          <textarea
            value={responseData}
            onChange={(e) => setResponseData(e.target.value)}
            placeholder='{"message": "Response from n8n", "status": "success", "data": {"result": "processed"}}'
            className="w-full p-2 border border-gray-300 rounded-md h-20"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSimulateN8nResponse}
            className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
          >
            Simulate n8n Response
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="mb-6 p-4 bg-green-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Actions</h2>
        
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={handleSendTest}
            disabled={isSending}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50"
          >
            {isSending ? 'Sending...' : 'Send Test Webhook'}
          </button>
          
          <button
            onClick={clearState}
            className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
          >
            Clear State
          </button>
          
          <button
            onClick={clearAll}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Clear All Pending
          </button>
        </div>
      </div>

      {/* Status */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Status</h2>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Pending Requests:</strong> {pendingCount}
          </div>
          <div>
            <strong>Status:</strong> {isSending ? 'Sending' : hasError ? 'Error' : hasResponse ? 'Success' : 'Idle'}
          </div>
        </div>
      </div>

      {/* Response */}
      {hasResponse && response && (
        <div className="mb-6 p-4 bg-green-50 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Response</h2>
          <pre className="text-sm bg-white p-4 rounded border overflow-auto">
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}

      {/* Error */}
      {hasError && error && (
        <div className="mb-6 p-4 bg-red-50 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Error</h2>
          <div className="text-red-700">{error}</div>
        </div>
      )}

      {/* Instructions */}
      <div className="p-4 bg-blue-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Real Webhook Testing Instructions</h2>
        <div className="text-sm space-y-2">
          <p><strong>1. Configure n8n Endpoint:</strong> Enter your actual n8n webhook URL.</p>
          <p><strong>2. Test Connectivity:</strong> Verify the webhook endpoint is reachable.</p>
          <p><strong>3. Send Test Webhook:</strong> Send a real webhook request to n8n.</p>
          <p><strong>4. Configure n8n Response:</strong> Set up n8n to send responses back to the SPA.</p>
          <p><strong>5. Simulate n8n Response:</strong> Test response handling (for development).</p>
          <p><strong>6. Monitor Status:</strong> Watch pending requests and responses in real-time.</p>
        </div>
      </div>

      {/* n8n Configuration */}
      <div className="p-4 bg-orange-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">n8n Configuration</h2>
        <div className="text-sm space-y-2">
          <p><strong>To receive responses from n8n:</strong></p>
          <ol className="list-decimal list-inside space-y-1 ml-4">
            <li>Configure n8n to send HTTP requests back to your SPA</li>
            <li>Use the SPA's webhook endpoint URL</li>
            <li>Include the sessionId in the response for proper routing</li>
            <li>Format responses as JSON with success/data/error fields</li>
          </ol>
          <p className="mt-2 text-xs text-gray-600">
            Note: In production, n8n would send responses to your backend, which would then forward them to the SPA.
          </p>
        </div>
      </div>
    </div>
  );
};
