'use client';
import React, { useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Box from '@mui/material/Box';
import { AgentContextProvider } from '../../../../../components/agents/shared/AgentContextProvider';
import AgentPage from '../../../../../components/agents/AgentPage';
import PresentationAgentPage from '../../../../components/presentation/PresentationAgentPage';

export default function SpecificAgentPage() {
  const params = useParams();
  const agentType = params.agentType;

  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  return (
    <AgentContextProvider>
      <Box sx={{ minHeight: 'calc(100dvh - 200px)', overflowY: 'hidden' }}>
        <PresentationAgentPage specificAgent={agentType} presentationId={id}  />
      </Box>
    </AgentContextProvider>
  );
} 