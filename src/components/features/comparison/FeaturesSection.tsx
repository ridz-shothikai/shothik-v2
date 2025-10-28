import { Box, Container, Typography, Card, Stack, Chip, Dialog, DialogTitle, DialogContent, Button, TextField, IconButton } from "@mui/material";
import { CheckCircle, Star, TrendingUp, AutoAwesome } from "@mui/icons-material";
import { X, ArrowRight, Play, Bot } from 'lucide-react';
import { useState, useEffect } from 'react';

// Import sidebar icons
import paraphraseIcon from "../../../assets/Paraphrase_1759908407164.png";
import humanizeIcon from "../../../assets/Humanize GPT_1759908388806.png";
import aiDetectorIcon from "../../../assets/AI Detector_1759908376738.png";
import grammarIcon from "../../../assets/Grammar Fix_1759908381522.png";
import summarizeIcon from "../../../assets/Summarize_1759908412611.png";
import translatorIcon from "../../../assets/Translator_1759908416747.png";
import agentIcon from "../../../assets/Agent_1759908370558.png";

const writingTools = [
  {
    icon: paraphraseIcon,
    title: "Paraphrase",
    description: "Built-in plagiarism checker - no separate subscriptions needed",
    highlight: "Real-time originality scores",
  },
  {
    icon: grammarIcon,
    title: "Grammar Fix",
    description: "Instant corrections with context-aware suggestions",
    highlight: "Professional quality",
  },
  {
    icon: humanizeIcon,
    title: "Humanize GPT",
    description: "Bypass AI detection with advanced humanization",
    highlight: "Passes all detectors",
  },
  {
    icon: aiDetectorIcon,
    title: "AI Detector",
    description: "Verify if content is AI-generated or human-written",
    highlight: "99% accuracy",
  },
  {
    icon: summarizeIcon,
    title: "Summarize",
    description: "Condense long documents into key insights instantly",
    highlight: "Up to 156 pages",
  },
  {
    icon: translatorIcon,
    title: "Translator",
    description: "100+ languages with context preservation",
    highlight: "Multi-language support",
  },
];

const aiAgents = [
  {
    id: 'slides-agent',
    icon: agentIcon,
    title: "Slides Agent",
    description: "Creates complete presentations with research and design",
    examples: ["Pitch decks", "Educational slides", "Business reports"],
    examplePrompts: [
      { prompt: 'Create a presentation about AI in healthcare', description: 'AI in healthcare' },
      { prompt: 'Generate slides for quarterly business review', description: 'Business review' },
      { prompt: 'Make a pitch deck for a SaaS startup', description: 'Startup pitch' },
    ],
    color: "primary.main",
  },
  {
    id: 'sheet-agent',
    icon: agentIcon,
    title: "Sheet Agent",
    description: "Performs research and structures data in smart sheets",
    examples: ["Market analysis", "Competitor research", "Data comparison"],
    examplePrompts: [
      { prompt: 'Analyze sales trends from Q1 to Q4', description: 'Sales trends' },
      { prompt: 'Compare pricing of top 10 gyms in NYC', description: 'Compare pricing' },
      { prompt: 'Find patterns in customer feedback data', description: 'Customer insights' },
    ],
    color: "secondary.main",
  },
  {
    id: 'deep-research',
    icon: agentIcon,
    title: "Deep Research",
    description: "Comprehensive research with structured insights",
    examples: ["Industry reports", "Academic research", "Trend analysis"],
    examplePrompts: [
      { prompt: 'Research the impact of AI on education', description: 'AI in education' },
      { prompt: 'Analyze market trends for electric vehicles', description: 'Market trends' },
      { prompt: 'Compile research on sustainable energy solutions', description: 'Sustainable energy' },
    ],
    color: "info.main",
  },
  {
    id: 'writing-agent',
    icon: agentIcon,
    title: "Writing Agent",
    description: "Paraphrases, fixes grammar, humanizes AI text, and enhances your writing",
    examples: ["Paraphrase", "Grammar Fix", "Humanize AI"],
    examplePrompts: [
      { prompt: 'Paraphrase this text to make it more professional and engaging', description: 'Paraphrase text' },
      { prompt: 'Fix grammar and improve clarity in my business proposal', description: 'Grammar check' },
      { prompt: 'Humanize this AI-generated content to sound more natural', description: 'Humanize AI text' },
    ],
    color: "success.main",
  },
  {
    id: 'meta-ads-agent',
    icon: agentIcon,
    title: "Meta Ads Agent",
    description: "Creates complete ad campaigns with targeting, copy, and creative strategy",
    examples: ["URL to Ads", "Campaign Strategy", "Ad Optimization"],
    examplePrompts: [
      { prompt: 'https://example.com/fitness-app', description: 'Fitness app URL' },
      { prompt: 'https://mystore.com/products/eco-friendly-water-bottle', description: 'Product URL' },
      { prompt: 'https://saas-product.io/pricing', description: 'SaaS product URL' },
    ],
    color: "warning.main",
  },
];

const metaFeatures = [
  {
    icon: AutoAwesome,
    title: "URL to Ads in 3 Minutes",
    description: "Paste website or Facebook link → Get 8-15 ad variants automatically",
  },
  {
    icon: TrendingUp,
    title: "3X Better ROAS",
    description: "AI-powered optimization for maximum return on ad spend",
  },
  {
    icon: Star,
    title: "Creative Diversity Engine",
    description: "Video, Reels, Images, Carousels - all formats covered",
  },
];

