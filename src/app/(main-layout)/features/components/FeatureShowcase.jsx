
export default function FeatureShowcase({ title, description, visual, direction = 'right' }) {
  const visualContent = (
    <div className="bg-gray-100 rounded-lg w-full h-96 flex items-center justify-center">
      <p className="text-gray-400">{visual || 'Visual placeholder'}</p>
    </div>
  );

  const textContent = (
    <div>
      <h2 className="text-4xl font-bold text-zinc-800 mb-4">{title}</h2>
      <p className="text-gray-600 text-lg">{description}</p>
    </div>
  );

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {direction === 'right' ? (
          <>
            {textContent}
            {visualContent}
          </>
        ) : (
          <>
            {visualContent}
            {textContent}
          </>
        )}
      </div>
    </section>
  );
}
