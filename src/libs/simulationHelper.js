// =============================================================================
// SIMULATION CONFIGURATION - EASY TO TOGGLE ON/OFF | FOR MAIN PRODUCTION & PRE-LAUNCH
// =============================================================================
const SIMULATION_CONFIG = {
  enabled: true, // Set to false to disable all simulation features
  agents: {
    sheets: {
      simulations: {
        "6899c971364813eab1a0a0ce": "Compare pricing of top 10 gyms in a sheet",
        "6899caacfe89e52d02b85587":
          "List top 5 Italian restaurants with ratings",
        "6899cba7364813eab1a0a104": "Generate 10 school and contact notes",
      },
    },
    // slide: {
    //   simulations: {
    //     1: "Create a presentation about climate change with slides covering causes, effects, and solutions",
    //     2: "Generate a business pitch deck with slides for problem, solution, market size, and team",
    //     3: "Create an educational presentation about the solar system with slides for each planet",
    //   },
    // },
  },
};

// Simulation validation
const isValidSimulation = (agentType, simulationId) => {
    if (!SIMULATION_CONFIG.enabled) return false;
    return SIMULATION_CONFIG.agents[agentType]?.simulations?.[simulationId] !== null;
};

// Get simulation prompt
const getSimulationPrompt = (agentType, simulationId) => {
    if (!SIMULATION_CONFIG.enabled) return null;
    return SIMULATION_CONFIG.agents[agentType]?.simulations?.[simulationId] || null;
  };

// =============================================================================
// SSE HANDLING - PRODUCTION VS SIMULATION
// =============================================================================

const parseSimulationCompleted = (data) => {
    // It's handled like this way because the backend developer.

  // First completed step - just message
  if (data.data?.message && !data.data?.columns && !data.data?.rows) {
    return {
      type: "completion_message",
      message: data.data.message,
      timestamp: data.timestamp,
    };
  }

  // Second completed step - actual data
  if (data.data?.columns && data.data?.rows) {
    return {
      type: "completion_data",
      columns: data.data.columns,
      rows: data.data.rows,
      metadata: data.data.metadata,
      conversationId: data.conversation,
      chatId: data.chat,
      timestamp: data.timestamp,
    };
  }

  return { type: "completion_unknown", data };
};

const parseProductionCompleted = (data) => {
  const responseData = data?.data?.data;

  if (responseData?.response?.columns && responseData?.response?.rows) {
    return {
      type: "completion_data",
      columns: responseData.response.columns,
      rows: responseData.response.rows,
      metadata: responseData.response.metadata,
      conversationId: responseData._id,
      prompt: responseData.prompt,
      timestamp: responseData.createdAt,
    };
  }

  return { type: "completion_unknown", data };
};

export {
  SIMULATION_CONFIG,
  isValidSimulation,
  getSimulationPrompt,
  parseSimulationCompleted,
  parseProductionCompleted,
};