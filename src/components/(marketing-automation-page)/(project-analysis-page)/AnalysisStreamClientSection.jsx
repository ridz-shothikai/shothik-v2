"use client";

import DotIndicator from "@/components/ui/DotIndicator";
import { Button } from "@mui/material";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const image = "/images/marketing-automation/demo-product.png";

const analysis = [
  {
    title: "Identifying Product / Brand Info",
    content: `
      <div>
        <div>
          <strong>Brand Name:</strong> Example Watch Brand
        </div>
        <br>
        <div>
          <strong>Product:</strong> Classic Chronograph Wristwatch
        </div>
        <br>
        <div>
          <strong>Key Specs:</strong>
          <ul>
            <li>Stainless Steel Case, 42 Mm Diameter</li>
            <li>Automatic Movement, Sapphire Crystal Glass</li>
            <li>Water Resistance: 100 M</li>
            <li>Leather Strap Or Stainless Bracelet Options</li>
          </ul>
        </div>
        <br>
        <div>
          <strong>Target Audience:</strong> Men & Women Who Appreciate Classic Luxury With Sporty Chronograph Features
        </div>
      </div>
    `,
  },
  {
    title: "Extracted Key Themes & Selling Points",
    content: `
      <div>
        <div>
          <strong>"Precision & Craftsmanship":</strong> Emphasis On Watchmaking Quality, Automatic Movement, Durable Materials
        </div>
        <br>
        <div>
          <strong>"Versatile Style":</strong> Leather Or Metal Strap Design That Works Formal And Casual
        </div>
        <br>
        <div>
          <strong>"Heritage Appeal":</strong> Classic Design With Vintage Chronograph Looks
        </div>
        <br>
        <div>
          <strong>"Reliability & Durability":</strong> Water Resistance, Robust Case, Scratch-Resistant Crystal
        </div>
      </div>
    `,
  },
  {
    title: "Keyword & Positioning Insights",
    content: `
      <div>
        <div>
          <strong>Strong Keywords To Target:</strong>
          <br>
          Chronograph Watch, Automatic Chronograph, Stainless Steel Watch, Classic Watch, Luxury Sport Watch
        </div>
                        <br>
        <div>
          <strong>Possible Unique Selling Propositions (USPs):</strong>
          <ol>
            <li>Classic Looks + Modern Engineering</li>
            <li>High Water-Resistance And Durability For Daily Wear</li>
            <li>Versatility In Strap Options</li>
            <li>Heritage Design, Perhaps "Inspired By Vintage"</li>
          </ol>
        </div>
      </div>
    `,
  },
  {
    title: "Competitor Benchmarking (Simulated)",
    content: `
      <div>
        <div>
          <strong>Direct Competitors:</strong> Other Mid-Luxury Chronograph Watch Brands (E.g. Tissot, Seiko Prospex Chronographs, Citizen, Or Smaller Boutique Chronograph Makers)
        </div>
        <br>
        <div>
          <strong>What They Do Well:</strong>
          <ul>
            <li>Clear Hero Images + Watch At Multiple Angles (Front, Side, Back)</li>
            <li>Lifestyle Photography (Watch Worn, Ambient Context)</li>
            <li>Strong Specification Table With Visuals (Icons For Water Resistance, Movement Type Etc.)</li>
            <li>Customer Reviews & Trust Badges</li>
          </ul>
        </div>
        <br>
        <div>
          <strong>Gaps / Areas To Differentiate:</strong>
          <ul>
            <li>More Video Content Showing Movement Of Chronograph Functions</li>
            <li>Behind-The-Scene Content Showing Design / Craftsmanship Process</li>
            <li>More Comparison Tables: Example Vs Competitor Specs Side-By-Side</li>
          </ul>
        </div>
      </div>
    `,
  },
];

const AnalysisStreamClientSection = ({ project }) => {
  const [isProcessing, setIsProcessing] = useState(true);
  const [progress, setProgress] = useState(0);
  const [visibleSections, setVisibleSections] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);

  useEffect(() => {
    // Simulate processing with progress updates
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsProcessing(false);
          setShowCompletion(true);
          return 100;
        }
        return prev + 1;
      });
    }, 50);

    // Simulate section reveal with delays
    const sectionInterval = setInterval(() => {
      setVisibleSections((prev) => {
        if (prev >= analysis.length) {
          clearInterval(sectionInterval);
          return analysis.length;
        }
        return prev + 1;
      });
    }, 1000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(sectionInterval);
    };
  }, []);

  return (
    <div>
      <div className="space-y-6 md:space-y-10">
        <h4 className="font-semibold">Processing the URL</h4>
        <div className="space-y-4">
          <div className="bg-primary/15 size-fit p-4">
            <Image
              src={image}
              alt="Demo Product"
              className="h-80 w-full max-w-96 rounded object-contain"
              width={450}
              height={400}
            />
          </div>
        </div>

        {analysis.map((section, index) => (
          <div
            key={index}
            className={`space-y-4 transition-all duration-500 ease-in-out ${
              index < visibleSections
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            }`}
            style={{
              display: index < visibleSections ? "block" : "none",
            }}
          >
            <div className="flex items-baseline gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full shadow">
                <Image
                  src={"/images/marketing-automation/shothik-icon.png"}
                  width={24}
                  height={24}
                  alt={"arrow"}
                />
              </div>
              <h4 className="font-semibold">{section.title}</h4>
            </div>
            <div className="prose max-w-none rounded-xl p-4 shadow lg:p-6 [&_ol]:list-inside [&_ul]:list-inside">
              <div dangerouslySetInnerHTML={{ __html: section?.content }} />
            </div>
          </div>
        ))}

        {/* Loading State */}
        {isProcessing && (
          <div className="mx-auto max-w-2xl space-y-6">
            <div className="text-center">
              <DotIndicator />
            </div>

            <div className="space-y-2 text-center">
              <div className="text-center">{progress}% to complete</div>
              <div className="flex items-center gap-4">
                <div className="bg-muted h-2 flex-1 overflow-hidden rounded-full">
                  <div
                    className="bg-primary h-full rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Completion State */}
        {showCompletion && (
          <div className="animate-in fade-in mx-auto max-w-2xl space-y-6 duration-500">
            <div className="space-y-2 text-center">
              <div className="text-center">{progress}% completed!</div>
              <div className="flex items-center gap-4">
                <div className="bg-muted h-2 flex-1 overflow-hidden rounded-full">
                  <div
                    className="bg-primary h-full rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <Link
                href={`/marketing-automation/projects/${project.id}/controller`}
              >
                <Button size="large" variant="contained">
                  <span>Next Step</span>
                  <ArrowRight />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisStreamClientSection;
