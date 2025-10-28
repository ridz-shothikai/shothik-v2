
import FeatureShowcase from "./components/FeatureShowcase";

export default function FeaturesPage() {
  return (
    <div className="bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <section className="relative text-center py-24 px-4 bg-gradient-to-b from-gray-50 to-gray-100 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/pattern.svg')] opacity-5"></div>
        <div className="relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-zinc-800">A new era of writing</h1>
          <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">Shothik is more than just a tool. It's a partner that helps you write better, faster, and with more creativity.</p>
          <div className="mt-8 flex justify-center gap-4">
            <button className="px-6 py-3 bg-shothik-green text-white font-semibold rounded-lg shadow-md hover:bg-shothik-green/90 transition-colors">Get Started</button>
            <button className="px-6 py-3 bg-white text-gray-700 font-semibold rounded-lg border border-gray-300 shadow-sm hover:bg-gray-50 transition-colors">See Pricing</button>
          </div>
        </div>
      </section>

      {/* Sub-navigation placeholder */}
      <nav className="sticky top-[64px] bg-white/80 backdrop-blur-sm z-20 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center gap-8 py-4">
            <a href="#" className="text-gray-600 hover:text-shothik-green font-semibold">Core Features</a>
            <a href="#" className="text-gray-600 hover:text-shothik-green font-semibold">Integrations</a>
            <a href="#" className="text-gray-600 hover:text-shothik-green font-semibold">Customization</a>
          </div>
        </div>
      </nav>


      {/* Features Showcase */}
      <main>
        <FeatureShowcase 
          direction="right"
          title="AI-Powered Agent"
          description="Delegate tasks to our intelligent agent. From research to writing, let our AI handle the heavy lifting while you focus on what matters."
        />
        <FeatureShowcase 
          direction="left"
          title="Codebase Understanding"
          description="Shothik can understand your entire codebase, providing context-aware suggestions and generating code that fits your style."
        />
        <FeatureShowcase 
          direction="right"
          title="Smart Rewrites & Edits"
          description="Instantly rewrite or edit multiple lines of text. Improve clarity, tone, and style with a single click."
        />
        <FeatureShowcase 
          direction="left"
          title="Customizable to Your Needs"
          description="Tailor Shothik to your workflow with custom rules, memories, and commands. Make it truly yours."
        />
      </main>
    </div>
  );
}
