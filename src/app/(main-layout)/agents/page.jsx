'use client';
import React, { useState } from 'react';
import Box from '@mui/material/Box';
import { AgentContextProvider } from '../../../../components/agents/shared/AgentContextProvider';
import AgentLandingPage from '../../../../components/agents/AgentLandingPage';
import AgentTutorialOverlay from '../../../../components/agents/shared/AgentTutorialOverlay';

export default function AgentsPage() {
  const [tutorialOpen, setTutorialOpen] = useState(false);

  // Optionally, open tutorial on first visit
  React.useEffect(() => {
    const completed = localStorage.getItem('agents_tutorial_completed');
    if (!completed) setTutorialOpen(true);
  }, []);

  return (
    <AgentContextProvider>
      <Box>
        <AgentLandingPage />
        {/* Tutorial Overlay */}
        <AgentTutorialOverlay open={tutorialOpen} onClose={() => setTutorialOpen(false)} />
      </Box>
    </AgentContextProvider>
  );
} 