\# Project Overview

Shothik AI is a fully completed writing assistant tool designed to enhance the quality of written content through advanced features such as paraphrasing, grammar correction, humanized AI writing, translation, summarization, deep research, and AI detection. The platform provides users with an intuitive, responsive, and seamless experience using modern web technologies.

\#\#\# \*\*Technology Stack for Frontend\*\*

The frontend of Shothik AI leverages a robust set of libraries and frameworks to ensure high performance, scalability, and maintainability. Below is the detailed overview of the technology stack:  
\#\#\#\# \*\*Core Frameworks and Libraries\*\*  
\- \*\*React (v19.0.0):\*\* Core library for building the user interface.  
\- \*\*Next.js (v15.2.2):\*\* Framework for server-side rendering (SSR), static site generation (SSG), and routing.  
\#\#\#\# \*\*UI Library\*\*

\- \*\*Material-UI (@mui/material v6.4.6):\*\*

A popular CSS UI library that provides a rich set of pre-built components based on Google's Material Design principles. It ensures consistency, responsiveness, and ease of customization for the application's design system.

\- \*\*Styling Integration:\*\*

    \- \`@emotion/react\` (v11.14.0) and \`@emotion/styled\` (v11.14.0) are used as the styling engine for Material-UI, enabling dynamic theming, scoped styles, and responsive design capabilities.

\- \*\*Icons:\*\*

    \- \`@mui/icons-material\`: Provides a wide range of Material Design icons for use across the application.

\#\#\#\# \*\*Routing Indication\*\*

\- \*\*@bprogress/next (v3.2.10):\*\*

This library is used to display a top bar indicator for routing progress. It helps provide visual feedback to users during navigation or page transitions, ensuring a smooth and responsive user experience.

\#\#\#\# \*\*Authentication\*\*

\- \*\*Dual Authentication System:\*\*

1\. \*\*Email/Password Login:\*\*  
 \- Implemented via API calls to a backend service for user authentication.  
 \- Ensures secure handling of user credentials and session management.

1\. \*\*Google Login:\*\*  
 \- \*\*Library:\*\* \`@react-oauth/google\` (v0.12.1)  
 Used for implementing Google OAuth-based login and one-tap login functionality.  
 \- \*\*Token Decoding:\*\*  
 \- \`jwt-decode\` (v4.0.0): Decodes the JWT token returned by Google's one-tap login to extract user information for session management.  
\#\#\#\# \*\*State Management\*\*

\- \*\*Redux Toolkit (@reduxjs/toolkit v2.6.0):\*\* Centralized state management for complex application data.  
\#\#\#\# \*\*Form Handling\*\*

\- \*\*React Hook Form (v7.54.2):\*\* Efficient form handling with minimal re-renders.  
\- \*\*Yup (v1.6.1):\*\* Schema validation for forms, ensuring robust validation logic and error handling.

\#\#\#\# \*\*Rich Text Editing\*\*

\- \*\*Tiptap (@tiptap/core, @tiptap/react, @tiptap/starter-kit, etc.):\*\* Rich text editor for creating and editing content.

\#\#\#\# \*\*Others Integrations\*\*

\- \*\*Socket.io-client (v4.8.1):\*\* Real-time communication for features like collaborative editing.  
\- \*\*React Share (v5.2.2):\*\* Social media sharing functionality.

\#\#\#\# \*\*File Handling\*\*

\- \*\*React PDF (v9.2.1):\*\* Rendering and interacting with PDF files.  
\- \*\*Docx (v9.2.0):\*\* Generating and manipulating \`.docx\` files.  
\- \*\*Mammoth (v1.9.0):\*\* Convert \`.docx\` files to HTML for rendering in the editor.  
\- \*\*File Saver (v2.0.5):\*\* Save files locally on the user's device.

\#\#\#\# \*\*Animations and Interactivity\*\*

\- \*\*Motion (v12.4.10):\*\* Animation library for smooth transitions and interactive elements.

\#\#\#\# \*\*Content Slider\*\*

\- \*\*React Slick & Slick Carousel (v0.30.3 & v1.8.1):\*\* Carousel/slider for displaying content or features.

\#\#\#\# \*\*Markdown Rendering\*\*

The project supports both light and dark themes.

\- \*\*Marked React (v3.0.0):\*\* Render Markdown content into HTML.

\#\#\# \*\*Key Features\*\*

\#\#\#\# \*\*1. Paraphrasing\*\*

\- Automatically rewrite sentences or paragraphs while preserving the original meaning.  
\- Ideal for users who want to rephrase content without losing context.  
\- \*\*Socket.IO Streaming:\*\* Real-time streaming of paraphrased results for a seamless user experience.  
\#\#\#\# \*\*2. Grammar Correction\*\*

\- Real-time detection and correction of grammatical errors, punctuation issues, and spelling mistakes.  
\- Suggestions for improving sentence structure and clarity.

\#\#\#\# \*\*3. Humanized AI Writing\*\*

\- Transform AI-generated text to sound more natural and human-like.  
\- Adjust tone and style based on user preferences.

\#\#\#\# \*\*4. Translation\*\*

\- Translate text between multiple languages with high accuracy.  
\- Support for common languages as well as less commonly used ones.

\#\#\#\# \*\*5. Summarization\*\*

\- Generate concise summaries of long documents or articles.  
\- Options to specify the length and focus of the summary.

\#\#\#\# \*\*6. Deep Research\*\*

\- Conduct research across the web, academic sources, and YouTube to gather relevant information.  
\- Organize and present findings in a structured format.

\#\#\#\# \*\*7. AI Detection\*\*

\- Identify whether a piece of text was generated by AI or written by a human.  
\- Provide confidence scores for detection results.

\#\#\#\# \*\*8. Markdown Format Data Rendering\*\*

\- Render Markdown content into visually appealing HTML using \`marked-react\`.  
\- Ensure clean and readable formatting for technical and non-technical users alike.

\#\#\#\# \*\*9. HTTP Streaming for All Modules\*\*

\- Use HTTP streaming to deliver real-time updates across all modules (e.g., grammar correction, translation, summarization).  
\- Enhance user experience by reducing latency and providing instant feedback.

\#\#\#\# \*\*10. Socket.IO Streaming for Paraphrasing Module\*\*

\- Leverage Socket.IO for real-time streaming of paraphrased content.  
\- Enable users to see results incrementally as they are generated, improving interactivity and responsiveness.

\#\#\#\# \*\*11. Payment Gateways\*\*

\- \*\*Bkash:\*\* Integrated for users in Bangladesh, offering a familiar and convenient payment method.  
\- \*\*Razorpay:\*\* Integrated for users in India, supporting local payment options like UPI, credit/debit cards, and net banking.  
\- \*\*Stripe:\*\* Integrated for users in all other countries, providing a globally recognized and versatile payment solution.

\#\#\#\# \*\*12 Page List\*\*

Here is the list of pages:

\#\#\#\# \*\*AI Writing Tools\*\*  
\- Paraphrasing  
\- Humanize GPT  
\- Summarizer  
\- Grammar Checker  
\- Translator  
\- AI Detector  
\- Research

\#\#\#\# \*\*Legal\*\*  
\- Terms of Service  
\- Privacy Policy  
\- Refund Policy  
\- Payment Policy

\#\#\#\# \*\*For Business\*\*  
\- Reseller Program  
\- Affiliate Program  
\- B2B Portfolios

\#\#\#\# \*\*Company\*\*  
\- About Us  
\- Our Team  
\- Career  
\- Blogs  
\- Blog Details  
\- Contact Us

\#\#\#\# \*\*Support\*\*  
\- Help Center  
\- Tutorials  
\- FAQs

\# Sidebar navigation  
The sidebar in Shothik AI includes two modes: \*\*Mini Mode\*\* and \*\*Expanded Mode\*\*, catering to different user needs and device sizes. These modes ensure that users can efficiently navigate the application while maintaining a clean, responsive, and visually appealing design.

\- \*\*Mini Mode:\*\* A compact version of the sidebar that focuses on essential services and conserves screen space.  
\- \*\*Expanded Mode:\*\* A detailed version of the sidebar that provides access to all services, account information, and subscription details.

On \*\*mobile devices\*\*, only expanded mode is implemented as a \*\*drawer\*\* that slides in and out of view, ensuring usability on smaller screens.

\#\#\#\# \*\*2. Objectives\*\*

\- Provide easy access to core services via click interactions.  
\- Hide non-essential sections (e.g., account details) in mini mode to conserve space.  
\- Display all features and personalized information in expanded mode for comprehensive navigation.  
\- Ensure seamless interaction and accessibility across devices.  
\- Implement a drawer-style interface for mobile devices to toggle between mini and expanded modes.

\#\#\#\# \*\*3. User Stories\*\*

1\. \*\*As a user on any device, I want to access core services quickly without clutter.\*\*  
 \- The sidebar should display all core services in a compact format (mini mode) while allowing access to expanded details when needed.  
1\. \*\*As an authenticated user, I expect my subscription plan to be visible even in mini mode.\*\*  
 \- The sidebar should prominently display the user's current subscription plan (e.g., "Pro Plan") in a dedicated area.  
1\. \*\*As an unauthenticated user, I want to see options to log in or sign up.\*\*  
 \- While the account section is hidden in mini mode, the sidebar should still encourage users to log in or sign up by providing clear CTAs.  
1\. \*\*As a user, I expect the sidebar to adapt seamlessly to different screen sizes.\*\*  
 \- The sidebar should toggle between mini mode and expanded mode based on device size or user preference.  
1\. \*\*As a mobile user, I want a quick way to access the full sidebar menu.\*\*  
 \- On mobile devices, provide a button to open the expanded sidebar (drawer), revealing all services, account information, and subscription details.

\#\#\#\# \*\*4. Functional Requirements\*\*

\#\#\#\#\# \*\*4.1 Core Services Menu\*\*

\- \*\*Services List:\*\*  
 \- Paraphrase  
 \- Humanize GPT  
 \- AI Detector  
 \- Grammar Fix  
 \- Summarize  
 \- Translator  
 \- Research  
\- \*\*Icons:\*\*  
 \- Each service should have a unique icon to enhance visual recognition.  
\- \*\*Navigation:\*\*  
 \- Clicking on any service should redirect the user to the corresponding feature page.  
 \- The sidebar should dynamically highlight the currently active service (e.g., using a background color or border).

\#\#\#\#\# \*\*4.2 Account Section\*\*

\- \*\*In Mini Mode:\*\*  
 The account section is \*\*hidden\*\* to conserve space. Instead, the sidebar focuses on:  
 \- Displaying the user's subscription plan (e.g., "Pro Plan") in a dedicated area at the bottom.  
 \- Providing a prominent button for upgrading plans if the user is on a free or limited plan.

\- \*\*In Expanded Mode:\*\*  
 \- The account section is fully visible, showing:  
 \- User's avatar and name.  
 \- Current subscription plan (e.g., "Pro Plan").  
 \- Buttons for managing the account (e.g., "Upgrade Plan," "Logout").

\#\#\#\#\# \*\*4.3 Subscription Status\*\*

\- \*\*Plan Display:\*\*  
 \- In mini mode, only the \*\*plan name\*\* is displayed (e.g., "Free Plan," "Pro Plan").  
 \- No additional icons or colors are used to differentiate plans in this mode.  
\- \*\*Upgrade Option:\*\*  
 \- For users on free or limited plans, display a prominent button labeled "Upgrade Plan."  
 \- For users on paid plans, display a button labeled "Manage Subscription" or similar.  
\#\#\#\#\# \*\*4.4 Responsive Design\*\*

\- \*\*Toggle Between Mini Mode and Expanded Mode:\*\*  
 \- \*\*Mini Mode:\*\*  
 \- Compact sidebar with icons and text labels.  
 \- Services are accessible via click.  
 \- Account section is hidden.  
 \- \*\*Expanded Mode:\*\*  
 \- Full-width sidebar with icons and text labels.  
 \- Displays all services and account information.  
 \- Provides detailed subscription status and CTAs.  
 \- \*\*Toggle Button (Mobile Drawer):\*\*  
 \- On mobile devices, a button (e.g., hamburger menu or arrow icon) is placed prominently to open the expanded sidebar (drawer).  
 \- When clicked, the sidebar slides out from the side, overlaying the main content temporarily.  
 \- The drawer can be closed by clicking outside the sidebar or using a close button.

\#\#\#\# \*\*5. Design Specifications\*\*

\#\#\#\#\# \*\*5.1 Layout\*\*  
\- \*\*Sidebar Width:\*\*  
 \- \*\*Mini Mode:\*\* Fixed width of \*\*64px\*\*.  
 \- \*\*Expanded Mode:\*\* Fixed width of \*\*280px\*\*.  
\- \*\*Services Section:\*\*  
 \- Displays all core services vertically with icons aligned to the left.  
 \- Active service is highlighted with a distinct background color or border.  
\- \*\*Account Section:\*\*  
 \- Positioned at the bottom of the sidebar in expanded mode.  
 \- Includes:  
 \- User avatar and name.  
 \- Subscription plan indicator.  
 \- Buttons for upgrading or logging out.

\#\#\#\#\# \*\*5.4 Interactions\*\*  
\- Hover State:  
 \- Services: Light background color change on hover.  
 \- Buttons: Slight shadow effect on hover.  
\- Active State:  
 \- Currently selected service: Highlighted with a distinct background color (e.g., light green).  
 \- Buttons: Pressed state with reduced opacity or shadow effect.

\# Header and Account popover  
The header of Shothik AI serves as the primary navigation and branding element for the application. It provides users with quick access to core features, account management, and additional resources. The header adapts based on whether the user is logged in or logged out, ensuring a personalized experience.

This section outlines the functional and design requirements for the header, including:  
\- Branding and navigation elements.  
\- User authentication status handling.  
\- Dynamic content updates based on user actions (e.g., switching tools).  
\- Responsive behavior across devices.

\#\#\#\# \*\*2. Objectives\*\*  
\- Provide clear branding and easy access to core features.  
\- Display user-specific information (e.g., subscription plan, profile details) when logged in.  
\- Offer seamless navigation to account settings, help resources, and other utilities.  
\- Dynamically update the header based on the active tool or page.  
\- Ensure responsiveness and consistency across desktop and mobile devices.

\#\#\#\# \*\*3. User Stories\*\*  
1\. \*\*As an unauthenticated user:\*\*  
 \- I want to see options to log in or sign up.  
 \- I expect to see a prominent "Upgrade Plan" button to encourage subscription upgrades.  
 \- I want quick access to help resources like the Help Center and Contact Us.

1\. \*\*As an authenticated user:\*\*  
 \- I expect my profile details (e.g., avatar, username) to be visible.  
 \- I want to see my current subscription plan and options to upgrade or manage it.  
 \- I need easy access to account settings, such as dark mode toggle, help resources, and logout functionality.

1\. \*\*As a user navigating tools:\*\*  
 \- I expect the header to dynamically display the name of the active tool (e.g., "Paraphrase," "Grammar Fix").  
 \- I want consistent visibility of branding and essential navigation elements regardless of the tool I'm using.

\#\#\#\# \*\*4. Functional Requirements\*\*

\#\#\#\#\# \*\*4.1 Branding and Navigation\*\*

\- \*\*Navigation icon:\*\*  
 \- In the mobile screen a navigation bar icon always visible right of the header.  
 \- when click on it the sidebar will appear from left as drawer.  
\- \*\*Logo:\*\*  
 \- Displays the Shothik AI logo (\`SHOTHIKAI\`) prominently on the left side of the header.  
 \- Clicking the logo should redirect users to the home/dashboard page.  
\- \*\*Tool Name Display:\*\*  
 \- When a user navigates to a specific tool (e.g., Paraphrase, Grammar Fix), the header dynamically updates to show the name of the active tool in the center.  
 \- Example: "Paraphrase," "Grammar Fix," etc.  
\- \*\*Upgrade Plan Button:\*\*  
 \- Always visible on the right side of the header.  
 \- For unauthenticated users: Label reads "Upgrade Plan."  
 \- For authenticated users: Label reads "Upgrade Premium."  
 \- For mobile device: Label reads "Upgrade."

\#\#\#\#\# \*\*4.2 Account Menu\*\*  
\- \*\*Unauthenticated Users:\*\*  
 \- A circular icon with the letter "M" (placeholder for future avatars) is displayed on the far right.  
 \- Hovering over the icon reveals a dropdown menu with the following options:  
 \- \*\*Login / Sign Up:\*\* Redirects to the login/sign-up page.  
 \- \*\*Dark Mode:\*\* Toggle switch to enable/disable dark mode.  
 \- \*\*Help Center:\*\* Redirects to the help center page.  
 \- \*\*Contact Us:\*\* Opens a contact form or email client.  
 \- \*\*Join Us on Discord:\*\* Redirects to the Discord server link.  
\- \*\*Authenticated Users:\*\*  
 \- The circular icon displays the user's avatar (if available) or initials.  
 \- Hovering over the icon reveals a dropdown menu with the following options:  
 \- \*\*My Profile:\*\* Redirects to the user's profile page.  
 \- \*\*Dark Mode:\*\* Toggle switch to enable/disable dark mode.  
 \- \*\*Help Center:\*\* Redirects to the help center page.  
 \- \*\*Contact Us:\*\* Opens a contact form or email client.  
 \- \*\*Join Us on Discord:\*\* Redirects to the Discord server link.  
 \- \*\*Log Out:\*\* Allows the user to log out of their account.

\#\#\#\#\# \*\*4.3 Dynamic Updates\*\*  
\- \*\*Active Tool Detection:\*\*  
 \- The header dynamically updates the central text to reflect the name of the active tool (e.g., "Paraphrase," "Grammar Fix").  
 \- This ensures users always know which tool they are currently using.

\#\#\#\# \*\*5. Design Specifications\*\*

\#\#\#\#\# \*\*5.1 Layout\*\*

\- \*\*Header Width:\*\*  
 \- Full-width, spanning the entire viewport.  
\- \*\*Elements Alignment:\*\*  
 \- \*\*Left Side:\*\* Logo (\`SHOTHIKAI\`).  
 \- \*\*Center:\*\* Active tool name (dynamic based on the current page).  
 \- \*\*Right Side:\*\*  
 \- "Upgrade Plan" button.  
 \- Account menu icon (circular with avatar or placeholder).

\#\#\#\#\# \*\*5.2 Styling\*\*  
\- \*\*Typography:\*\*  
 \- Tool name: Bold font style, size 18px.  
 \- Other text: Regular font style, size 16px.  
\- \*\*Icons:\*\*  
 \- Avatar icon: Circular with a placeholder letter "M" for unauthenticated users.  
 \- Dark mode toggle: Standard toggle switch icon.  
 \- Other icons (Help Center, Contact Us, Discord): Material Design icons.

\#\#\#\#\# \*\*5.3 Interactions\*\*  
\- \*\*Hover States:\*\*  
 \- Account menu icon: Slight shadow effect on hover.  
 \- Dropdown menu items: Background color change on hover.  
\- \*\*Active States:\*\*  
 \- Dark mode toggle: Highlighted when enabled.  
 \- Buttons: Pressed state with reduced opacity or shadow effect.  
\- \*\*Transitions:\*\*  
 \- Dropdown menu: Smooth slide-in/slide-out animation.  
 \- Tool name update: Instant update without flicker.

\#\#\#\# \*\*6. Key Features\*\*

1\. \*\*Dynamic Tool Name Display:\*\*  
 \- Automatically updates the header to show the name of the active tool.  
1\. \*\*User Authentication Handling:\*\*  
 \- Displays different content based on whether the user is logged in or logged out.  
1\. \*\*Responsive Design:\*\*  
 \- Adapts to both desktop and mobile devices with collapsible menus.  
1\. \*\*Account Management:\*\*  
 \- Provides quick access to profile, settings, and help resources.

\---

\# Landing page  
The landing page of Shothik AI serves as the primary entry point for users visiting the platform. It aims to:  
\- Introduce Shothik AI's core value proposition.  
\- Highlight key features and benefits.  
\- Provide clear calls-to-action (CTAs) to engage users.  
\- Ensure a visually appealing and responsive design.  
This section outlines the functional and design requirements for the landing page, ensuring it aligns with Shothik AI's overall branding and user experience goals.

\#\#\#\# \*\*2. Objectives\*\*  
\- \*\*Engage Users:\*\* Capture the attention of visitors and convey the value of Shothik AI.  
\- \*\*Communicate Features:\*\* Clearly articulate the platform's advanced writing assistance capabilities.  
\- \*\*Drive Conversions:\*\* Encourage users to explore features, sign up, or upgrade their plans.  
\- \*\*Ensure Responsiveness:\*\* Provide a consistent experience across desktop and mobile devices.

\#\#\#\# \*\*3. User Stories\*\*  
1\. \*\*As a first-time visitor:\*\*  
 \- I want to quickly understand what Shothik AI does and how it can help me.  
 \- I expect to see clear examples of the platform's capabilities.  
 \- I need easy access to CTAs like "Explore Features" or "Sign Up."

1\. \*\*As a returning user:\*\*  
 \- I want to be reminded of the platform's key features and benefits.  
 \- I expect to see personalized content based on my usage history (if logged in).

1\. \*\*As a business user:\*\*  
 \- I want to see how Shothik AI can solve specific business challenges.  
 \- I expect to find case studies or testimonials that demonstrate real-world impact.

1\. \*\*As a mobile user:\*\*  
 \- I want the landing page to adapt seamlessly to my screen size.  
 \- I need quick access to essential information without scrolling excessively.

\#\#\#\# \*\*4. Functional Requirements\*\*

\#\#\#\#\# \*\*4.1 Hero Section\*\*  
\- \*\*Purpose:\*\* Capture user attention and convey the platform's value proposition.  
\- \*\*Components:\*\*  
 \- \*\*Logo:\*\* Display the Shothik AI logo prominently.  
 \- \*\*Headline:\*\* A concise, compelling headline (e.g., "Human Quality Writing Agent").  
 \- \*\*Subheading:\*\* Brief description of the platform's purpose (e.g., "Paraphrasing, grammar correction, humanized AI writing, translation, summarization, deep research, and AI detection").  
 \- \*\*Rating and Social Proof:\*\* Show ratings (e.g., 4.6/5 stars) and the number of satisfied users (e.g., "Based on 400,000+ happy clients").

\- \*\*CTA Buttons:\*\*  
 \- "Explore the Features": Redirects to a dedicated features page.  
 \- "Upgrade Plan": Encourages users to subscribe to premium plans.  
\#\#\#\#\# \*\*4.2 Feature Highlights\*\*

\- \*\*Purpose:\*\* Showcase the platform's core features in an engaging manner.  
\- \*\*Components:\*\*  
 \- \*\*Section Title:\*\* "Seven Powerful Tools, One Unified Platform."  
 \- \*\*Feature Cards:\*\*  
 \- Each card should include:  
 \- Icon representing the feature.  
 \- Feature name (e.g., Paraphrase, Grammar Fix, Summarize).  
 \- Brief description of the feature's functionality.  
 \- Example Card:  
 \- \*\*Icon:\*\* Text transformation icon.  
 \- \*\*Title:\*\* Paraphrase.  
 \- \*\*Description:\*\* Rewrite sentences or paragraphs while preserving meaning.  
 \- \*\*CTA Button:\*\* "Explore the Features" to encourage deeper exploration.

\#\#\#\#\# \*\*4.3 Value Proposition\*\*

\- \*\*Purpose:\*\* Explain why Shothik AI stands out from competitors.  
\- \*\*Components:\*\*  
 \- \*\*Section Title:\*\* "Powerful Features That Set Shothik AI Apart."  
 \- \*\*Feature Descriptions:\*\*  
 \- Unleash AI Potential with Humanize GPT.  
 \- Harness the Power of Advanced AI Detector.  
 \- Break Language Barriers with Translator.  
 \- \*\*Visual Elements:\*\*  
 \- Animated icons or illustrations to represent each feature.  
 \- \*\*CTA Buttons:\*\* "Explore the Features" for each section.

\#\#\#\#\# \*\*4.4 Business Solutions\*\*

\- \*\*Purpose:\*\* Target businesses and showcase tailored solutions.  
\- \*\*Components:\*\*  
 \- \*\*Section Title:\*\* "Shothik AI Solutions for Businesses Tailored for B2B Innovation."  
 \- \*\*Subheading:\*\* "Transform Your Business with AI-Powered Solutions."  
 \- \*\*Content:\*\*  
 \- Brief explanation of how Shothik AI optimizes workflows and enhances productivity.  
 \- Case studies or testimonials from businesses using Shothik AI.  
 \- \*\*CTA Button:\*\* "View Info" to learn more about business solutions.

\#\#\#\#\# \*\*4.5 Why Choose Shothik AI?\*\*

\- \*\*Purpose:\*\* Address common pain points and differentiate Shothik AI from competitors.  
\- \*\*Components:\*\*  
 \- \*\*Section Title:\*\* "Why Choose Shothik AI?"  
 \- \*\*Key Benefits:\*\*  
 \- Boost Productivity.  
 \- Perfect Your Language.  
 \- Tailored to Your Needs.  
 \- \*\*Visual Elements:\*\*  
 \- Icons or illustrations for each benefit.  
 \- Short descriptions explaining how Shothik AI addresses user needs.  
 \- \*\*CTA Button:\*\* "Get Started" to encourage sign-up or trial.

\#\#\#\#\# \*\*4.6 Get Started Section\*\*

\- \*\*Purpose:\*\* Guide users to take the next step.  
\- \*\*Components:\*\*  
 \- \*\*Section Title:\*\* "Get Started with Shothik AI Today."  
 \- \*\*Call-to-Action:\*\* "Explore the Features" button.  
 \- \*\*Supporting Content:\*\*  
 \- Brief text encouraging users to try the platform.  
 \- Links to FAQs or demo videos.

\#\#\#\#\# \*\*4.8 Frequently Asked Questions (FAQs)\*\*

\- \*\*Purpose:\*\* Address common queries and build trust.  
\- \*\*Components:\*\*  
 \- \*\*Section Title:\*\* "Frequently Asked Questions."  
 \- \*\*Tabs or Accordion Format:\*\*  
 \- General  
 \- Payments  
 \- Services  
 \- Refund

\- \*\*Questions and Answers:\*\*  
 \- Example:  
 \- \*\*Q:\*\* What is Shothik AI?  
 \- \*\*A:\*\* Shothik AI is an innovative startup focused on harnessing the power of artificial intelligence to simplify complex problems and provide cutting-edge solutions.  
 \- Include questions related to pricing, features, and user support.

\#\#\#\# \*\*6. Key Features\*\*

1\. \*\*Hero Section:\*\*  
 \- Dynamic and engaging introduction to Shothik AI.  
 \- Clear CTAs for exploring features or upgrading plans.  
1\. \*\*Feature Highlights:\*\*  
 \- Visual representation of core tools (e.g., Paraphrase, Grammar Fix).  
 \- Interactive elements like hover effects or animations.  
1\. \*\*Business Solutions:\*\*  
 \- Case studies and testimonials to build credibility.  
 \- Dedicated CTA for business inquiries.  
1\. \*\*Why Choose Shothik AI?:\*\*  
 \- Concise explanations of key benefits.  
 \- Visual aids to enhance understanding.  
1\. \*\*Get Started Section:\*\*  
 \- Simple, direct call-to-action for new users.  
1\. \*\*FAQs:\*\*  
 \- Comprehensive support resources for users.  
 \- Easy navigation to important pages.

\---

\# Paraphrase  
\*\*Objective:\*\* Rewrite text with different tone, sentence structure, and improved readability.

\#\#\# \*\*Layout Breakdown\*\*

The interface is split into \*\*three main sections\*\*:

\#\#\#\# \*\*Top Bar (Global Options)\*\*

\- \*\*Language Switcher\*\* (Top-left):

    \- Allows switching between English, Bangla, or more languages using the dropdown. English will be selected by default.

\- \*\*Tone/Modes Tab\*\* (Below Language Switcher):

    \- Includes various rephrasing tones:
        \- ✅ Free: \*\*Standard\*\*, \*\*Fluency\*\*
        \- 🔒 Premium: \*\*Formal\*\*, \*\*Academic\*\*, \*\*News\*\*, \*\*Simple\*\*, \*\*Creative\*\*, \*\*Short\*\*, \*\*Long\*\*

    \- \*\*Locked icons:\*\* indicate that an upgrade is needed. Free users cannot use the locked modes but can still view them and when user click on locked modes then show a tiny upgrade modal.

\- \*\*Paraphrasing Strength Slider (Top-right)\*\*  
 \- There are 4 steps: Basic, Intermediate, Advanced, and Expert. When the user selects a specific strength using the slider, the output will display the corresponding response.

\---

\#\#\#\# \*\*Main Panels\*\*

\#\#\#\#\# Left Panel – \*\*Input Field\*\*

\- Users can:

    \- Type or paste text or try with sample text.

    \- Upload \`.pdf\`  and \`.docx\` files

\- Features:

    \- Word counter (bottom-left, e.g., \*\*39 / 180\*\*)

    \- Trash icon to clear the input

    \- \*\*“Paraphrase”\*\* button to process the text

    \- If there is text in the output, it will show \*\*"Rephrase"\*\* button instead of \*\*"Paraphrase"\*\* conditionally.

    \-  When a user pastes any text into the input field, the system will use Natural Language Understanding (NLU) to detect the type of content (e.g., Medical, Technical, Legal, etc.). Based on the detected content type, the system will paraphrase the text while maintaining proper indentation and formatting to preserve the original content structure and theme.

    \- The system should detect and handle content duplication to ensure the generated paraphrased output is original and unique.

    \- When users paste content with multiple paragraphs into the input section, the system must maintain the original paragraph gaps and line breaks.

    \- Currently, multiple paragraphs merge into a single paragraph—this should be fixed to retain proper formatting.

\- 🔒 \*\*Freeze Word Functionality\*\*:

    \- When a word (like \*\*“passed”\*\*) is selected, a \*\*“Please upgrade to Freeze”\*\* tooltip appears

    \- Only \*\*premium users\*\* can freeze selected words to \*\*prevent them from being changed\*\* during rephrasing

\---  
\*\*Left and right side will be divided by a line.\*\*  
\- A movable divider will be placed between the input and output sections. Users will be able to drag this divider left or right to resize the input and output areas as needed. At the top of the divider, there will be a swiper icon that allows users to transfer selected paragraphs from the output section to the input section with a single click.

\#\#\#\#\# Right Panel – \*\*Output Field\*\*

\- Shows the paraphrased version after clicking \*\*“Paraphrase”\*\*

\- Features include:

    \- Highlighted words to show changed parts

    \- Edited output is fully \*\*interactive and editable\*\*

    \-   After generating the initial output, \*\*user\*\* can:

    \- Select any part of the text

    \- Get \*\*paraphrased alternatives\*\* of that sentence or phrase

    \- See \*\*synonym suggestions\*\* for specific words

    \- Replace the existing sentence/word with the chosen alternative by clicking or tapping

    \-  In the paraphrased output, clicking on a 2–3 word phrase will show synonym suggestions. Below the suggestions, a “Break” action button will be displayed. If the user clicks “Break,” the phrase will be broken down into individual words, and the phrase behavior will be removed.

\---

\*\*Bottom Controls (Output Panel)\*\*

\- 1/3 – Shows the \*\*current sentence suggestion number\*\*

\- Arrows – To \*\*navigate\*\* between sentence options

\- Word counter – Show the word number of output

\- Download – Exports result (e.g., \`.docx\`)

\- Copy – Copies output to clipboard

\- Delete – Clears the output panel

\---

\# Humanize

\*\*Objective:\*\* Convert AI-generated or robotic-sounding content into human-like, emotional, and natural writing.

\#\#\# \*\*Layout Overview\*\*

\#\#\#\# \*\*Top Section\*\*  
\- \*\*Language Selector:\*\* English, Bangla, All (dropdown)

\- \*\*AI Model Tabs:\*\*

    \- \`Panda\` (selected by default for free users)

    \- \`Raven\` (locked with upgrade tooltip)

\- \*\*Paraphrasing Strength Slider\*\* (Top-right corner):  
 \- There are 4 steps: Basic, Intermediate, Advanced, and Expert. When the user selects a specific strength using the slider, the output will display the corresponding response.

\---

\#\#\#\# \*\*Main Input Area\*\*

\- Placeholder: “Enter your text here…”

\- Three buttons for input methods:
