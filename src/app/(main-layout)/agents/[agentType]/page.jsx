'use client';
import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import Box from '@mui/material/Box';
import { AgentContextProvider } from '../../../../../components/agents/shared/AgentContextProvider';
import AgentPage from '../../../../../components/agents/AgentPage';

export default function SpecificAgentPage() {
  const params = useParams();
  const agentType = params.agentType;

  return (
    <AgentContextProvider>
      <Box sx={{ minHeight: 'calc(100vh - 200px)' }}>
        <AgentPage specificAgent={agentType} />
      </Box>
    </AgentContextProvider>
  );
} 