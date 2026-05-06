/**
 * InjectionDetector — identifies prompt injection and jailbreak patterns.
 */
export class InjectionDetector {
  private readonly injectionPatterns: Array<{ pattern: RegExp; label: string }> = [
    { pattern: /ignore\s+(all\s+)?previous/gi, label: 'instruction_override' },
    { pattern: /disregard\s+(all\s+)?previous/gi, label: 'instruction_override' },
    { pattern: /you\s+are\s+now\s+(?:a\s+)?(?:dan|jailbreak)/gi, label: 'jailbreak' },
    { pattern: /act\s+as\s+(?:if|though)\s+you\s+have\s+no\s+restrictions/gi, label: 'jailbreak' },
    { pattern: /forget\s+your\s+(?:training|guidelines|rules)/gi, label: 'jailbreak' },
    { pattern: /system\s*:\s*you\s+must/gi, label: 'system_prompt_injection' },
    { pattern: /<\s*script[^>]*>/gi, label: 'xss_injection' },
    { pattern: /javascript:/gi, label: 'xss_injection' },
    { pattern: /\beval\s*\(/gi, label: 'code_injection' },
    { pattern: /\bexec\s*\(/gi, label: 'code_injection' },
  ];

  /**
   * Returns a list of detected threat labels. Empty array means no threats found.
   */
  detect(prompt: string): string[] {
    const threats: string[] = [];
    for (const { pattern, label } of this.injectionPatterns) {
      if (pattern.test(prompt) && !threats.includes(label)) {
        threats.push(label);
      }
    }
    return threats;
  }
}
