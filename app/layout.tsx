import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AgentOS — WASM Swarm Agent Operating System',
  description:
    'A production-grade WASM-powered multi-agent system that optimizes prompts autonomously, ' +
    'executes across multiple AI models, and scores best outputs.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-bg-dark text-white antialiased">{children}</body>
    </html>
  );
}
