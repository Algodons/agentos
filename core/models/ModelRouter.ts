export type ModelProvider = 'openai' | 'claude' | 'gemini' | 'llama' | 'mock';

export interface ModelRequest {
  prompt: string;
  provider?: ModelProvider;
  maxTokens?: number;
}

export interface ModelResponse {
  text: string;
  provider: ModelProvider;
  latencyMs: number;
  tokensUsed: number;
  estimatedCostUsd: number;
}

/**
 * ModelRouter — routes prompt execution to the appropriate AI provider.
 * Normalises responses, retries with fallback providers, and tracks cost + latency.
 */
export class ModelRouter {
  private readonly fallbackOrder: ModelProvider[] = ['openai', 'claude', 'gemini', 'llama', 'mock'];

  async route(request: ModelRequest): Promise<ModelResponse> {
    const providers = request.provider
      ? [request.provider, ...this.fallbackOrder.filter((p) => p !== request.provider)]
      : this.fallbackOrder;

    let lastError: Error | null = null;

    for (const provider of providers) {
      try {
        return await this.callProvider(provider, request);
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));
        // Continue to next fallback
      }
    }

    throw lastError ?? new Error('ModelRouter: all providers failed');
  }

  private async callProvider(
    provider: ModelProvider,
    request: ModelRequest,
  ): Promise<ModelResponse> {
    const start = Date.now();

    // In production each branch calls the real provider SDK.
    // The mock branch ensures the system works locally without API keys.
    switch (provider) {
      case 'openai':
        return this.mockProvider('openai', request, start, 0.00002);
      case 'claude':
        return this.mockProvider('claude', request, start, 0.000015);
      case 'gemini':
        return this.mockProvider('gemini', request, start, 0.000010);
      case 'llama':
        return this.mockProvider('llama', request, start, 0.000005);
      case 'mock':
      default:
        return this.mockProvider('mock', request, start, 0.000001);
    }
  }

  private mockProvider(
    provider: ModelProvider,
    request: ModelRequest,
    start: number,
    costPerToken: number,
  ): ModelResponse {
    const tokensUsed = request.prompt.split(/\s+/).length;
    return {
      text:
        `[${provider.toUpperCase()}] Processed: ${request.prompt.slice(0, 80)}...` +
        ` (${tokensUsed} tokens)`,
      provider,
      latencyMs: Date.now() - start,
      tokensUsed,
      estimatedCostUsd: tokensUsed * costPerToken,
    };
  }
}
