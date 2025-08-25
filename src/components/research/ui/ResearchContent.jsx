"use client";

import { Box, Typography, Paper, Avatar, Chip } from "@mui/material";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import PersonIcon from "@mui/icons-material/Person";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import { marked } from "marked";
import { useSelector } from "react-redux";

const MessageBubble = ({ message, isUser }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "flex-start",
    }}
  >
    <Paper
      elevation={1}
      sx={{
        flex: 1,
        py: 2,
        px: 3,
        mb: {xs: 19 ,sm: 9, md:2},
        bgcolor: "#F4F6F8",
        // borderRadius: 2,
        border: "none",
        boxShadow: "none"
      }}
    >
      <Box sx={{ "& p": { mb: 1 }, "& p:last-child": { mb: 0 } }}>
        {/* <ReactMarkdown>{message.content}</ReactMarkdown> */}
        <Box
          sx={{ "& p": { mb: 1 }, "& p:last-child": { mb: 0 } }}
          dangerouslySetInnerHTML={{ __html: marked(message) }}
        />
      </Box>

      {message.sources && message.sources.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography
            variant="caption"
            sx={{ color: "text.secondary", mb: 1, display: "block" }}
          >
            Sources:
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {message.sources.slice(0, 5).map((source, index) => (
              <Chip
                key={index}
                label={`[${source.reference}] ${source.title}`}
                size="small"
                variant="outlined"
                sx={{ fontSize: "0.7rem", height: "24px" }}
                onClick={() => window.open(source.url, "_blank")}
                clickable
              />
            ))}
            {message.sources.length > 5 && (
              <Chip
                label={`+${message.sources.length - 5} more`}
                size="small"
                variant="outlined"
                sx={{ fontSize: "0.7rem", height: "24px" }}
              />
            )}
          </Box>
        </Box>
      )}

      <Typography
        variant="caption"
        sx={{
          color: "text.secondary",
          mt: 1,
          display: "block",
          textAlign: "right",
        }}
      >
        {new Date(message.timestamp).toLocaleTimeString()}
      </Typography>
    </Paper>
  </Box>
);

