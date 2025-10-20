"use client";

import {
  selectPresentation,
  setCurrentSlideId,
} from "@/redux/slice/presentationSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetSlideDataByStream } from "../../hooks/useGetSlideDataByStream";

export default function PresentationAgentPageV2({ presentationId }) {
  const dispatch = useDispatch();
  const presentationState = useSelector(selectPresentation);

  console.log(presentationState, "SLIDE DAATA ON REDUX");

  const config = {
    baseUrl: "https://03dbbfed1354.ngrok-free.app", // "https://17b9c083b988.ngrok-free.app",
    statusCheckInterval: 15000, // Check status every 15 seconds
    reconnectAttempts: 5,
    reconnectDelay: 1000,
    heartbeatTimeout: 30000,
  };

  const presentation = useGetSlideDataByStream(config);

  useEffect(() => {
    if (presentationId) {
      dispatch(setCurrentSlideId({ presentationId }));
    }
  }, [presentationId, dispatch]);

  // Status badge component
  const StatusBadge = () => {
    const statusConfig = {
      idle: { color: "bg-gray-100 text-gray-800", label: "Idle" },
      checking: { color: "bg-blue-100 text-blue-800", label: "Checking..." },
      queued: { color: "bg-yellow-100 text-yellow-800", label: "Queued" },
      streaming: { color: "bg-green-100 text-green-800", label: "Streaming" },
      completed: { color: "bg-blue-100 text-blue-800", label: "Completed" },
      failed: { color: "bg-red-100 text-red-800", label: "Failed" },
      error: { color: "bg-red-100 text-red-800", label: "Error" },
    };

    const config = statusConfig[presentation.status] || statusConfig.idle;

    return (
      <span
        className={`rounded-full px-3 py-1 text-sm font-medium ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 rounded-lg bg-white p-6 shadow-lg">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">
              Presentation Agent Monitor
            </h1>
            <StatusBadge />
          </div>

          {/* Connection Info */}
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-gray-50 p-4">
              <div className="text-sm text-gray-600">Presentation ID</div>
              <div className="font-mono text-lg text-gray-900">
                {presentationId || "Not set"}
              </div>
            </div>
            <div className="rounded-lg bg-gray-50 p-4">
              <div className="text-sm text-gray-600">Backend Status</div>
              <div className="text-lg font-semibold text-gray-900 capitalize">
                {presentation.presentationStatus || "Unknown"}
              </div>
            </div>
          </div>

          {/* Error Display */}
          {presentation.hasError && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-red-800">Error</div>
                  <div className="text-sm text-red-600">
                    {presentation.error}
                  </div>
                </div>
                <button
                  onClick={presentation.retry}
                  className="rounded bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {/* Progress */}
          {presentation.progress && (
            <div className="mb-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  Generation Progress
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {presentation.progress.current} /{" "}
                  {presentation.progress.total}
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-blue-600 transition-all duration-300"
                  style={{
                    width: `${(presentation.progress.current / presentation.progress.total) * 100}%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-lg bg-blue-50 p-4">
              <div className="text-sm font-medium text-blue-600">
                Total Logs
              </div>
              <div className="text-2xl font-bold text-blue-900">
                {presentation.logs.length}
              </div>
            </div>
            <div className="rounded-lg bg-green-50 p-4">
              <div className="text-sm font-medium text-green-600">Slides</div>
              <div className="text-2xl font-bold text-green-900">
                {presentation.slides.length}
              </div>
            </div>
            <div className="rounded-lg bg-purple-50 p-4">
              <div className="text-sm font-medium text-purple-600">Status</div>
              <div className="text-lg font-bold text-purple-900">
                {presentation.isConnected && "🟢 Connected"}
                {presentation.isCompleted && "✅ Complete"}
                {presentation.isFailed && "❌ Failed"}
                {presentation.isQueued && "⏳ Queued"}
                {presentation.isChecking && "🔍 Checking"}
                {!presentation.isConnected &&
                  !presentation.isCompleted &&
                  !presentation.isFailed &&
                  !presentation.isQueued &&
                  !presentation.isChecking &&
                  "⚪ Idle"}
              </div>
            </div>
          </div>
        </div>

        {/* Activity Logs */}
        <div className="mb-6 rounded-lg bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-xl font-bold text-gray-900">
            Activity Logs
          </h2>
          <div className="max-h-96 space-y-2 overflow-y-auto">
            {presentation.logs.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                No logs yet. Waiting for activity...
              </div>
            ) : (
              presentation.logs.map((log, index) => (
                <div
                  key={`${log.timestamp}-${index}`}
                  className="rounded border border-gray-200 bg-gray-50 p-3 transition-colors hover:bg-gray-100"
                >
                  <div className="mb-1 flex items-start justify-between">
                    <span className="font-medium text-blue-600">
                      {log.role}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  {log.agent_name && (
                    <div className="mb-1 text-sm text-gray-600">
                      Agent:{" "}
                      <span className="font-medium">{log.agent_name}</span>
                    </div>
                  )}
                  {log.message && (
                    <div className="mt-2 text-sm text-gray-700">
                      {log.message}
                    </div>
                  )}
                  {log.parsed_output && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-sm text-blue-600 hover:text-blue-700">
                        View parsed output
                      </summary>
                      <pre className="mt-2 overflow-x-auto rounded bg-gray-100 p-2 text-xs">
                        {log.parsed_output}
                      </pre>
                    </details>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Generated Slides */}
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-xl font-bold text-gray-900">
            Generated Slides
          </h2>
          <div className="space-y-6">
            {presentation.slides.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                No slides generated yet. Waiting for generation...
              </div>
            ) : (
              presentation.slides.map((slide) => (
                <div
                  key={`${slide.slideNumber}-${slide.timestamp}`}
                  className="overflow-hidden rounded-lg border border-gray-200"
                >
                  <div className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-gray-900">
                        Slide {slide.slideNumber}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {new Date(slide.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {slide.thinking && (
                    <details className="border-b border-gray-200">
                      <summary className="cursor-pointer bg-yellow-50 p-4 transition-colors hover:bg-yellow-100">
                        <span className="text-sm font-medium text-yellow-800">
                          💭 Thinking Process
                        </span>
                      </summary>
                      <div className="bg-yellow-50 p-4">
                        <p className="text-sm whitespace-pre-wrap text-gray-700">
                          {slide.thinking}
                        </p>
                      </div>
                    </details>
                  )}

                  <div className="bg-gray-50 p-4">
                    <div className="rounded-lg bg-white p-2 shadow-inner">
                      <iframe
                        srcDoc={slide.html}
                        className="h-96 w-full rounded border-0"
                        title={`Slide ${slide.slideNumber}`}
                        sandbox="allow-scripts"
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
