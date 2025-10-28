export default function Trusted() {
  const companies = [
    { name: "stripe", style: "font-bold text-3xl" },
    { name: "OpenAI", style: "font-semibold text-3xl" },
    { name: "Linear", style: "font-medium text-2xl", hasIcon: true },
    {
      name: "DATADOG",
      style: "font-bold text-xl tracking-wide",
      hasIcon: true,
    },
    {
      name: "RIPPLING",
      style: "font-bold text-xl tracking-wider",
      hasIcon: true,
    },
    { name: "Figma", style: "font-semibold text-3xl" },
    { name: "ramp", style: "font-medium text-3xl", hasIcon: true },
    { name: "Adobe", style: "font-bold text-3xl" },
  ];

  return (
    <div className="w-full bg-white px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-16 text-center text-lg font-[700] text-gray-600">
          Trusted by
        </h2>

        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8">
          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              className="min-h-[140px] rounded-xl bg-gray-50 transition-colors hover:bg-gray-100"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
