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
    // Redact entire <script>…</script> blocks (including content and closing tag).
    // The non-greedy [\s\S]*? ensures nested-like patterns don't over-consume.
    // Both the opening and closing tag patterns use [^>]* so unusual whitespace/
    // attributes in the tag (e.g. </script  bar>) are also matched.
    /<\s*script[^>]*>[\s\S]*?<\s*\/\s*script[^>]*>/gi,
    // Also redact any lone opening or closing script tag left over
    /<\s*\/?\s*script[^>]*>/gi,
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