interface AgentDemoModalProps {
  open: boolean;
  agent: any;
  onClose: () => void;
}

function AgentDemoModal({ open, agent, onClose }: AgentDemoModalProps) {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState('');

  useEffect(() => {
    if (!open) {
      setInput('');
      setResult('');
      setIsProcessing(false);
    }
  }, [open]);

  const handleExampleClick = (prompt: string) => {
    setInput(prompt);
    setResult('');
  };

  const handleTryIt = () => {
    if (!input.trim()) return;
    
    setIsProcessing(true);
    setResult('');
    
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      
      // Generate mock results based on agent type
      if (agent?.id === 'slides-agent') {
        setResult('✓ Created 8 slides\n✓ Added visuals and charts\n✓ Professional theme applied\n✓ Ready to present');
      } else if (agent?.id === 'sheet-agent') {
        setResult('📊 Key Insights:\n• Average sales: $45,230\n• Top performing region: North\n• Growth trend: +23% YoY\n• Recommendation: Expand to Western markets');
      } else if (agent?.id === 'deep-research') {
        setResult('📚 Research Summary:\n• Found 47 relevant sources\n• Key trends identified\n• Comprehensive analysis complete\n• Citations formatted');
      } else if (agent?.id === 'writing-agent') {
        setResult('✓ Blog post created (1,200 words)\n✓ SEO optimized with keywords\n✓ Engaging headlines included\n✓ Ready to publish');
      } else if (agent?.id === 'meta-ads-agent') {
        setResult('✓ Campaign created\n✓ 5 ad variations generated\n✓ Target audience: 25-45, Tech professionals\n✓ Estimated reach: 50K-100K');
      }
    }, 1500);
  };

  if (!agent) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      data-testid="agent-demo-modal"
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        borderBottom: 1,
        borderColor: 'divider',
        pb: 2,
        bgcolor: (theme) => theme.palette.mode === 'dark' ? '#000000' : '#FFFFFF'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 48,
              height: 48,
              borderRadius: '8px',
              bgcolor: agent.color,
            }}
          >
            <Box
              component="img"
              src={agent.icon.src}
              alt={agent.title}
              sx={{
                width: 28,
                height: 28,
                objectFit: 'contain',
                filter: 'brightness(0) invert(1)',
              }}
            />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
              {agent.title}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {agent.description}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} data-testid="button-close-modal">
          <X size={20} />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ mt: 3, bgcolor: (theme) => theme.palette.mode === 'dark' ? '#000000' : '#FFFFFF' }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 700, color: 'text.primary' }}>
            Try These Examples
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {agent.examplePrompts?.map((example: any, idx: number) => (
              <Chip
                key={idx}
                label={example.description}
                onClick={() => handleExampleClick(example.prompt)}
                data-testid={`example-${idx}`}
                sx={{ 
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: agent.color,
                    color: 'white',
                  }
                }}
              />
            ))}
          </Box>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 700, color: 'text.primary' }}>
            What would you like {agent.title} to do?
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Enter your ${agent.title.toLowerCase()} request...`}
            data-testid="input-demo"
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            onClick={handleTryIt}
            disabled={!input.trim() || isProcessing}
            startIcon={isProcessing ? <Bot size={18} /> : <Play size={18} />}
            data-testid="button-try-now"
            sx={{ mb: 2, bgcolor: agent.color, '&:hover': { bgcolor: agent.color, opacity: 0.9 } }}
          >
            {isProcessing ? 'Processing...' : 'Try Now'}
          </Button>
        </Box>

        {(result || isProcessing) && (
          <Box sx={{ 
            p: 2.5, 
            borderRadius: 1, 
            bgcolor: 'action.hover',
            minHeight: 100,
            mb: 2,
            border: 1,
            borderColor: 'divider'
          }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700, color: 'text.primary' }}>
              Result
            </Typography>
            {isProcessing ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Bot size={18} />
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Processing your request...
                </Typography>
              </Box>
            ) : (
              <Typography variant="body2" sx={{ whiteSpace: 'pre-line', color: 'text.secondary' }}>
                {result}
              </Typography>
            )}
          </Box>
        )}

        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          pt: 2,
          borderTop: 1,
          borderColor: 'divider'
        }}>
          <Button
            variant="contained"
            endIcon={<ArrowRight size={18} />}
            data-testid="button-try-full-feature"
            sx={{ bgcolor: agent.color, '&:hover': { bgcolor: agent.color, opacity: 0.9 } }}
          >
            Try Full Feature
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default function FeaturesSection() {
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenDemo = (agent: any) => {
    setSelectedAgent(agent);
    setModalOpen(true);
  };

  const handleCloseDemo = () => {
    setModalOpen(false);
    setTimeout(() => setSelectedAgent(null), 300);
  };
  return (
    <Box
      id="features"
      component="section"
      sx={{
        py: { xs: 8, md: 12 },
        bgcolor: (theme) => theme.palette.mode === 'dark' ? '#000000' : '#FFFFFF',
      }}
    >
      <AgentDemoModal 
        open={modalOpen}
        agent={selectedAgent}
        onClose={handleCloseDemo}
      />
    </Box>
  );
}
