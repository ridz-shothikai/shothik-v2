import React from "react";
import { TrendingUp, Zap, Target, BarChart3 } from "lucide-react";

export default function ROISection() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 px-4 py-20">
      <div className="mx-auto max-w-7xl">
        {/* Main Grid */}
        <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Launch Ads Faster - Large Purple Card */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500 to-purple-600 p-8 text-white shadow-2xl lg:p-10">
            <div className="relative z-10">
              <div className="mb-6 flex items-center gap-2">
                <Zap className="h-6 w-6" />
                <h3 className="text-2xl font-bold">Launch Ads Faster</h3>
              </div>

              <p className="mb-8 max-w-xs text-lg text-purple-100">
                Automated ad setup that takes you from concept to campaign in
                minutes.
              </p>

              <button className="mb-8 flex items-center gap-2 rounded-full bg-white px-8 py-3 font-semibold text-purple-600 transition-all hover:bg-purple-50">
                Start Free Trial
                <span className="text-2xl">→</span>
              </button>

              <div className="text-8xl font-black lg:text-9xl">30X</div>
            </div>

            {/* Floating Metric Card */}
            <div className="absolute right-8 bottom-8 rounded-2xl bg-white p-4 shadow-lg">
              <div className="text-3xl font-bold text-gray-900">4.32%</div>
              <div className="text-sm text-gray-500">CTR</div>
              <div className="mt-1 flex items-center gap-1 text-sm font-semibold text-green-500">
                <TrendingUp className="h-4 w-4" />
                +23.15
              </div>
            </div>
          </div>

          {/* Evergreen Ads - Light Card */}
          <div className="relative overflow-hidden rounded-3xl bg-white p-8 shadow-xl lg:p-10">
            <div className="relative z-10">
              <h3 className="mb-6 text-2xl font-bold text-gray-900">
                Evergreen Ads
              </h3>

              <p className="mb-8 max-w-sm text-gray-600">
                Set it once for a full year of high-performing ads, no manual
                work required.
              </p>
            </div>

            <div className="absolute right-8 bottom-8">
              <div className="text-7xl font-black text-purple-600 lg:text-8xl">
                365
              </div>
              <div className="-mt-2 text-5xl font-black text-purple-600 lg:text-6xl">
                Days
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Slash Your Ad Spend */}
          <div className="rounded-3xl bg-white p-8 shadow-xl lg:p-10">
            <div className="mb-6 flex items-center gap-2">
              <Target className="h-6 w-6 text-purple-600" />
              <h3 className="text-2xl font-bold text-gray-900">
                Slash Your Ad Spend
              </h3>
            </div>

            <div className="flex items-end justify-between">
              <div className="text-7xl font-black text-purple-600 lg:text-8xl">
                6x
              </div>

              <div className="max-w-xs pb-2 text-gray-600">
                <p>
                  Eliminate wasted spend with precision targeting that finds
                  your most profitable customers.
                </p>
              </div>
            </div>
          </div>

          {/* Achieve Explosive ROAS */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-50 to-purple-50 p-8 shadow-xl lg:p-10">
            <div className="mb-6 flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-purple-600" />
              <h3 className="text-2xl font-bold text-gray-900">
                Achieve Explosive ROAS
              </h3>
            </div>

            {/* Floating Metric */}
            <div className="absolute top-8 right-8 rounded-2xl bg-white p-3 shadow-lg">
              <div className="text-xs text-gray-500">CPC</div>
              <div className="text-2xl font-bold text-gray-900">$2.95</div>
              <div className="flex items-center gap-1 text-xs font-semibold text-red-500">
                <TrendingUp className="h-3 w-3 rotate-180" />
                -12.26
              </div>
            </div>

            <div className="mt-8 flex items-end justify-between">
              <div className="max-w-xs pb-2 text-gray-600">
                <p>
                  24/7 optimization that continuously works to maximize your ad
                  profits.
                </p>
              </div>

              <div className="text-6xl font-black text-purple-600 lg:text-7xl">
                10.8X
              </div>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-12 flex justify-center">
          <button className="rounded-full bg-gradient-to-r from-purple-500 to-purple-600 px-12 py-4 text-lg font-bold text-white transition-all hover:scale-105 hover:shadow-2xl">
            Start Free Trial
          </button>
        </div>
      </div>
    </div>
  );
}
