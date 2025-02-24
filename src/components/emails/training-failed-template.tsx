import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

// Style declarations
const main = {
  backgroundColor: "#f8fafc",
  fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
};

const container = {
  backgroundColor: "#ffffff",
  margin: "40px auto",
  padding: "32px 24px",
  maxWidth: "600px",
  borderRadius: "12px",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
};

const logo = {
  width: "80px",
  height: "auto",
  display: "block",
  marginBottom: "16px",
};

const tagline = {
  fontSize: "24px",
  lineHeight: "1.4",
  color: "#111827",
  marginBottom: "24px",
  fontWeight: "600",
};

const imageContainer = {
  backgroundColor: "#000000",
  borderRadius: "8px",
  padding: "0",
  marginBottom: "24px",
  textAlign: "center" as const,
  overflow: "hidden",
};

const brandImage = {
  width: "100%",
  height: "auto",
  display: "block",
  margin: "0",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "1.6",
  color: "#4b5563",
  margin: "0 0 16px",
};

const list = {
  margin: "16px 0",
  padding: "0",
  listStyle: "none",
};

const listItem = {
  fontSize: "16px",
  lineHeight: "2",
  color: "#4b5563",
  display: "flex",
  alignItems: "center",
  gap: "8px",
};

const button = {
  backgroundColor: "#111827",
  borderRadius: "6px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 24px",
  margin: "24px 0",
};

const footer = {
  textAlign: "center" as const,
  marginTop: "48px",
};

const socialLinks = {
  display: "flex",
  justifyContent: "center",
  gap: "12px",
  margin: "16px 0",
};

const socialIcon = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: "32px",
  height: "32px",
  backgroundColor: "#f3f4f6",
  borderRadius: "50%",
  color: "#6b7280",
  textDecoration: "none",
};

const footerAddress = {
  fontSize: "12px",
  color: "#6b7280",
  textAlign: "center" as const,
  margin: "16px 0",
};

const footerLinks = {
  fontSize: "12px",
  color: "#6b7280",
  textAlign: "center" as const,
  margin: "8px 0",
};

const footerLink = {
  color: "#6b7280",
  textDecoration: "underline",
};

interface TrainingFailedEmailProps {
  userName?: string;
  modelName: string;
  errorMessage?: string;
  supportUrl: string;
}

export const TrainingFailedEmail = ({
  userName = "",
  modelName,
  errorMessage = "We encountered an unexpected error during the training process.",
  supportUrl,
}: TrainingFailedEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>AI Model Training Failed - Action Required</Preview>
      <Body style={main}>
        {/* Main Content Container */}
        <Container style={container}>
          {/* Logo and Tagline */}
          <Img
            src="https://cdn.kidbooks.fun/logo.png"
            width="200"
            height="200"
            alt="Logo"
            style={logo}
          />
          <Text style={tagline}>Training Failed - Action Required ⚠️</Text>

          {/* Brand Image in Dark Container */}
          <Section style={imageContainer}>
            <Img
              src={`https://cdn.kidbooks.fun/email_banner.png`}
              alt="Brand"
              width="600"
              style={brandImage}
            />
          </Section>

          {/* Message Content */}
          <Text style={paragraph}>Hey {userName},</Text>
          <Text style={paragraph}>
            We&apos;re sorry, but the training process for your AI model &ldquo;
            {modelName}&ldquo; has failed to complete successfully.
          </Text>

          <Text style={paragraph}>
            <strong>Error Details:</strong>
            <br />
            <code
              style={{
                backgroundColor: "#fee2e2",
                padding: "8px 12px",
                borderRadius: "4px",
                color: "#dc2626",
                display: "block",
                margin: "8px 0",
                whiteSpace: "pre-wrap",
              }}
            >
              {errorMessage}
            </code>
          </Text>

          {/* Next Steps */}
          <Text style={paragraph}>Here are the recommended next steps:</Text>
          <ul style={list}>
            <li style={listItem}>
              • Check if your training data meets our requirements
            </li>
            <li style={listItem}>
              • Ensure all images are in the correct format and resolution
            </li>
            <li style={listItem}>
              • Try reducing the number of training images if applicable
            </li>
          </ul>

          {/* Action Button */}
          <Section style={{ textAlign: "center" as const }}>
            <Button
              style={{ ...button, backgroundColor: "#dc2626" }}
              href={supportUrl}
            >
              Contact Support
            </Button>
          </Section>

          <Text style={paragraph}>
            Our support team is here to help you resolve any issues. Don&apos;t
            hesitate to reach out if you need assistance understanding the error
            or starting a new training session.
          </Text>

          <Text style={{ ...paragraph, fontSize: "14px", color: "#6b7280" }}>
            Note: Any credits used for this training attempt will be
            automatically refunded to your account within 24 hours.
          </Text>
        </Container>

        {/* Footer Outside Container */}
        <Container>
          <Section style={footer}>
            <Text style={{ ...paragraph, color: "#6b7280" }}>
              Follow us on:
            </Text>
            <Section style={socialLinks}>
              <Link href="#" style={socialIcon}>
                F
              </Link>
              <Link href="#" style={socialIcon}>
                Y
              </Link>
              <Link href="#" style={socialIcon}>
                I
              </Link>
              <Link href="#" style={socialIcon}>
                L
              </Link>
              <Link href="#" style={socialIcon}>
                D
              </Link>
              <Link href="#" style={socialIcon}>
                T
              </Link>
            </Section>

            {/* Company Address */}
            <Text style={footerAddress}>KidBooks, Bangalore, India</Text>

            {/* Email Preferences */}
            <Text style={footerLinks}>
              <Link href="#" style={footerLink}>
                Manage your email preferences
              </Link>
            </Text>

            {/* Unsubscribe */}
            <Text style={footerLinks}>
              <Link href="#" style={footerLink}>
                Unsubscribe
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default TrainingFailedEmail;
