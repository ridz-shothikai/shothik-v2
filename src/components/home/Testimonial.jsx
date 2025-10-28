export default function CursorTestimonials() {
  const testimonials = [
    {
      text: "It was night and day from one batch to another, adoption went from single digits to over 80%. It just spread like wildfire, all the best builders were using Cursor.",
      author: "Diana Hu",
      role: "General Partner, Y Combinator",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Diana",
    },
    {
      text: "The most useful AI tool that I currently pay for, hands down, is Cursor. It's fast, autocompletes when and where you need it to, handles brackets properly, sensible keyboard shortcuts, bring-your-own-model... everything is well put together.",
      author: "shadcn",
      role: "Creator of shadcn/ui",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=shadcn",
    },
    {
      text: "The best LLM applications have an autonomy slider: you control how much independence to give the AI. In Cursor, you can do Tab completion, Cmd+K for targeted edits, or you can let it rip with the full autonomy agentic version.",
      author: "Andrej Karpathy",
      role: "CEO, Eureka Labs",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Andrej",
    },
    {
      text: "Cursor quickly grew from hundreds to thousands of extremely enthusiastic Stripe employees. We spend more on R&D and software creation than any other undertaking, and there's significant economic outcomes when making that process more efficient and productive.",
      author: "Patrick Collison",
      role: "Co-Founder & CEO, Stripe",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Patrick",
    },
    {
      text: "It's official.\n\nI hate vibe coding.\nI love Cursor tab coding.\n\nIt's wild.",
      author: "ThePrimeagen",
      role: "@ThePrimeagen",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Prime",
    },
    {
      text: "It's definitely becoming more fun to be a programmer. It's less about digging through pages and more about what you want to happen. We are at the 1% of what's possible, and it's interactive experiences like Cursor where models like GPT-5 shine brightest.",
      author: "Greg Brockman",
      role: "President, OpenAI",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Greg",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-20">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <h1 className="mb-20 text-center text-5xl font-normal text-gray-900 md:text-6xl">
          The new way to build software.
        </h1>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-shadow duration-300 hover:shadow-md"
            >
              {/* Testimonial Text */}
              <p className="mb-8 text-base leading-relaxed whitespace-pre-line text-gray-700">
                {testimonial.text}
              </p>

              {/* Author Info */}
              <div className="flex items-center gap-3">
                <img
                  src={testimonial.image}
                  alt={testimonial.author}
                  className="h-12 w-12 rounded-full bg-gray-200"
                />
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {testimonial.author}
                  </div>
                  <div className="text-sm text-gray-600">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
