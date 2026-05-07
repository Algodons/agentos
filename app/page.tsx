import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="grid-overlay min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <div className="max-w-4xl">
        {/* Logo / wordmark */}
        <h1 className="text-6xl md:text-8xl font-black mb-4 bg-gradient-to-r from-[#00F0FF] via-[#8A2EFF] to-[#00FF9C] bg-clip-text text-transparent">
          AgentOS
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-2 font-light tracking-wide">
          Agent Operating System
        </p>
        <p className="text-gray-500 mb-10 max-w-2xl mx-auto">
          Deploy AI Agents That Work &amp; Earn For You. Build, optimize, and run autonomous
          pipelines with real-time scoring + multi-model execution.
        </p>

        {/* Live metrics bar */}
        <div className="glass rounded-2xl p-5 grid grid-cols-3 gap-4 mb-10 max-w-xl mx-auto">
          <Metric label="Agents Running" value="12" color="#00F0FF" />
          <Metric label="Avg Score" value="0.94" color="#00FF9C" />
          <Metric label="Models" value="4" color="#8A2EFF" />
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/dashboard"
            className="px-8 py-3 rounded-xl font-semibold text-black bg-[#00F0FF] hover:bg-[#00F0FF]/90 transition glow-blue"
          >
            Launch Dashboard
          </Link>
          <Link
            href="/dashboard"
            className="px-8 py-3 rounded-xl font-semibold border border-[#8A2EFF]/60 text-[#8A2EFF] hover:bg-[#8A2EFF]/10 transition"
          >
            Explore Marketplace
          </Link>
        </div>

        {/* How it works */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Build', 'Optimize', 'Deploy', 'Earn'].map((step, i) => (
            <div key={step} className="glass rounded-xl p-4">
              <div className="text-3xl font-black text-[#00F0FF] opacity-40 mb-1">{i + 1}</div>
              <div className="font-semibold text-white">{step}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

function Metric({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="text-center">
      <div className="text-2xl font-black" style={{ color }}>
        {value}
      </div>
      <div className="text-xs text-gray-500 mt-1">{label}</div>
    </div>
  );
}
