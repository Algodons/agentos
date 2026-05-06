/**
 * PromptSanitizer — strips malicious instructions from prompts before execution.
 */
export class PromptSanitizer {
  private readonly blockedPhrases: RegExp[] = [
    /ignore\s+(all\s+)?previous\s+instructions?/gi,
    /disregard\s+(all\s+)?previous\s+instructions?/gi,
    /you\s+are\s+now\s+(?:a\s+)?(?:dan|jailbreak|evil|unrestricted)/gi,
    /act\s+as\s+if\s+you\s+have\s+no\s+restrictions/gi,
    /forget\s+your\s+(?:training|guidelines|rules)/gi,
    /system\s*:\s*you\s+must/gi,
    /<\s*script[^>]*>/gi,
    /javascript:/gi,
    /data:text\/html/gi,
  ];

  sanitize(prompt: string): string {
    let sanitized = prompt;
    for (const pattern of this.blockedPhrases) {
      sanitized = sanitized.replace(pattern, '[REDACTED]');
    }
    return sanitized.trim();
  }
}
