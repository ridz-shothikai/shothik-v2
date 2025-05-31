import React, { useState, useMemo } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import AgentCard from './AgentCard';

const PAGE_SIZE = 6;

const AgentListView = ({
  agents = [],
  onSelect,
  filterOptions = [],
  sortOptions = [],
}) => {
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState('');
  const [page, setPage] = useState(1);

  const filteredAgents = useMemo(() => {
    let result = agents;
    if (filter && filter !== 'all') {
      result = result.filter((a) => a.type === filter);
    }
    if (sort) {
      result = [...result].sort((a, b) => {
        if (sort === 'name') return a.name.localeCompare(b.name);
        if (sort === 'date') return (b.createdAt || 0) - (a.createdAt || 0);
        return 0;
      });
    }
    return result;
  }, [agents, filter, sort]);

  const pageCount = Math.ceil(filteredAgents.length / PAGE_SIZE);
  const pagedAgents = filteredAgents.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
        {filterOptions.length > 0 && (
          <Box>
            <Typography variant="body2" sx={{ mr: 1, display: 'inline' }}>Filter:</Typography>
            <Select size="small" value={filter} onChange={e => { setFilter(e.target.value); setPage(1); }}>
              <MenuItem value="">All</MenuItem>
              {filterOptions.map(opt => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </Select>
          </Box>
        )}
        {sortOptions.length > 0 && (
          <Box>
            <Typography variant="body2" sx={{ mr: 1, display: 'inline' }}>Sort:</Typography>
            <Select size="small" value={sort} onChange={e => setSort(e.target.value)}>
              <MenuItem value="">Default</MenuItem>
              {sortOptions.map(opt => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </Select>
          </Box>
        )}
      </Box>
      {pagedAgents.length === 0 ? (
        <Typography color="text.secondary" sx={{ mt: 4, textAlign: 'center' }}>No agents found.</Typography>
      ) : (
        <Grid container spacing={2}>
          {pagedAgents.map(agent => (
            <Grid item xs={12} sm={6} md={4} key={agent.id}>
              <AgentCard
                name={agent.name}
                description={agent.description}
                icon={agent.icon}
                actions={agent.actions}
                onClick={onSelect ? () => onSelect(agent) : undefined}
              />
            </Grid>
          ))}
        </Grid>
      )}
      {pageCount > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination count={pageCount} page={page} onChange={(_, p) => setPage(p)} color="primary" />
        </Box>
      )}
    </Box>
  );
};

export default AgentListView; 