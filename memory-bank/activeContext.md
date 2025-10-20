## Current Work Focus

Identifying the frontend tech stack and color palette for the new `/agent` page.

## Recent Changes

- Identified the frontend tech stack: Next.js, React, Material UI, Redux Toolkit, and other libraries as detailed in `techContext.md`.
- Identified the primary frontend theme color (`#00A76F`) and other frequently used colors as detailed in `systemPatterns.md`.
- Explained the paraphrasing process:
  - User input is taken.
  - On paraphrase button click, a request is sent to the server.
  - The server connects a socket with socket and event ID.
  - The server sends the response in three steps:
    1. Plain text: The server sends the initial paraphrased text as plain text through the `paraphrase-plain` socket event. This text is split into sentences and words, and stored in the `result` state. Bangla text is split by (।), and the rest of the languages are split by (.).
    2. Formatted data: The server sends formatted data through the `paraphrase-tagging` socket event. This data includes information about the part of speech of each word, which is used to apply different styling to the text.
    3. Formatted data with more details: The server sends synonym information through the `paraphrase-synonyms` socket event. This data is used to display synonyms for selected words in the output.
  - All responses are received and displayed in the `ParaphraseOutput` component.
  - User can interact with individual phrasal words and sentences.
  - User can change the phrasal word within the showing options.
  - User can rephrase a sentence using the `RephraseSentenceNav` component in `ParaphraseOutput.jsx`.
  - Clicking the rephrase button sends a request to the server.
  - The server sends back three different types of sentences, which are displayed in the UI.
  - User can choose any of the sentences, which replaces the corresponding sentence in the output component.
  - After replacing the sentence, another request is sent to the server for tagging and synonyms.
  - The history of rephrased sentences is saved in a state, allowing the user to access and toggle through the history using back and forward buttons.
  - User can send their input with multiple modes (standard, Send their input with multiple modes standard flowing standard, Fluency, formal, academic, etc.), with "standard" being the default.
  - There is a language option, and although the language is auto-detected, the user can manually set the language.
  - The server sends the response based on the selected mode and language.

## Next Steps

- Build the new `/agent` page.
- Further investigate the code to understand the implementation details of the server-side logic for the paraphrasing tool.
- Identify the specific components and functions involved in sending the data through the socket for the paraphrasing tool.
- **Investigate and fix the issue where tagging and synonyms options disappear from previous replaced sentences in the history.**

## Active Decisions and Considerations

- None at the moment.
