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

interface TrainingCompletedEmailProps {
  userName?: string;
  modelName: string;
  modelId: string;
  dashboardUrl: string;
}

export const TrainingCompletedEmail = ({
  userName = "",
  modelName,
  dashboardUrl,
}: TrainingCompletedEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Your AI Model Training is Complete! 🎉</Preview>
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
          <Text style={tagline}>Your AI Model Training is Complete! 🎉</Text>

          {/* Brand Image in Dark Container */}
          <Section style={imageContainer}>
            <Img
              src={`https://cdn.kidbooks.fun/email_banner.png`}
              alt="Brand"
              width="600"
              style={brandImage}
            />
          </Section>

          {/* Welcome Message */}
          <Text style={paragraph}>Hey {userName},</Text>
          <Text style={paragraph}>
            Great news! Your AI model &ldquo;{modelName}&ldquo; has been
            successfully trained and is now ready to use.
          </Text>

          {/* Resources List */}
          <Text style={paragraph}>
            Here{" "}
            <Text style={paragraph}>Here&apos;s what you can do next:</Text>s
            what you can do next:
          </Text>
          <ul style={list}>
            <li style={listItem}>
              • View your model details and start generating images
            </li>
            <li style={listItem}>• Share your model with your team members</li>
            <li style={listItem}>
              • Create variations using different prompts
            </li>
          </ul>

          {/* Action Button */}
          <Section style={{ textAlign: "center" as const }}>
            <Button style={button} href={dashboardUrl}>
              View Your Model
            </Button>
          </Section>

          {/* <Text style={paragraph}>
            Model ID:{" "}
            <code
              style={{
                backgroundColor: "#f3f4f6",
                padding: "2px 4px",
                borderRadius: "4px",
              }}
            >
              {modelId}
            </code>
          </Text> */}

          <Text style={paragraph}>
            If you have any questions or need assistance, don&apos;t hesitate to
            reach out to our support team.
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

export default TrainingCompletedEmail;
