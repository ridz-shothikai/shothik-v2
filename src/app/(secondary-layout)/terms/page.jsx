import { Box, Typography } from "@mui/material";
import Breadcrumb from "../../../components/acount/BreadCrumbs";
import BackgroundContainer from "../../../components/secondaryPages/BackgroundContainer";

export async function generateMetadata() {
  return {
    title: "Shothik AI: Terms & Conditions | Shothik AI",
    description: "This is terms and condition page",
  };
}

export default function TermsPage() {
  return (
    <BackgroundContainer>
      <Breadcrumb
        heading="Terms & Conditions"
        links={[{ name: "Legal" }, { name: "Terms & Conditions" }]}
      />

      {/* Main Box for Terms and Conditions */}
      <Box sx={{ py: 3 }}>
        <Typography variant="h4" gutterBottom>
          Shothik AI Terms and Conditions
        </Typography>

        <Typography variant="body1" paragraph>
          These Terms of Service (“Agreement”) are made between Shothik AI
          (referred to as “Company”, “we”, “us”, or “our”) and you (“User”,
          “you”, or “your”), the individual accessing our services. By using the
          Shothik AI platform, you agree to comply with the terms and conditions
          outlined below. If you do not agree, please discontinue using the
          services immediately.
        </Typography>

        <Typography variant="h5" gutterBottom>
          1. Acceptance of Terms
        </Typography>
        <Typography variant="body1" paragraph>
          By using the Shothik AI services, you affirm that you are at least 13
          years of age. Minors (under 18 years of age) must have the consent of
          a parent or guardian to use the services. Shothik AI reserves the
          right to change these terms at any time. You will be notified of any
          changes via email or a notice on our website. Your continued use of
          the services after any modifications indicates your acceptance of the
          updated terms.
        </Typography>

        <Typography variant="h5" gutterBottom>
          2. Services Provided
        </Typography>
        <Typography variant="body1" paragraph>
          Shothik AI offers a comprehensive AI-powered marketing automation platform designed to assist users in creating, managing, and optimizing advertising campaigns. The services provided include:
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li">
            Create and manage Facebook/Instagram advertising campaigns
          </Typography>
          <Typography component="li">
            Research competitor advertising strategies (using public data)
          </Typography>
          <Typography component="li">
            Generate AI-powered campaign ideas and content
          </Typography>
          <Typography component="li">
            Monitor and optimize your advertising performance
          </Typography>
          <Typography component="li">
            Create images, videos, and Reels for advertising
          </Typography>
          <Typography component="li">
            Paraphrasing: Rewriting content while maintaining the original meaning
          </Typography>
          <Typography component="li">
            Bypass GPT: Advanced paraphrasing and content generation that avoids detection by AI detection tools, ideal for academic or content creation use cases
          </Typography>
          <Typography component="li">
            Grammar Fix: Correcting grammatical errors, improving sentence structure, and ensuring content is written clearly
          </Typography>
          <Typography component="li">
            Summarizing: Condensing long pieces of text into shorter summaries that capture the main points
          </Typography>
          <Typography component="li">
            Translator: Translating content between multiple languages, providing accurate and context-aware translations
          </Typography>
        </Box>

        <Typography variant="h5" gutterBottom>
          3. User Responsibilities
        </Typography>
        <Typography variant="body1" paragraph>
          Users agree to:
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li">
            Provide accurate, current, and complete information during
            registration.
          </Typography>
          <Typography component="li">
            Maintain the confidentiality of account credentials and notify us
            immediately of unauthorized use of your account.
          </Typography>
          <Typography component="li">
            Comply with all applicable laws and not use our services for any
            unlawful or fraudulent purposes.
          </Typography>
        </Box>

        <Typography variant="h5" gutterBottom>
          4. Prohibited Activities
        </Typography>
        <Typography variant="body1" paragraph>
          Users may not:
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li">
            Attempt to breach or bypass security features of the site.
          </Typography>
          <Typography component="li">
            Use the services to defraud, mislead, or impersonate others.
          </Typography>
          <Typography component="li">
            Use Shothik AI for any illegal purposes, including sending harassing
            or harmful content.
          </Typography>
          <Typography component="li">
            Reverse-engineer or misuse any part of the service.
          </Typography>
          <Typography component="li">
            Share account credentials with unauthorized persons or resell the
            services without permission.
          </Typography>
        </Box>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          4.1 Prohibited Use
        </Typography>
        <Typography variant="body1" paragraph>
          You agree NOT to:
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li">
            Violate Meta's Policies - All campaigns must comply with Meta's Advertising Policies and Community Standards
          </Typography>
          <Typography component="li">
            Create deceptive ads - No misleading, fraudulent, or false advertising
          </Typography>
          <Typography component="li">
            Spam or harass - No unsolicited messages or harassment campaigns
          </Typography>
          <Typography component="li">
            Infringe intellectual property - Respect copyrights, trademarks, and patents
          </Typography>
          <Typography component="li">
            Scrape or abuse - No unauthorized data collection or system abuse
          </Typography>
          <Typography component="li">
            Resell the service - Platform is for your business use only
          </Typography>
          <Typography component="li">
            Reverse engineer - No attempts to copy, modify, or steal our technology
          </Typography>
          <Typography component="li">
            Promote illegal activities - No drugs, weapons, illegal services
          </Typography>
          <Typography component="li">
            Share accounts - Each account is for individual/business use only
          </Typography>
        </Box>
        <Typography variant="body1" paragraph sx={{ fontWeight: 'bold', color: 'error.main' }}>
          Important: Violations of Meta's Advertising Policies may result in your Meta ad account being suspended. We are not responsible for Meta account suspensions resulting from policy violations.
        </Typography>
        <Typography variant="body1" paragraph>
          Violation of any of these prohibitions may result in termination of
          your account and legal action.
        </Typography>

        <Typography variant="h5" gutterBottom>
          5. Meta Platform Integration
        </Typography>
        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          5.1 Third-Party Platform
        </Typography>
        <Typography variant="body1" paragraph>
          Shothik AI integrates with Meta's platforms (Facebook, Instagram) through official APIs. Your use of Meta's platforms is subject to:
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li">Meta Terms of Service</Typography>
          <Typography component="li">Meta Advertising Policies</Typography>
          <Typography component="li">Meta Platform Terms</Typography>
        </Box>

        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          5.2 Meta API Compliance
        </Typography>
        <Typography variant="body1" paragraph>
          We access Meta's APIs in compliance with their Platform Terms. Changes to Meta's APIs, policies, or terms may affect Platform functionality. We are not responsible for disruptions caused by Meta's changes.
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          5.3 Ad Account Requirements
        </Typography>
        <Typography variant="body1" paragraph>
          To use campaign management features:
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li">You must have a valid Meta Business Manager account</Typography>
          <Typography component="li">Your ad account must be in good standing</Typography>
          <Typography component="li">You must have proper payment methods configured in Meta Ads Manager</Typography>
          <Typography component="li">You are responsible for all ad spend charges from Meta</Typography>
        </Box>

        <Typography variant="h5" gutterBottom>
          6. AI-Generated Content
        </Typography>
        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          6.1 Content Generation
        </Typography>
        <Typography variant="body1" paragraph>
          The Platform uses AI (Google Gemini, Vertex AI, Fal AI) to generate campaign ideas, ad copy, images, and videos. AI-generated content is provided as suggestions and requires your review and approval before publishing.
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          6.2 Content Responsibility
        </Typography>
        <Typography variant="body1" paragraph>
          You are solely responsible for all content you publish, including AI-generated content. You must:
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li">Review all AI-generated content before publishing</Typography>
          <Typography component="li">Ensure content complies with Meta's Advertising Policies</Typography>
          <Typography component="li">Verify accuracy of claims and statements</Typography>
          <Typography component="li">Respect intellectual property rights</Typography>
          <Typography component="li">Comply with applicable advertising laws (FTC, FDA, etc.)</Typography>
        </Box>

        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          6.3 No Warranty on AI Content
        </Typography>
        <Typography variant="body1" paragraph>
          AI-generated content is provided "as is" without warranties of accuracy, completeness, or suitability. We do not guarantee ad performance or compliance.
        </Typography>

        <Typography variant="h5" gutterBottom>
          7. Intellectual Property
        </Typography>
        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          7.1 Our Intellectual Property
        </Typography>
        <Typography variant="body1" paragraph>
          Shothik AI owns all rights to the Platform, including software, algorithms, UI design, branding, and documentation. You may not copy, modify, distribute, or create derivative works without permission.
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          7.2 Your Content
        </Typography>
        <Typography variant="body1" paragraph>
          You retain ownership of content you upload (product images, brand materials, etc.). By uploading content, you grant us a license to:
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li">Store and process your content to provide the service</Typography>
          <Typography component="li">Use content to train and improve our AI models</Typography>
          <Typography component="li">Display content in your campaigns and analytics</Typography>
        </Box>
        <Typography variant="body1" paragraph>
          This license ends when you delete your content or account.
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          7.3 AI-Generated Content Ownership
        </Typography>
        <Typography variant="body1" paragraph>
          You own AI-generated content created for your campaigns. We do not claim ownership of campaign materials generated through the Platform.
        </Typography>

        <Typography variant="h5" gutterBottom>
          8. Payment and Billing
        </Typography>
        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          8.1 Platform Fees
        </Typography>
        <Typography variant="body1" paragraph>
          Shothik AI may charge subscription fees for Platform access. Current pricing is available at our pricing page. By subscribing, you agree to pay all applicable fees.
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          8.2 Meta Advertising Costs
        </Typography>
        <Typography variant="body1" paragraph>
          You are responsible for all Facebook/Instagram advertising costs. Ad spend is billed directly by Meta through your ad account. We do not charge or collect ad spend fees.
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          8.3 Refunds
        </Typography>
        <Typography variant="body1" paragraph>
          Platform subscription fees are non-refundable except as required by law. We do not provide refunds for Meta ad spend (contact Meta directly for billing issues).
        </Typography>

        <Typography variant="h5" gutterBottom>
          9. Data and Privacy
        </Typography>
        <Typography variant="body1" paragraph>
          Your use of the Platform is subject to our Privacy Policy, which explains how we collect, use, and protect your data.
        </Typography>
        <Typography variant="body1" paragraph>
          Key points:
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li">We collect account information and campaign data</Typography>
          <Typography component="li">Your data is encrypted and stored securely</Typography>
          <Typography component="li">You can request data deletion at any time</Typography>
          <Typography component="li">We comply with GDPR and CCPA</Typography>
          <Typography component="li">We do not sell your personal information</Typography>
        </Box>

        <Typography variant="h5" gutterBottom>
          10. Service Availability
        </Typography>
        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          10.1 Uptime
        </Typography>
        <Typography variant="body1" paragraph>
          We strive to maintain Platform availability but do not guarantee uninterrupted service. Maintenance, updates, or technical issues may cause temporary downtime.
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          10.2 Service Changes
        </Typography>
        <Typography variant="body1" paragraph>
          We may modify, suspend, or discontinue features at any time. We will provide notice of material changes when possible.
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          10.3 Third-Party Dependencies
        </Typography>
        <Typography variant="body1" paragraph>
          The Platform relies on third-party services (Meta APIs, Google AI, MongoDB, etc.). Disruptions to these services may affect Platform functionality.
        </Typography>

        <Typography variant="h5" gutterBottom>
          11. Limitation of Liability
        </Typography>
        <Typography variant="body1" paragraph sx={{ fontWeight: 'bold' }}>
          Important Legal Notice:
        </Typography>
        <Typography variant="body1" paragraph>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, SHOTHIK AI SHALL NOT BE LIABLE FOR:
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li">Ad performance - We do not guarantee campaign results, conversions, or ROI</Typography>
          <Typography component="li">Meta account suspensions - Policy violations or ad disapprovals by Meta</Typography>
          <Typography component="li">Data loss - Loss of campaigns, analytics, or content due to technical issues</Typography>
          <Typography component="li">Third-party services - Failures of Meta, Google, or other integrated services</Typography>
          <Typography component="li">AI content issues - Inaccuracies, errors, or policy violations in AI-generated content</Typography>
          <Typography component="li">Indirect damages - Lost profits, business interruption, or consequential damages</Typography>
        </Box>
        <Typography variant="body1" paragraph>
          Our total liability for any claims shall not exceed the amount you paid to Shothik AI in the 12 months prior to the claim.
        </Typography>

        <Typography variant="h5" gutterBottom>
          12. Disclaimer of Warranties
        </Typography>
        <Typography variant="body1" paragraph>
          THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li">Merchantability or fitness for a particular purpose</Typography>
          <Typography component="li">Accuracy, reliability, or completeness of AI-generated content</Typography>
          <Typography component="li">Uninterrupted, secure, or error-free operation</Typography>
          <Typography component="li">Compliance with Meta's evolving policies</Typography>
        </Box>

        <Typography variant="h5" gutterBottom>
          13. Indemnification
        </Typography>
        <Typography variant="body1" paragraph>
          You agree to indemnify and hold harmless Shothik AI from any claims, damages, or expenses arising from:
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li">Your use of the Platform</Typography>
          <Typography component="li">Your advertising campaigns and content</Typography>
          <Typography component="li">Violations of these Terms or applicable laws</Typography>
          <Typography component="li">Violations of Meta's policies</Typography>
          <Typography component="li">Infringement of third-party intellectual property rights</Typography>
        </Box>

        <Typography variant="h5" gutterBottom>
          14. Termination
        </Typography>
        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          14.1 Your Right to Terminate
        </Typography>
        <Typography variant="body1" paragraph>
          You may terminate your account at any time by:
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li">Deleting your account in Platform settings</Typography>
          <Typography component="li">Contacting support@shothik.ai</Typography>
          <Typography component="li">Removing the app from your Facebook account</Typography>
        </Box>

        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          14.2 Our Right to Terminate
        </Typography>
        <Typography variant="body1" paragraph>
          We may suspend or terminate your account if you:
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li">Violate these Terms or Meta's policies</Typography>
          <Typography component="li">Engage in fraudulent or illegal activities</Typography>
          <Typography component="li">Abuse or misuse the Platform</Typography>
          <Typography component="li">Fail to pay applicable fees</Typography>
        </Box>

        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          14.3 Effect of Termination
        </Typography>
        <Typography variant="body1" paragraph>
          Upon termination:
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li">Your access to the Platform will be revoked</Typography>
          <Typography component="li">Your data will be deleted per our deletion policy</Typography>
          <Typography component="li">Active campaigns will continue running in Meta (pause them separately)</Typography>
          <Typography component="li">You remain responsible for any outstanding fees</Typography>
        </Box>

        <Typography variant="h5" gutterBottom>
          15. Governing Law and Disputes
        </Typography>
        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          15.1 Governing Law
        </Typography>
        <Typography variant="body1" paragraph>
          These Terms are governed by the laws of Bangladesh, without regard to conflict of law principles.
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          15.2 Dispute Resolution
        </Typography>
        <Typography variant="body1" paragraph>
          Before filing a lawsuit, you agree to contact us at legal@shothik.ai to attempt to resolve the dispute informally.
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          15.3 Arbitration
        </Typography>
        <Typography variant="body1" paragraph>
          Any disputes that cannot be resolved informally shall be settled through binding arbitration in accordance with applicable arbitration rules.
        </Typography>

        <Typography variant="h5" gutterBottom>
          16. Changes to Terms
        </Typography>
        <Typography variant="body1" paragraph>
          We may update these Terms periodically. Changes will be posted on this page with an updated "Last updated" date. Material changes will be communicated via email or Platform notification.
        </Typography>
        <Typography variant="body1" paragraph>
          Continued use of the Platform after changes take effect constitutes acceptance of the updated Terms.
        </Typography>

        <Typography variant="h5" gutterBottom>
          17. General Provisions
        </Typography>
        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          17.1 Entire Agreement
        </Typography>
        <Typography variant="body1" paragraph>
          These Terms, together with our Privacy Policy, constitute the entire agreement between you and Shothik AI.
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          17.2 Severability
        </Typography>
        <Typography variant="body1" paragraph>
          If any provision of these Terms is found unenforceable, the remaining provisions will remain in full effect.
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          17.3 Waiver
        </Typography>
        <Typography variant="body1" paragraph>
          Our failure to enforce any provision does not constitute a waiver of that provision.
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          17.4 Assignment
        </Typography>
        <Typography variant="body1" paragraph>
          You may not assign these Terms without our consent. We may assign our rights and obligations to any successor or acquirer.
        </Typography>

        <Typography variant="h5" gutterBottom>
          18. Meta-Specific Terms
        </Typography>
        <Typography variant="body1" paragraph>
          Additional terms for Meta platform integration:
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li">You acknowledge that Meta is a third-party beneficiary of these Terms</Typography>
          <Typography component="li">You comply with Meta's Platform Terms and Advertising Policies</Typography>
          <Typography component="li">Meta may enforce provisions related to their platforms directly against you</Typography>
          <Typography component="li">We access Meta data only as permitted by their Platform Terms</Typography>
          <Typography component="li">You understand that Meta's policy changes may affect Platform features</Typography>
        </Box>

        <Typography variant="h5" gutterBottom>
          19. Contact Information
        </Typography>
        <Typography variant="body1" paragraph>
          For questions about these Terms, please contact us:
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li">Email: legal@shothik.ai</Typography>
          <Typography component="li">Support: support@shothik.ai</Typography>
          <Typography component="li">Privacy: privacy@shothik.ai</Typography>
        </Box>

        <Typography variant="body1" paragraph sx={{ mt: 3 }}>
          <strong>Related Documents:</strong> Privacy Policy | Data Deletion Instructions
        </Typography>

        <Typography variant="body1" paragraph sx={{ mt: 3, textAlign: 'center' }}>
          ©️ 2025 Shothik AI. All rights reserved.
        </Typography>

        <Typography variant="body1" paragraph sx={{ mt: 2, fontWeight: 'bold' }}>
          By using this Platform, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
        </Typography>
      </Box>
    </BackgroundContainer>
  );
}