export default function ResearchContent({
  messages,
  isStreaming,
  streamEvents,
  // currentResearch,
}) {
  const { currentResearch } = useSelector((state) => state.researchCore);

  const researchResult = currentResearch?.result || "";

  // if (!messages || messages.length === 0) {
  //   return (
  //     <Box
  //       sx={{
  //         display: "flex",
  //         flexDirection: "column",
  //         alignItems: "center",
  //         justifyContent: "center",
  //         minHeight: 400,
  //         textAlign: "center",
  //       }}
  //     >
  //       <SmartToyIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
  //       <Typography variant="h6" color="text.secondary">
  //         Start a Research Session
  //       </Typography>
  //       <Typography variant="body2" color="text.secondary">
  //         Ask a question to begin your AI-powered research
  //       </Typography>
  //     </Box>
  //   );
  // }


  const dummyMessage = `
  "### **The AI Revolution: Reshaping the Future of Call Centers and Customer Relationships**\n\n### Introduction\n\nThe call center has long been the epicenter of customer interaction, a critical touchpoint that can define a brand's reputation and foster customer loyalty. Traditionally, this landscape has been dominated by human agents managing high volumes of inquiries, often leading to challenges such as long wait times, inconsistent service, and high operational costs. Simultaneously, Customer Relationship Management (CRM) has evolved from simple databases to complex systems aimed at tracking and managing the customer journey. Today, we stand at the precipice of a profound transformation, driven by the integration of Artificial Intelligence (AI). AI is not merely an incremental improvement; it is a disruptive force poised to fundamentally reshape the architecture of call centers and redefine the very nature of customer relationships, shifting the paradigm from reactive problem-solving to proactive, personalized, and predictive engagement.\n\nThis paper will explore the multifaceted impact of AI on the future of call centers and CRM. It will delve into the specific AI technologies driving this change, analyze their effects on operational efficiency and customer experience, examine the evolution of the human agent's role, and consider the future trajectory of this technological integration. By synthesizing insights from industry leaders and technological analyses, we will illustrate how AI is creating a more intelligent, responsive, and empathetic ecosystem for customer service.\n\n### The AI-Augmented Call Center: A New Era of Efficiency and Intelligence\n\nThe modern call center, or contact center, is evolving from a cost center focused on handling calls to a value-generating hub of customer intelligence [1]. AI is the primary catalyst for this evolution, introducing a suite of tools that automate routine tasks, empower human agents, and extract actionable insights from every interaction.\n\n#### **Intelligent Automation and Conversational AI**\n\nAt the forefront of this transformation are conversational AI tools like chatbots and voicebots. These AI-powered assistants can handle a significant volume of routine and repetitive customer inquiries 24/7, such as order status checks, password resets, and basic product questions [13, 16]. This automation delivers immediate benefits:\n*   **Reduced Wait Times:** Customers receive instant responses to common queries, drastically cutting down on queue times [14].\n*   **Cost Reduction:** Automating tier-1 support frees up human agents, allowing businesses to optimize staffing and reduce operational expenses [9].\n*   **Scalability:** AI systems can handle thousands of concurrent interactions without a decline in performance, offering a level of scalability that is impossible with a purely human workforce.\n\nBeyond simple automation, AI-driven **intelligent routing** systems are revolutionizing how customers are connected to agents. Instead of a first-in, first-out model, these systems analyze a customer's data—including their history with the company, the nature of their current query, and even their sentiment—to direct them to the agent best equipped to handle their specific needs. This ensures a higher rate of First Contact Resolution (FCR), a critical metric for customer satisfaction [12, 16].\n\n#### **Empowering the Human Agent with Real-Time Assistance**\n\nPerhaps one of the most significant impacts of AI is its ability to augment the capabilities of human agents. Rather than replacing them, AI acts as a \"copilot,\" providing real-time support that enhances their performance and confidence [6, 17].\n\n*   **Real-Time Agent Assist:** During a live call, AI can listen to the conversation and automatically surface relevant information from knowledge bases, provide step-by-step guidance, and suggest the \"next-best-action\" [15]. For instance, Microsoft's Dynamics 365 Customer Service uses AI to provide agents with real-time suggestions and summarize conversations, reducing the cognitive load on the agent [6].\n*   **Sentiment Analysis:** AI algorithms can analyze a customer's tone of voice and word choice to detect emotions like frustration or anger in real-time [11]. This provides a visual cue to the agent, prompting them to adjust their approach, offer empathy, and de-escalate a potentially negative situation before it worsens [16]. Amazon Connect's Contact Lens feature is a prime example, offering real-time sentiment analysis to help guide agents during difficult calls [2, 3].\n*   **Automated Summarization:** After a call concludes, generative AI can instantly create a concise, accurate summary of the interaction. This eliminates a time-consuming manual task for agents, reduces post-call work, and ensures consistent, high-quality data entry into the CRM system [4, 6].\n\nThis symbiotic relationship between human and machine leads to more productive, less-stressed agents who can focus on building rapport and solving complex problems, ultimately improving both employee satisfaction and the quality of customer service [15].\n\n### Transforming CRM: From Data Management to Predictive Engagement\n\nAI is fundamentally changing CRM from a passive system of record into a proactive engine for personalized customer engagement. By leveraging machine learning and predictive analytics, businesses can now anticipate customer needs, identify risks, and uncover new opportunities with unprecedented accuracy [20].\n\n#### **Hyper-Personalization at Scale**\n\nAI algorithms can process and analyze vast datasets—including transaction history, browsing behavior, previous service interactions, and social media activity—to build a comprehensive, 360-degree view of each customer [19]. This deep understanding enables **hyper-personalization**, where every interaction is tailored to the individual's preferences and context. This can manifest in several ways:\n*   **Proactive Outreach:** AI can predict when a customer might need to reorder a product, require assistance with a complex feature, or be at risk of churning. The business can then proactively reach out with relevant offers or support [5, 16].\n*   **Personalized Recommendations:** By understanding a customer's past behavior and preferences, AI can deliver highly relevant product or content recommendations, increasing cross-sell and upsell opportunities [20].\n*   **Context-Aware Service:** When a customer contacts support, the AI-powered CRM can instantly provide the agent with the full context of their journey, ensuring the customer doesn't have to repeat themselves and the agent can provide a seamless, informed experience [1].\n\n#### **Predictive Analytics and Actionable Insights**\n\nBeyond personalization, AI provides powerful predictive capabilities that inform business strategy. By analyzing historical data, machine learning models can identify patterns that precede specific outcomes [8].\n*   **Churn Prediction:** AI can identify subtle behavioral changes that indicate a customer is at risk of leaving, allowing the company to intervene with retention offers or targeted support [16].\n*   **Lead Scoring:** In sales, AI can analyze the characteristics and behaviors of potential leads to predict which ones are most likely to convert, helping sales teams prioritize their efforts more effectively [20].\n*   **Trend Identification:** AI can analyze thousands of call transcripts, emails, and chat logs to identify emerging product issues, common customer complaints, or gaps in service [1, 19]. This feedback loop provides invaluable, data-driven insights that can guide product development and strategic decision-making.\n\n### The Future Landscape: Generative AI and the Evolving Human Role\n\nThe recent advancements in generative AI, exemplified by large language models (LLMs), are set to accelerate this transformation even further. These models can understand and generate human-like text, leading to more natural, empathetic, and context-aware conversational bots [4, 19]. Generative AI can also be used to automatically create personalized email responses, draft knowledge base articles from support transcripts, and even generate tailored training simulations for new agents [17].\n\nThis increasing sophistication of AI means the role of the human agent will continue to evolve. As AI handles the predictable and procedural, human agents will be elevated to manage the exceptional [10]. Their responsibilities will shift towards:\n*   **Complex Problem-Solving:** Handling multifaceted, non-standard issues that require critical thinking and creativity.\n*   **Emotional Intelligence and Empathy:** Managing sensitive, high-stakes interactions where human connection and empathy are paramount.\n*   **Relationship Building:** Acting as brand ambassadors who build long-term customer loyalty through meaningful and consultative conversations [15].\n\nThis shift will require significant investment in reskilling and training, focusing on soft skills like active listening, empathy, and complex negotiation alongside technical proficiency [10].\n\n### Conclusion\n\nThe integration of Artificial Intelligence is not merely an upgrade for call centers and CRM systems; it is a complete reimagining of their purpose and potential. By automating routine tasks, AI frees up human capital to focus on higher-value activities. By providing real-time intelligence and assistance, it empowers agents to perform at their best. And by analyzing vast amounts of data, it enables businesses to move from a reactive support model to a proactive, predictive, and deeply personalized approach to customer relationships.\n\nThe future of customer service is a powerful synergy between human and machine. AI will manage the data, the scale, and the speed, while humans will provide the judgment, creativity, and empathy that build lasting trust and loyalty. Organizations that successfully navigate this transformation will not only achieve significant gains in efficiency and cost savings but will also forge stronger, more meaningful connections with their customers, setting a new standard for excellence in the digital age."
  `;

  return (
    <Box>
      {/* {messages.map((message) => ( */}
      <MessageBubble
        // key={message.id}
        // message={message}
        // message={dummyMessage}
        message={researchResult}
        // isUser={message.type === "human"}
        isUser={false}
      />
      {/* ))} */}

      {isStreaming && (
        <Box sx={{ mt: 2 }}>
          <Paper
            elevation={1}
            sx={{
              p: 2,
              bgcolor: "#f8f9fa",
              borderRadius: 2,
              border: "1px solid #e9ecef",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              AI is researching your question...
            </Typography>
            {streamEvents.length > 0 && (
              <Typography variant="caption" sx={{ mt: 1, display: "block" }}>
                Current step:{" "}
                {streamEvents[streamEvents.length - 1]?.step?.replace("_", " ")}
              </Typography>
            )}
          </Paper>
        </Box>
      )}
    </Box>
  );
}
