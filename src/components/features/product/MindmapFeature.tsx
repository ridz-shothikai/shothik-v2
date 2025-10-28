import { Box, Container, Typography, Button, Chip } from "@mui/material";
import { Network, Brain, TrendingUp, MessageCircle, Play } from "lucide-react";

export default function MindmapFeature() {
  return (
    <Box
      component="section"
      data-testid="section-mindmap-feature"
      sx={{
        py: { xs: 10, md: 16 },
        bgcolor: (theme) => theme.palette.mode === 'dark' ? '#000000' : '#FFFFFF',
        position: 'relative',
      }}
    >
      {/* Subtle gradient overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 300,
          background: 'radial-gradient(ellipse at top, rgba(24, 119, 242, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ textAlign: 'center', mb: 10 }}>
          <Chip 
            label="Our Secret Weapon" 
            size="small" 
            icon={<Brain size={16} />}
            sx={{ 
              mb: 3, 
              bgcolor: 'rgba(24, 119, 242, 0.15)',
              color: '#1877F2',
              border: 1,
              borderColor: 'rgba(24, 119, 242, 0.3)',
              '& .MuiChip-icon': {
                color: '#1877F2',
              },
            }} 
          />
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              color: 'text.primary',
              mb: 2,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
            }}
          >
            Strategic Mindmap Feature
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'text.secondary',
              maxWidth: 700,
              mx: 'auto',
              fontWeight: 400,
              mb: 1,
            }}
          >
            Don't just launch ads—understand the strategy behind every decision
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'text.disabled',
              maxWidth: 650,
              mx: 'auto',
              fontWeight: 400,
            }}
          >
            Learn why your campaigns work while you earn. Our unique mindmap visualizes ad strategy, performance patterns, and optimization paths.
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: { xs: 6, md: 10 },
            alignItems: 'center',
          }}
        >
          {/* Mindmap Mockup */}
          <Box
            sx={{
              position: 'relative',
              height: { xs: 350, md: 450 },
              borderRadius: 2,
              border: 1,
              borderColor: 'rgba(255, 255, 255, 0.1)',
              bgcolor: 'rgba(15, 20, 35, 0.8)',
              overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(24, 119, 242, 0.2)',
            }}
          >
            {/* Header */}
            <Box sx={{ px: 3, py: 2, borderBottom: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#1877F2' }} />
                <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                  Campaign Strategy Mindmap
                </Typography>
              </Box>
            </Box>
            
            {/* Mindmap visualization */}
            <Box
              sx={{
                p: 4,
                height: 'calc(100% - 60px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              {/* Central node */}
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #1877F2 0%, #667eea 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'text.primary',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  textAlign: 'center',
                  p: 2,
                  zIndex: 3,
                  boxShadow: '0 10px 40px rgba(24, 119, 242, 0.4)',
                }}
              >
                Campaign Strategy
              </Box>

              {/* Connecting lines and nodes */}
              {[
                { top: '10%', left: '15%', label: 'Audience', color: '#00A76F', lineLength: 200, angle: 135 },
                { top: '10%', right: '15%', label: 'Creative', color: '#1877F2', lineLength: 200, angle: 225 },
                { bottom: '10%', left: '15%', label: 'Budget', color: '#00A76F', lineLength: 200, angle: 45 },
                { bottom: '10%', right: '15%', label: 'Optimize', color: '#1877F2', lineLength: 200, angle: 315 },
              ].map((node, index) => (
                <Box key={index}>
                  {/* Connecting line */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      width: 2,
                      height: node.lineLength,
                      bgcolor: 'rgba(255, 255, 255, 0.2)',
                      transformOrigin: 'top center',
                      transform: `translate(-1px, 0) rotate(${node.angle}deg)`,
                      zIndex: 1,
                    }}
                  />
                  {/* Node */}
                  <Box
                    sx={{
                      position: 'absolute',
                      ...node,
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      bgcolor: 'rgba(255, 255, 255, 0.05)',
                      border: 2,
                      borderColor: node.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: node.color,
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      zIndex: 2,
                      boxShadow: `0 5px 20px ${node.color}40`,
                    }}
                  >
                    {node.label}
                  </Box>
                </Box>
              ))}
            </Box>

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
              }}
            >
              <Play size={14} color="#1877F2" />
              <Typography variant="caption" color="#1877F2">Live Demo</Typography>
            </Box>
          </Box>

          {/* Features List */}
          <Box sx={{ color: 'text.primary' }}>
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, mb: 4, color: 'text.primary' }}
            >
              Learn & Earn with Visual Intelligence
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    bgcolor: 'rgba(24, 119, 242, 0.15)',
                    border: 1,
                    borderColor: 'rgba(24, 119, 242, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Network size={24} color="#1877F2" />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5, color: 'text.primary' }}>
                    Visual Strategy Maps
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    See how campaigns, ad sets, and creatives connect. Understand the full picture at a glance.
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    bgcolor: 'rgba(0, 167, 111, 0.15)',
                    border: 1,
                    borderColor: 'rgba(0, 167, 111, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <MessageCircle size={24} color="#00A76F" />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5, color: 'text.primary' }}>
                    Chat with Your Mindmap
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Ask questions about your campaign structure. Get AI-powered insights and recommendations.
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    bgcolor: 'rgba(24, 119, 242, 0.15)',
                    border: 1,
                    borderColor: 'rgba(24, 119, 242, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <TrendingUp size={24} color="#1877F2" />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5, color: 'text.primary' }}>
                    Learn What Works
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Discover patterns, understand performance drivers, and become a better marketer with every campaign.
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Button
              variant="outlined"
              size="large"
              data-testid="button-try-mindmap"
              sx={{
                mt: 5,
                borderColor: '#1877F2',
                color: '#1877F2',
                px: 5,
                py: 1.5,
                borderRadius: 1,
                fontWeight: 600,
                '&:hover': {
                  borderColor: '#1877F2',
                  bgcolor: 'rgba(24, 119, 242, 0.15)',
                },
              }}
            >
              Explore Mindmap Feature
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
