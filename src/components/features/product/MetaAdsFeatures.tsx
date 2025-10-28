import { Box, Container, Typography, Button, Chip } from "@mui/material";
import { BarChart3, MessageSquare, Sparkles, Rocket, LayoutDashboard, Play, UserCircle2, Star, Smartphone, Layers, Package, Zap } from "lucide-react";
import { motion } from "framer-motion";
import MetaAutomationShowcase from "./showcases/MetaAutomationShowcase";
import Showcase4 from "../../home/Showcase5";

export default function MetaAdsFeatures() {
  const features = [
    {
      icon: <BarChart3 size={24} />,
      tag: "AI-Powered Analysis",
      title: "Product & Competitor Intelligence",
      description: "Paste any product link and watch our AI analyze your competitors, extract market insights, and generate detailed buyer personas. Get actionable data that informs every campaign decision.",
      accentColor: "#1877F2",
      mockupType: "analysis",
      reverse: false,
      showcase: <Showcase4 />,
    },
    {
      icon: <MessageSquare size={24} />,
      tag: "Conversational AI",
      title: "Meta Vibe Ad Creative Canvas",
      description: "Create and refine ads through natural conversation. Drop a YouTube link or blog post for inspiration, then chat with AI to transform your vision into high-converting ad copy and creatives instantly.",
      accentColor: "#1877F2",
      mockupType: "canvas",
      reverse: true,
    },
    {
      icon: <Sparkles size={24} />,
      tag: "Andromeda Algorithm",
      title: "AI Media Canvas",
      description: "Generate AI UGC, influencer content, and video shorts across any format. Create problem-solution flows, testimonials, product demos, and before-after content as images, videos, reels, or carousels—all AI-powered.",
      accentColor: "#1877F2",
      mockupType: "media",
      reverse: false,
    },
    {
      icon: <Rocket size={24} />,
      tag: "One-Click Deploy",
      title: "Campaign Launch & Live Optimization",
      description: "Launch complete Facebook campaigns with a single click. No manual setup, no guesswork. AI structures your campaigns, adsets, and targeting—you just review and launch.",
      accentColor: "#1877F2",
      mockupType: "launch",
      reverse: true,
    },
    {
      icon: <LayoutDashboard size={24} />,
      tag: "Intelligent Insights",
      title: "AI-Powered Project Dashboard",
      description: "Chat with your campaign reports, get instant insights, and receive one-click optimization suggestions. Our AI analyzes performance patterns and recommends improvements that actually move the needle.",
      accentColor: "#1877F2",
      mockupType: "dashboard",
      reverse: false,
    },
  ];

  const renderRealisticMockup = (type: string, accentColor: string) => {
    const mockups: Record<string, JSX.Element> = {
      analysis: (
        <Box
          className="mockup-container"
          sx={{
            position: 'relative',
            width: '100%',
            height: { xs: 350, md: 450 },
            borderRadius: 3,
            border: 1,
            borderColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(24, 119, 242, 0.2)' : 'rgba(24, 119, 242, 0.15)',
            bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(15, 20, 35, 0.95)' : 'rgba(255, 255, 255, 0.9)',
            overflow: 'hidden',
            boxShadow: (theme) => theme.palette.mode === 'dark' 
              ? `0 20px 60px rgba(24, 119, 242, 0.3)`
              : `0 20px 60px rgba(24, 119, 242, 0.15)`,
            backdropFilter: 'blur(20px)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {/* Header with Facebook Blue */}
          <Box sx={{ 
            px: 3, 
            py: 2, 
            borderBottom: 1, 
            borderColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(24, 119, 242, 0.15)' : 'rgba(24, 119, 242, 0.1)',
            background: (theme) => theme.palette.mode === 'dark'
              ? 'linear-gradient(90deg, rgba(24, 119, 242, 0.1) 0%, transparent 100%)'
              : 'linear-gradient(90deg, rgba(24, 119, 242, 0.05) 0%, transparent 100%)',
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: accentColor }} />
              <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                Product Analysis Dashboard
              </Typography>
            </Box>
          </Box>

          {/* Content */}
          <Box sx={{ p: 3 }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="caption" color="rgba(255, 255, 255, 0.5)" sx={{ mb: 1, display: 'block' }}>
                URL Analysis
              </Typography>
              <Box
                sx={{
                  p: 2,
                  bgcolor: 'rgba(0, 167, 111, 0.1)',
                  border: 1,
                  borderColor: accentColor + '40',
                  borderRadius: 1,
                }}
              >
                <Typography variant="body2" color={accentColor} fontFamily="monospace">
                  https://example.com/product
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 }}>
              <Box sx={{ p: 2, bgcolor: 'rgba(255, 255, 255, 0.05)', borderRadius: 1 }}>
                <Typography variant="caption" color="rgba(255, 255, 255, 0.5)">Market Position</Typography>
                <Typography variant="h6" color="white" sx={{ mt: 0.5 }}>Premium</Typography>
              </Box>
              <Box sx={{ p: 2, bgcolor: 'rgba(255, 255, 255, 0.05)', borderRadius: 1 }}>
                <Typography variant="caption" color="rgba(255, 255, 255, 0.5)">Competitors</Typography>
                <Typography variant="h6" color="white" sx={{ mt: 0.5 }}>12 Found</Typography>
              </Box>
            </Box>

            <Box sx={{ p: 2, bgcolor: 'rgba(255, 255, 255, 0.05)', borderRadius: 1 }}>
              <Typography variant="caption" color="rgba(255, 255, 255, 0.5)" sx={{ mb: 1, display: 'block' }}>
                AI-Generated Personas
              </Typography>
              {[1, 2, 3].map((i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: accentColor + '40' }} />
                  <Box sx={{ height: 12, bgcolor: 'rgba(255, 255, 255, 0.2)', borderRadius: 1, flex: 1 }} />
                </Box>
              ))}
            </Box>
          </Box>

          {/* Glass Morphism Overlay */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: (theme) => theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.02)'
                : 'rgba(255, 255, 255, 0.25)',
              backdropFilter: 'blur(8px) saturate(180%)',
              WebkitBackdropFilter: 'blur(8px) saturate(180%)',
              border: (theme) => theme.palette.mode === 'dark'
                ? '1px solid rgba(255, 255, 255, 0.08)'
                : '1px solid rgba(255, 255, 255, 0.3)',
              pointerEvents: 'none',
              borderRadius: 3,
            }}
          />

          {/* GIF Preview Indicator */}
          <Box
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 2,
              py: 1,
              bgcolor: 'rgba(0, 0, 0, 0.6)',
              borderRadius: 1,
              backdropFilter: 'blur(10px)',
              zIndex: 2,
            }}
          >
            <Play size={14} color={accentColor} />
            <Typography variant="caption" color={accentColor}>Live Demo</Typography>
          </Box>
        </Box>
      ),

      canvas: (
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: { xs: 350, md: 450 },
            borderRadius: 2,
            border: 1,
            borderColor: 'rgba(255, 255, 255, 0.1)',
            bgcolor: 'rgba(15, 20, 35, 0.8)',
            overflow: 'hidden',
            boxShadow: `0 20px 60px ${accentColor}20`,
          }}
        >
          {/* Header */}
          <Box sx={{ px: 3, py: 2, borderBottom: 1, borderColor: 'rgba(255, 255, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: accentColor }} />
              <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                Ad Creative Canvas
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              {[1, 2, 3].map((i) => (
                <Box key={i} sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'rgba(255, 255, 255, 0.3)' }} />
              ))}
            </Box>
          </Box>

          {/* Chat Interface */}
          <Box sx={{ p: 3, height: 'calc(100% - 100px)', overflow: 'hidden' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* User message */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Box sx={{ maxWidth: '70%', p: 2, bgcolor: accentColor + '20', border: 1, borderColor: accentColor + '40', borderRadius: 2 }}>
                  <Typography variant="body2" color="white">
                    Create ad copy for fitness app targeting millennials
                  </Typography>
                </Box>
              </Box>

              {/* AI response */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                <Box sx={{ maxWidth: '80%', p: 2, bgcolor: 'rgba(255, 255, 255, 0.05)', borderRadius: 2 }}>
                  <Typography variant="body2" color="rgba(255, 255, 255, 0.9)" sx={{ mb: 1 }}>
                    Here's your ad copy:
                  </Typography>
                  <Box sx={{ p: 1.5, bgcolor: 'rgba(0, 0, 0, 0.3)', borderRadius: 1 }}>
                    <Typography variant="caption" color="rgba(255, 255, 255, 0.7)" fontFamily="monospace">
                      "Transform Your Body in 30 Days..."
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Typing indicator */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: accentColor }} />
                <Typography variant="caption" color="rgba(255, 255, 255, 0.5)">AI is typing...</Typography>
              </Box>
            </Box>
          </Box>

          {/* Input bar */}
          <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, p: 2, borderTop: 1, borderColor: 'rgba(255, 255, 255, 0.1)', bgcolor: 'rgba(10, 15, 30, 0.9)' }}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Box sx={{ flex: 1, height: 36, bgcolor: 'rgba(255, 255, 255, 0.05)', borderRadius: 1, display: 'flex', alignItems: 'center', px: 2 }}>
                <Typography variant="body2" color="rgba(255, 255, 255, 0.4)">Type your message...</Typography>
              </Box>
              <Box sx={{ width: 36, height: 36, bgcolor: accentColor, borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Play size={16} color="white" />
              </Box>
            </Box>
          </Box>

          {/* Glass Morphism Overlay */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: (theme) => theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.02)'
                : 'rgba(255, 255, 255, 0.25)',
              backdropFilter: 'blur(8px) saturate(180%)',
              WebkitBackdropFilter: 'blur(8px) saturate(180%)',
              border: (theme) => theme.palette.mode === 'dark'
                ? '1px solid rgba(255, 255, 255, 0.08)'
                : '1px solid rgba(255, 255, 255, 0.3)',
              pointerEvents: 'none',
              borderRadius: 2,
            }}
          />

          {/* GIF Preview Indicator */}
          <Box
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 2,
              py: 1,
              bgcolor: 'rgba(0, 0, 0, 0.6)',
              borderRadius: 1,
              backdropFilter: 'blur(10px)',
              zIndex: 2,
            }}
          >
            <Play size={14} color={accentColor} />
            <Typography variant="caption" color={accentColor}>Live Demo</Typography>
          </Box>
        </Box>
      ),

      media: (
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: { xs: 350, md: 450 },
            borderRadius: 2,
            border: 1,
            borderColor: 'rgba(255, 255, 255, 0.1)',
            bgcolor: 'rgba(15, 20, 35, 0.8)',
            overflow: 'hidden',
            boxShadow: `0 20px 60px ${accentColor}20`,
          }}
        >
          {/* Header */}
          <Box sx={{ px: 3, py: 2, borderBottom: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: accentColor }} />
              <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                AI Media Canvas - Andromeda
              </Typography>
            </Box>
          </Box>

          {/* Grid of media types */}
          <Box sx={{ p: 3, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
            {[
              { label: 'AI UGC', icon: UserCircle2 },
              { label: 'AI Influencer', icon: Star },
              { label: 'AI Shorts', icon: Smartphone },
              { label: 'Carousel', icon: Layers },
              { label: 'Product Demo', icon: Package },
              { label: 'Before/After', icon: Zap },
            ].map((item, i) => (
              <Box
                key={i}
                sx={{
                  p: 2,
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  border: 1,
                  borderColor: i === 0 ? accentColor + '60' : 'rgba(255, 255, 255, 0.1)',
                  borderRadius: 1,
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    borderColor: accentColor + '60',
                    bgcolor: 'rgba(255, 255, 255, 0.08)',
                  },
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                  <item.icon size={28} color={accentColor} />
                </Box>
                <Typography variant="caption" color="rgba(255, 255, 255, 0.7)">{item.label}</Typography>
                {i === 0 && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      bgcolor: accentColor,
                    }}
                  />
                )}
              </Box>
            ))}
          </Box>

          {/* Format selector */}
          <Box sx={{ px: 3, pb: 3 }}>
            <Typography variant="caption" color="rgba(255, 255, 255, 0.5)" sx={{ mb: 1, display: 'block' }}>
              Output Format
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {['Image', 'Video', 'Reels', 'Carousel'].map((format, i) => (
                <Chip
                  key={format}
                  label={format}
                  size="small"
                  sx={{
                    bgcolor: i === 1 ? accentColor + '20' : 'rgba(255, 255, 255, 0.05)',
                    color: i === 1 ? accentColor : 'rgba(255, 255, 255, 0.7)',
                    borderColor: i === 1 ? accentColor : 'transparent',
                    border: 1,
                  }}
                />
              ))}
            </Box>
          </Box>

          {/* Glass Morphism Overlay */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: (theme) => theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.02)'
                : 'rgba(255, 255, 255, 0.25)',
              backdropFilter: 'blur(8px) saturate(180%)',
              WebkitBackdropFilter: 'blur(8px) saturate(180%)',
              border: (theme) => theme.palette.mode === 'dark'
                ? '1px solid rgba(255, 255, 255, 0.08)'
                : '1px solid rgba(255, 255, 255, 0.3)',
              pointerEvents: 'none',
              borderRadius: 2,
            }}
          />

          {/* GIF Preview Indicator */}
          <Box
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 2,
              py: 1,
              bgcolor: 'rgba(0, 0, 0, 0.6)',
              borderRadius: 1,
              backdropFilter: 'blur(10px)',
              zIndex: 2,
            }}
          >
            <Play size={14} color={accentColor} />
            <Typography variant="caption" color={accentColor}>Live Demo</Typography>
          </Box>
        </Box>
      ),

      launch: (
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: { xs: 350, md: 450 },
            borderRadius: 2,
            border: 1,
            borderColor: 'rgba(255, 255, 255, 0.1)',
            bgcolor: 'rgba(15, 20, 35, 0.8)',
            overflow: 'hidden',
            boxShadow: `0 20px 60px ${accentColor}20`,
          }}
        >
          {/* Header */}
          <Box sx={{ px: 3, py: 2, borderBottom: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: accentColor }} />
                <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                  Campaign Launch
                </Typography>
              </Box>
              <Chip label="Ready" size="small" sx={{ bgcolor: accentColor + '20', color: accentColor }} />
            </Box>
          </Box>

          {/* Campaign structure */}
          <Box sx={{ p: 3 }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="caption" color="rgba(255, 255, 255, 0.5)" sx={{ mb: 2, display: 'block' }}>
                Campaign Structure
              </Typography>
              
              {/* Campaign */}
              <Box sx={{ mb: 2, p: 2, bgcolor: 'rgba(255, 255, 255, 0.05)', borderRadius: 1, borderLeft: 3, borderColor: accentColor }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="white" fontWeight={600}>Summer Sale 2025</Typography>
                  <Box sx={{ width: 16, height: 16, borderRadius: 1, bgcolor: accentColor + '40', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography variant="caption" color={accentColor}>✓</Typography>
                  </Box>
                </Box>
                <Typography variant="caption" color="rgba(255, 255, 255, 0.5)">Campaign • Budget: $5000</Typography>
              </Box>

              {/* Ad Sets */}
              <Box sx={{ pl: 3, mb: 2 }}>
                {[1, 2, 3].map((i) => (
                  <Box key={i} sx={{ mb: 1, p: 1.5, bgcolor: 'rgba(255, 255, 255, 0.03)', borderRadius: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: accentColor }} />
                      <Typography variant="caption" color="rgba(255, 255, 255, 0.7)">Ad Set {i} - Audience Segment</Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Launch button */}
            <Box
              sx={{
                p: 3,
                bgcolor: accentColor + '15',
                border: 2,
                borderColor: accentColor + '40',
                borderRadius: 2,
                textAlign: 'center',
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: accentColor + '25',
                  borderColor: accentColor + '60',
                },
              }}
            >
              <Typography variant="h6" color={accentColor} fontWeight={700}>
                Launch to Facebook
              </Typography>
              <Typography variant="caption" color="rgba(255, 255, 255, 0.5)">
                One-click deployment
              </Typography>
            </Box>
          </Box>

          {/* Glass Morphism Overlay */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: (theme) => theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.02)'
                : 'rgba(255, 255, 255, 0.25)',
              backdropFilter: 'blur(8px) saturate(180%)',
              WebkitBackdropFilter: 'blur(8px) saturate(180%)',
              border: (theme) => theme.palette.mode === 'dark'
                ? '1px solid rgba(255, 255, 255, 0.08)'
                : '1px solid rgba(255, 255, 255, 0.3)',
              pointerEvents: 'none',
              borderRadius: 2,
            }}
          />

          {/* GIF Preview Indicator */}
          <Box
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 2,
              py: 1,
              bgcolor: 'rgba(0, 0, 0, 0.6)',
              borderRadius: 1,
              backdropFilter: 'blur(10px)',
              zIndex: 2,
            }}
          >
            <Play size={14} color={accentColor} />
            <Typography variant="caption" color={accentColor}>Live Demo</Typography>
          </Box>
        </Box>
      ),

      dashboard: (
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: { xs: 350, md: 450 },
            borderRadius: 2,
            border: 1,
            borderColor: 'rgba(255, 255, 255, 0.1)',
            bgcolor: 'rgba(15, 20, 35, 0.8)',
            overflow: 'hidden',
            boxShadow: `0 20px 60px ${accentColor}20`,
          }}
        >
          {/* Header */}
          <Box sx={{ px: 3, py: 2, borderBottom: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: accentColor }} />
              <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                Project Dashboard
              </Typography>
            </Box>
          </Box>

          {/* Metrics */}
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, mb: 3 }}>
              {[
                { label: 'ROI', value: '245%', trend: '+12%' },
                { label: 'CTR', value: '3.8%', trend: '+0.4%' },
                { label: 'Conversions', value: '1.2K', trend: '+156' },
              ].map((metric, i) => (
                <Box key={i} sx={{ p: 2, bgcolor: 'rgba(255, 255, 255, 0.05)', borderRadius: 1 }}>
                  <Typography variant="caption" color="rgba(255, 255, 255, 0.5)">{metric.label}</Typography>
                  <Typography variant="h5" color="white" sx={{ my: 0.5 }}>{metric.value}</Typography>
                  <Typography variant="caption" color={accentColor}>{metric.trend}</Typography>
                </Box>
              ))}
            </Box>

            {/* Chart placeholder */}
            <Box sx={{ height: 120, bgcolor: 'rgba(255, 255, 255, 0.03)', borderRadius: 1, p: 2, position: 'relative', overflow: 'hidden' }}>
              <Typography variant="caption" color="rgba(255, 255, 255, 0.5)" sx={{ mb: 2, display: 'block' }}>
                Performance Trend
              </Typography>
              {/* Simple line chart mockup */}
              <svg width="100%" height="60" style={{ position: 'absolute', bottom: 16, left: 16, right: 16 }}>
                <polyline
                  points="0,50 50,40 100,45 150,25 200,30 250,15 300,20"
                  fill="none"
                  stroke={accentColor}
                  strokeWidth="2"
                  opacity="0.6"
                />
              </svg>
            </Box>

            {/* AI Suggestions */}
            <Box sx={{ mt: 3, p: 2, bgcolor: accentColor + '15', border: 1, borderColor: accentColor + '40', borderRadius: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Sparkles size={14} color={accentColor} />
                <Typography variant="caption" color={accentColor} fontWeight={600}>AI Optimization</Typography>
              </Box>
              <Typography variant="caption" color="rgba(255, 255, 255, 0.7)">
                Increase budget by 15% on high-performing ad sets
              </Typography>
            </Box>
          </Box>

          {/* Glass Morphism Overlay */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: (theme) => theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.02)'
                : 'rgba(255, 255, 255, 0.25)',
              backdropFilter: 'blur(8px) saturate(180%)',
              WebkitBackdropFilter: 'blur(8px) saturate(180%)',
              border: (theme) => theme.palette.mode === 'dark'
                ? '1px solid rgba(255, 255, 255, 0.08)'
                : '1px solid rgba(255, 255, 255, 0.3)',
              pointerEvents: 'none',
              borderRadius: 2,
            }}
          />

          {/* GIF Preview Indicator */}
          <Box
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 2,
              py: 1,
              bgcolor: 'rgba(0, 0, 0, 0.6)',
              borderRadius: 1,
              backdropFilter: 'blur(10px)',
              zIndex: 2,
            }}
          >
            <Play size={14} color={accentColor} />
            <Typography variant="caption" color={accentColor}>Live Demo</Typography>
          </Box>
        </Box>
      ),
    };

    return mockups[type] || <Box />;
  };

  return (
    <Box
      component="section"
      data-testid="section-meta-ads-features"
      sx={{
        // py: { xs: 10, md: 16 },
        background: (theme) =>
          theme.palette.mode === "dark"
            ? "linear-gradient(180deg, #000000 0%, #0a1929 50%, #000000 100%)"
            : "linear-gradient(180deg, #FFFFFF 0%, #f0f7ff 50%, #FFFFFF 100%)",
        position: "relative",
      }}
    >
      {/* Facebook Blue Radiant Gradient Overlay */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "100%",
          background: (theme) =>
            theme.palette.mode === "dark"
              ? "radial-gradient(ellipse at center, rgba(24, 119, 242, 0.15) 0%, transparent 60%)"
              : "radial-gradient(ellipse at center, rgba(24, 119, 242, 0.08) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />

      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
        {/* Header with Facebook Official Feel */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          sx={{ textAlign: "center", mb: 12 }}
        >
          <Chip
            label="Powered by Meta"
            size="small"
            sx={{
              mb: 4,
              bgcolor: "rgba(24, 119, 242, 0.15)",
              color: "#1877F2",
              border: 1,
              borderColor: "rgba(24, 119, 242, 0.3)",
              fontWeight: 600,
              letterSpacing: "0.5px",
              px: 2,
              py: 0.5,
            }}
          />
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              color: "text.primary",
              mb: 3,
              fontSize: { xs: "2.5rem", md: "3.75rem" },
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              background: (theme) =>
                theme.palette.mode === "dark"
                  ? "linear-gradient(135deg, #1877F2 0%, #0866FF 100%)"
                  : "linear-gradient(135deg, #1877F2 0%, #0a66c2 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Meta Ads Automation
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "text.secondary",
              maxWidth: 680,
              mx: "auto",
              fontWeight: 400,
              lineHeight: 1.6,
              fontSize: { xs: "1rem", md: "1.125rem" },
              letterSpacing: "0.01em",
              mb: 4,
            }}
          >
            Official Facebook & Instagram advertising suite with AI-powered
            automation—create, optimize, and scale campaigns effortlessly
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <MetaAutomationShowcase />
          </Box>
        </Box>

        {/* Feature Sections */}
        {features.map((feature, index) => (
          <Box
            key={index}
            component={motion.div}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
            data-testid={`feature-${feature.mockupType}`}
            sx={{
              // mb: { xs: 16, md: 24 },
            }}
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                gap: { xs: 8, md: 12 },
                alignItems: "center",
              }}
            >
              {/* Content */}
              <Box
                sx={{
                  order: { xs: 1, md: feature.reverse ? 2 : 1 },
                }}
              >
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 1.5,
                    px: 2.5,
                    py: 1,
                    borderRadius: 2,
                    bgcolor: `${feature.accentColor}10`,
                    border: 1,
                    borderColor: `${feature.accentColor}30`,
                    mb: 4,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      bgcolor: `${feature.accentColor}15`,
                      transform: "translateX(4px)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      color: feature.accentColor,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{
                      color: feature.accentColor,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.8px",
                      fontSize: "0.75rem",
                    }}
                  >
                    {feature.tag}
                  </Typography>
                </Box>

                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    color: "text.primary",
                    mb: 3,
                    fontSize: { xs: "1.875rem", md: "2.5rem" },
                    letterSpacing: "-0.015em",
                    lineHeight: 1.2,
                  }}
                >
                  {feature.title}
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    color: "text.secondary",
                    mb: 5,
                    lineHeight: 1.75,
                    fontSize: { xs: "1rem", md: "1.0625rem" },
                    letterSpacing: "0.01em",
                  }}
                >
                  {feature.description}
                </Typography>

                <Button
                  variant="contained"
                  size="large"
                  data-testid={`button-try-${feature.mockupType}`}
                  sx={{
                    bgcolor: "#1877F2",
                    color: "white",
                    px: 5,
                    py: 1.75,
                    borderRadius: 2,
                    fontWeight: 600,
                    fontSize: "1rem",
                    textTransform: "none",
                    letterSpacing: "0.01em",
                    boxShadow: "0 4px 14px rgba(24, 119, 242, 0.3)",
                    "&:hover": {
                      bgcolor: "#0866FF",
                      boxShadow: "0 8px 24px rgba(24, 119, 242, 0.4)",
                      transform: "translateY(-2px)",
                    },
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  Try It Now
                </Button>
              </Box>

              {/* Mockup */}
              <Box
                component={motion.div}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1 + 0.2,
                  ease: "easeOut",
                }}
                sx={{
                  order: { xs: 2, md: feature.reverse ? 1 : 2 },
                  "&:hover .mockup-container": {
                    transform: "translateY(-4px)",
                    boxShadow: (theme) =>
                      theme.palette.mode === "dark"
                        ? "0 24px 64px rgba(24, 119, 242, 0.35)"
                        : "0 24px 64px rgba(24, 119, 242, 0.2)",
                  },
                }}
              >
                {feature.showcase}
              </Box>
            </Box>
          </Box>
        ))}
      </Container>
    </Box>
  );
}
