import { useEffect, useRef, useState } from "react";

const X = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const CheckCircle = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const Loader2 = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="animate-spin"
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
  </svg>
);

const Image = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="3" y="3" width="18" height="18" rx="2"></rect>
    <circle cx="8.5" cy="8.5" r="1.5"></circle>
    <path d="M21 15l-5-5L5 21"></path>
  </svg>
);

const FileText = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

const Download = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

const Shield = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>
);

const DeepResearchAgent = () => {
  const [position, setPosition] = useState({ x: 100, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const windowRef = useRef(null);

  const [agentStage, setAgentStage] = useState(0);
  const [showModal, setShowModal] = useState(true);
  const [researchTopic, setResearchTopic] = useState("");
  const [foundImages, setFoundImages] = useState([]);

  const stages = [
    {
      title: "Processing Research Request",
      description:
        "Analyzing your investigation query and breaking it into research steps",
      icon: "🔎",
      progress: 15,
      details: "Identifying key topics, search terms, and research angles...",
    },
    {
      title: "Executing Multi-Step Searches",
      description:
        "Running comprehensive searches across multiple databases and sources",
      icon: "🌐",
      progress: 35,
      details: "Searching academic papers, articles, databases, archives...",
    },
    {
      title: "Finding & Curating Images",
      description: "Locating relevant images, diagrams, and visual evidence",
      icon: "🖼️",
      progress: 50,
      details: "Sourcing visual assets, infographics, charts, photographs...",
    },
    {
      title: "Validating Information",
      description: "Cross-referencing sources and verifying factual accuracy",
      icon: "✓",
      progress: 75,
      details:
        "Checking sources, identifying contradictions, verifying claims...",
    },
    {
      title: "Compiling Report",
      description:
        "Organizing findings into a professional, comprehensive report",
      icon: "📄",
      progress: 100,
      details:
        "Structuring content, adding citations, formatting presentation...",
    },
  ];

  const exampleTopics = [
    "Research the history and impact of renewable energy",
    "Deep dive into AI adoption trends in healthcare",
    "Investigate climate change solutions and effectiveness",
  ];

  const sampleImages = [
    { id: 1, title: "Research visualization", size: "2.4 MB" },
    { id: 2, title: "Data chart", size: "1.8 MB" },
    { id: 3, title: "Key findings", size: "3.1 MB" },
    { id: 4, title: "Timeline diagram", size: "1.5 MB" },
  ];

  const handleMouseDown = (e) => {
    if (e.target.closest(".no-drag")) return;
    if (!e.target.closest(".drag-handle")) return;

    e.preventDefault();
    setIsDragging(true);

    const rect = windowRef.current.getBoundingClientRect();
    setDragStart({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      e.preventDefault();

      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;

      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.userSelect = "none";
      document.body.style.cursor = "grabbing";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };
  }, [isDragging, dragStart]);

  useEffect(() => {
    if (agentStage < 5) {
      const timer = setTimeout(() => {
        if (agentStage === 2) {
          setFoundImages(sampleImages);
        }
        setAgentStage(agentStage + 1);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [agentStage]);

  const handleStartResearch = () => {
    if (researchTopic.trim()) {
      setAgentStage(0);
      setFoundImages([]);
    }
  };

  if (!showModal) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <button
          onClick={() => setShowModal(true)}
          className="rounded-lg bg-indigo-600 px-6 py-3 text-white shadow-lg transition-all hover:bg-indigo-700"
        >
          Open Deep Research Agent
        </button>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="absolute inset-0 overflow-hidden opacity-5">
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-indigo-600"></div>
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-indigo-600"></div>
      </div>

      <div
        ref={windowRef}
        className="absolute z-10 flex overflow-hidden rounded-xl bg-white shadow-2xl"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: "1200px",
          maxWidth: "calc(100vw - 40px)",
        }}
      >
        {/* Left sidebar - Process overview */}
        <div className="w-80 border-r border-gray-200 bg-gradient-to-b from-gray-50 to-gray-100">
          <div
            className="drag-handle cursor-grab border-b border-gray-200 bg-white px-4 py-3 active:cursor-grabbing"
            onMouseDown={handleMouseDown}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="flex h-3 w-3 items-center justify-center rounded-full bg-red-500"></div>
                <div className="flex h-3 w-3 items-center justify-center rounded-full bg-yellow-500"></div>
                <div className="flex h-3 w-3 items-center justify-center rounded-full bg-green-500"></div>
              </div>
              <span className="text-sm font-semibold text-gray-700">
                Deep Research Agent
              </span>
              <button className="no-drag text-sm text-gray-500 hover:text-gray-700">
                ?
              </button>
            </div>
          </div>

          <div className="h-[650px] space-y-3 overflow-y-auto p-4">
            <h3 className="mb-4 text-xs font-bold tracking-widest text-gray-600 uppercase">
              Research Pipeline
            </h3>

            {stages.map((stage, index) => (
              <div
                key={index}
                className={`rounded-lg p-3 transition-all ${
                  index <= agentStage
                    ? "border border-indigo-200 bg-white shadow-md"
                    : "bg-gray-50 opacity-60"
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="mt-0.5 text-xl">{stage.icon}</div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-900">
                      {index < agentStage && (
                        <CheckCircle className="mr-2 inline" />
                      )}
                      {index === agentStage && (
                        <Loader2 className="mr-2 inline" />
                      )}
                      {stage.title}
                    </p>
                    <p className="mt-1 text-xs text-gray-600">
                      {stage.description}
                    </p>
                    {index <= agentStage && (
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-200">
                        <div
                          className="h-full rounded-full bg-indigo-600 transition-all duration-1000"
                          style={{
                            width: `${index < agentStage ? 100 : stage.progress}%`,
                          }}
                        ></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {agentStage === 5 && (
              <div className="mt-6 rounded-lg border border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
                <div className="flex items-start space-x-3">
                  <FileText className="mt-0.5 h-5 w-5 flex-shrink-0 text-indigo-600" />
                  <div>
                    <p className="text-sm font-semibold text-indigo-900">
                      Research Report Ready!
                    </p>
                    <p className="mt-1 text-xs text-indigo-700">
                      Your comprehensive report with validated findings and
                      visual assets is complete.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right side - Main content */}
        <div className="flex flex-1 flex-col">
          {/* Header */}
          <div
            className="drag-handle flex cursor-grab items-center justify-between border-b border-gray-200 bg-white px-6 py-4 active:cursor-grabbing"
            onMouseDown={handleMouseDown}
          >
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Deep Research & Analysis
              </h2>
              <p className="mt-1 text-xs text-gray-600">
                From investigation to professional report automatically
              </p>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="no-drag rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            >
              <X />
            </button>
          </div>

          {/* Content area */}
          <div className="flex-1 overflow-y-auto bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-8">
            {agentStage < 5 ? (
              <div className="max-w-2xl space-y-6">
                {/* Stage visualization */}
                <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-lg">
                  <div className="text-center">
                    <div className="mb-4 text-6xl">
                      {stages[agentStage].icon}
                    </div>
                    <h3 className="mb-2 text-2xl font-bold text-gray-900">
                      {stages[agentStage].title}
                    </h3>
                    <p className="mb-6 text-gray-600">
                      {stages[agentStage].description}
                    </p>

                    {/* Progress bar */}
                    <div className="space-y-4">
                      <div className="mb-2 flex justify-between text-xs text-gray-600">
                        <span>Researching</span>
                        <span>{Math.round(stages[agentStage].progress)}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-1000"
                          style={{ width: `${stages[agentStage].progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Current action details */}
                    <div className="mt-8 rounded-lg border border-indigo-200 bg-indigo-50 p-4">
                      <p className="text-sm text-indigo-900">
                        <Loader2 className="mr-2 inline" />
                        {stages[agentStage].details}
                      </p>
                    </div>

                    {/* Found images (for stage 2) */}
                    {agentStage >= 2 && foundImages.length > 0 && (
                      <div className="mt-6 text-left">
                        <h4 className="mb-3 flex items-center space-x-2 text-sm font-semibold text-gray-900">
                          <Image className="h-4 w-4" />
                          <span>Images & Assets Found</span>
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                          {foundImages.map((img, idx) => (
                            <div
                              key={idx}
                              className="flex items-center space-x-2 rounded border border-gray-200 bg-gray-50 p-3"
                            >
                              <Image className="h-4 w-4 flex-shrink-0 text-indigo-600" />
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-xs font-medium text-gray-900">
                                  {img.title}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {img.size}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Your research topic display */}
                {researchTopic && (
                  <div className="rounded-lg border border-gray-200 bg-white p-4">
                    <p className="mb-2 text-xs font-semibold text-gray-600 uppercase">
                      Research Topic
                    </p>
                    <p className="text-gray-800">{researchTopic}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="max-w-3xl space-y-6">
                {/* Report preview */}
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
                    <div className="mb-4 flex items-center space-x-3">
                      <FileText className="h-8 w-8" />
                      <div>
                        <h3 className="text-2xl font-bold">Research Report</h3>
                        <p className="text-sm text-indigo-100">
                          Comprehensive findings & analysis
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Report content preview */}
                  <div className="space-y-6 p-8">
                    {/* Summary section */}
                    <div>
                      <h4 className="mb-3 text-lg font-bold text-gray-900">
                        Executive Summary
                      </h4>
                      <p className="text-sm leading-relaxed text-gray-700">
                        This comprehensive research report provides validated
                        findings across multiple sources. The investigation
                        identified 47 peer-reviewed sources, 23 industry
                        reports, and 156 data points across the topic. All
                        findings have been cross-referenced and verified for
                        accuracy.
                      </p>
                    </div>

                    {/* Key findings */}
                    <div>
                      <h4 className="mb-3 text-lg font-bold text-gray-900">
                        Key Findings
                      </h4>
                      <ul className="space-y-2">
                        {[
                          "Finding 1: Primary research insight with supporting evidence",
                          "Finding 2: Secondary analysis with cross-referenced data",
                          "Finding 3: Comparative analysis across multiple sources",
                          "Finding 4: Validated conclusions with citation support",
                        ].map((finding, idx) => (
                          <li
                            key={idx}
                            className="flex items-start space-x-3 text-sm text-gray-700"
                          >
                            <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                            <span>{finding}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Media assets */}
                    <div>
                      <h4 className="mb-3 flex items-center space-x-2 text-lg font-bold text-gray-900">
                        <Image className="h-5 w-5" />
                        <span>Included Media Assets</span>
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className="flex aspect-video items-center justify-center rounded border border-gray-200 bg-gradient-to-br from-indigo-100 to-purple-100"
                          >
                            <span className="font-medium text-gray-600">
                              Asset {i}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Validation badge */}
                    <div className="flex items-start space-x-3 rounded-lg border border-green-200 bg-green-50 p-4">
                      <Shield className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                      <div>
                        <p className="text-sm font-semibold text-green-900">
                          Information Validated
                        </p>
                        <p className="mt-1 text-xs text-green-700">
                          All findings cross-referenced across 47 sources with
                          98% consistency verified
                        </p>
                      </div>
                    </div>

                    {/* Report stats */}
                    <div className="grid grid-cols-4 gap-3 rounded border border-gray-200 bg-gray-50 p-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-indigo-600">47</p>
                        <p className="text-xs text-gray-600">Sources</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-indigo-600">
                          156
                        </p>
                        <p className="text-xs text-gray-600">Data Points</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-indigo-600">12</p>
                        <p className="text-xs text-gray-600">Visuals</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-indigo-600">
                          98%
                        </p>
                        <p className="text-xs text-gray-600">Verified</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex justify-center gap-3">
                  <button className="flex items-center space-x-2 rounded-lg bg-indigo-600 px-6 py-2 font-medium text-white transition-colors hover:bg-indigo-700">
                    <Download className="h-4 w-4" />
                    <span>Download Report</span>
                  </button>
                  <button className="rounded-lg border border-indigo-600 bg-white px-6 py-2 font-medium text-indigo-600 transition-colors hover:bg-indigo-50">
                    Research Another Topic
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer input area */}
          <div className="no-drag space-y-3 border-t border-gray-200 bg-white p-4">
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={researchTopic}
                  onChange={(e) => setResearchTopic(e.target.value)}
                  placeholder="What would you like to research?"
                  className="focus:ring-opacity-20 flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                  onKeyPress={(e) => e.key === "Enter" && handleStartResearch()}
                />
                <button
                  onClick={handleStartResearch}
                  disabled={!researchTopic.trim()}
                  className="rounded-lg bg-indigo-600 px-6 py-2 font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Research
                </button>
              </div>

              {researchTopic === "" && (
                <div className="px-4 text-xs text-gray-600">
                  <p className="mb-2 font-semibold">Try these examples:</p>
                  <div className="flex flex-wrap gap-2">
                    {exampleTopics.map((topic) => (
                      <button
                        key={topic}
                        onClick={() => setResearchTopic(topic)}
                        className="rounded bg-gray-100 px-3 py-1 text-left text-xs text-gray-700 transition-colors hover:bg-gray-200"
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Left side promotional content */}
      <div className="absolute top-1/2 left-12 max-w-sm -translate-y-1/2">
        <h1 className="mb-4 text-5xl font-bold text-gray-800">
          Deep research made effortless
        </h1>
        <p className="mb-6 text-xl text-gray-600">
          Tell us what to investigate. Our agent executes multi-step searches,
          finds relevant images, validates information, and delivers a
          professional report automatically.
        </p>
        <button className="flex items-center space-x-2 text-lg font-semibold text-indigo-600 transition-colors hover:text-indigo-700">
          <span>Learn more</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
};

export default DeepResearchAgent;
