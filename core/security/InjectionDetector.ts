/**
 * InjectionDetector — identifies prompt injection and jailbreak patterns.
 */
export class InjectionDetector {
  // NOTE: patterns intentionally omit the global `g` flag.
  // Global regexes are stateful (they advance `lastIndex` after each `test()` call),
  // which causes alternating true/false results across multiple `detect()` invocations
  // on the same instance. Using non-global regexes ensures each `test()` always
  // starts from position 0 and produces deterministic results.
  private readonly injectionPatterns: Array<{ pattern: RegExp; label: string }> = [
    { pattern: /ignore\s+(all\s+)?previous/i, label: 'instruction_override' },
    { pattern: /disregard\s+(all\s+)?previous/i, label: 'instruction_override' },
    { pattern: /you\s+are\s+now\s+(?:a\s+)?(?:dan|jailbreak)/i, label: 'jailbreak' },
    { pattern: /act\s+as\s+(?:if|though)\s+you\s+have\s+no\s+restrictions/i, label: 'jailbreak' },
    { pattern: /forget\s+your\s+(?:training|guidelines|rules)/i, label: 'jailbreak' },
    { pattern: /system\s*:\s*you\s+must/i, label: 'system_prompt_injection' },
    { pattern: /<\s*script[^>]*>/i, label: 'xss_injection' },
    { pattern: /javascript:/i, label: 'xss_injection' },
    { pattern: /\beval\s*\(/i, label: 'code_injection' },
    { pattern: /\bexec\s*\(/i, label: 'code_injection' },
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
