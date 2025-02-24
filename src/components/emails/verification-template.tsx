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

interface VerificationEmailProps {
  confirmLink: string;
}

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

const header = {
  textAlign: "center" as const,
  padding: "20px 0",
};

const logo = {
  width: "80px",
  height: "auto",
  display: "block",
  marginBottom: "16px",
};

const heading = {
  fontSize: "24px",
  lineHeight: "1.3",
  fontWeight: "700",
  color: "#1a1a1a",
  margin: "0 0 24px",
  textAlign: "center" as const,
};

const section = {
  backgroundColor: "#f9fafb",
  borderRadius: "8px",
  padding: "24px",
  marginBottom: "24px",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "1.5",
  color: "#4b5563",
  margin: "0 0 16px",
};

const button = {
  backgroundColor: "#7c3aed",
  borderRadius: "8px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px 24px",
  margin: "32px auto",
  maxWidth: "240px",
  transition: "background-color 0.2s ease-in-out",
};

const footerText = {
  fontSize: "14px",
  lineHeight: "1.5",
  color: "#6b7280",
  textAlign: "center" as const,
  margin: "0 0 8px",
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

export const VerificationEmail = ({ confirmLink }: VerificationEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Verify your email to start creating magical stories! ✨</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src="https://cdn.kidbooks.fun/logo.png"
            width="200"
            height="200"
            alt="Logo"
            style={logo}
          />
          <Text style={heading}>Welcome to KidBooks! 🎉</Text>

          <Section style={section}>
            <Text style={paragraph}>
              You're just one step away from unleashing your creativity! Please
              verify your email address to start creating amazing stories.
            </Text>

            <Button style={button} href={confirmLink}>
              Verify Email Address
            </Button>

            <Text style={paragraph}>
              With KidBooks, you'll get:
              <br />• Free story generations every month
              <br />• Access to basic templates and tools
              <br />• Ability to create and share your stories
              <br />• Option to train custom AI models
            </Text>
          </Section>

          <Text style={footerText}>
            This verification link will expire in 1 hour. If you need a new
            verification link, please sign in again to receive a new one.
          </Text>

          <Text style={footerText}>
            If you didn't create an account with KidBooks, you can safely ignore
            this email.
          </Text>

          <Section style={footer}>
            <Text style={footerText}>
              If the button doesn't work, copy and paste this link:
            </Text>
            <Text style={{ ...footerText, wordBreak: "break-all" }}>
              <Link
                href={confirmLink}
                style={{ color: "#7c3aed", textDecoration: "underline" }}
              >
                {confirmLink}
              </Link>
            </Text>
          </Section>
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
export default VerificationEmail;
