'use client';

import { useState, useEffect } from "react";
import { Box, Typography, Button, Dialog } from "@mui/material";
import { X, CheckCircle2, Loader2 } from "lucide-react";

export default function MetaAutomationShowcase() {
  const [open, setOpen] = useState(false);
  const [agentStage, setAgentStage] = useState(0);

  const stages = [
    {
      title: "Product Analysis",
      description: "Extracting product data and competitor landscape",
      progress: 15,
    },
    {
      title: "AI Personas & Campaigns",
      description: "Generating targeted personas and campaign structure",
      progress: 30,
    },
    {
      title: "Vibe Canvas - Ad Creatives",
      description: "Creating compelling ad copy and variations",
      progress: 50,
    },
    {
      title: "Media Canvas Generation",
      description: "Generating UGC, influencers, and content formats",
      progress: 70,
    },
    {
      title: "Campaign Launch",
      description: "Publishing to Facebook with targeting configuration",
      progress: 90,
    },
    {
      title: "Dashboard & Optimization",
      description: "Live insights, mindmap learning, and AI suggestions",
      progress: 100,
    },
  ];

  useEffect(() => {
    if (open && agentStage < 5) {
      const timer = setTimeout(() => {
        setAgentStage(agentStage + 1);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [open, agentStage]);

  const handleOpen = () => {
    setAgentStage(0);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setAgentStage(0);
  };

  return (
    <>
      <Button
        variant="contained"
        onClick={handleOpen}
        data-testid="button-try-meta-demo"
        sx={{
          bgcolor: '#1877F2',
          color: 'white',
          px: 4,
          py: 1.5,
          fontSize: '0.9rem',
          fontWeight: 600,
          textTransform: 'none',
          borderRadius: 2,
          '&:hover': {
            bgcolor: '#0C63D4',
          },
        }}
      >
        Try Interactive Demo
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: (theme) => theme.palette.mode === 'dark' ? 'grey.900' : 'white',
            borderRadius: 3,
            maxHeight: '90vh',
          },
        }}
      >
        <Box sx={{ display: 'flex', height: '80vh' }}>
          {/* Left Sidebar - Progress */}
          <Box
            sx={{
              width: 320,
              borderRight: 1,
              borderColor: 'divider',
              bgcolor: (theme) => theme.palette.mode === 'dark' ? 'grey.800' : 'grey.50',
              p: 3,
              overflowY: 'auto',
            }}
          >
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, mb: 3, display: 'block' }}>
              META AUTOMATION PIPELINE
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {stages.map((stage, index) => (
                <Box
                  key={index}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: 1,
                    borderColor: index <= agentStage ? '#1877F2' : 'divider',
                    bgcolor: index <= agentStage ? 'rgba(24, 119, 242, 0.05)' : 'transparent',
                    opacity: index <= agentStage ? 1 : 0.5,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    {index < agentStage ? (
                      <CheckCircle2 size={16} color="#1877F2" />
                    ) : index === agentStage ? (
                      <Box
                        component={Loader2}
                        size={16}
                        color="#1877F2"
                        sx={{
                          animation: 'spin 1s linear infinite',
                          '@keyframes spin': {
                            '0%': { transform: 'rotate(0deg)' },
                            '100%': { transform: 'rotate(360deg)' },
                          },
                        }}
                      />
                    ) : (
                      <Box sx={{ width: 16, height: 16, borderRadius: '50%', border: 1, borderColor: 'divider' }} />
                    )}
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                      {stage.title}
                    </Typography>
                  </Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1.5 }}>
                    {stage.description}
                  </Typography>
                  {index <= agentStage && (
                    <Box sx={{ height: 4, bgcolor: 'grey.200', borderRadius: 1, overflow: 'hidden' }}>
                      <Box
                        sx={{
                          height: '100%',
                          bgcolor: '#1877F2',
                          width: `${index < agentStage ? 100 : stage.progress}%`,
                          transition: 'width 1s ease-in-out',
                        }}
                      />
                    </Box>
                  )}
                </Box>
              ))}
            </Box>
          </Box>

          {/* Right Content Area */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <Box
              sx={{
                px: 4,
                py: 3,
                borderBottom: 1,
                borderColor: 'divider',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                  Meta Automation Agent
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  From product link to live campaigns automatically
                </Typography>
              </Box>
              <Button
                onClick={handleClose}
                data-testid="button-close-meta-demo"
                sx={{ minWidth: 'auto', p: 1, color: 'text.secondary' }}
              >
                <X size={20} />
              </Button>
            </Box>

            {/* Content */}
            <Box sx={{ flex: 1, overflowY: 'auto', p: 4 }}>
              {agentStage === 5 ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <CheckCircle2 size={64} color="#1877F2" style={{ margin: '0 auto' }} />
                  <Typography variant="h4" sx={{ mt: 3, mb: 2, fontWeight: 700 }}>
                    Campaign Live!
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
                    Your Meta ads campaign is now running with AI-powered optimization
                  </Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 3, maxWidth: 600, mx: 'auto' }}>
                    {[
                      { value: '2.4K', label: 'Impressions' },
                      { value: '156', label: 'Clicks' },
                      { value: '12', label: 'Conversions' },
                      { value: '3.2x', label: 'ROAS' },
                    ].map((stat, i) => (
                      <Box key={i} sx={{ p: 3, bgcolor: 'grey.50', borderRadius: 2, border: 1, borderColor: 'divider' }}>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1877F2' }}>
                          {stat.value}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {stat.label}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              ) : (
                <Box sx={{ maxWidth: 600, mx: 'auto' }}>
                  <Typography variant="h5" sx={{ mb: 2, fontWeight: 700, textAlign: 'center' }}>
                    {stages[agentStage].title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', mb: 4 }}>
                    {stages[agentStage].description}
                  </Typography>
                  <Box
                    sx={{
                      p: 4,
                      bgcolor: (theme) => theme.palette.mode === 'dark' ? 'grey.800' : 'grey.50',
                      borderRadius: 3,
                      border: 1,
                      borderColor: 'divider',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                      <Box
                        component={Loader2}
                        size={20}
                        color="#1877F2"
                        sx={{
                          animation: 'spin 1s linear infinite',
                          '@keyframes spin': {
                            '0%': { transform: 'rotate(0deg)' },
                            '100%': { transform: 'rotate(360deg)' },
                          },
                        }}
                      />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Processing...
                      </Typography>
                    </Box>
                    <Box sx={{ height: 6, bgcolor: 'grey.200', borderRadius: 1, overflow: 'hidden' }}>
                      <Box
                        sx={{
                          height: '100%',
                          bgcolor: '#1877F2',
                          width: `${stages[agentStage].progress}%`,
                          transition: 'width 1s ease-in-out',
                        }}
                      />
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Dialog>
    </>
  );
}
