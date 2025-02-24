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
  width: "120px",
  height: "auto",
  display: "block",
  marginBottom: "24px",
};

const tagline = {
  fontSize: "28px",
  lineHeight: "1.4",
  color: "#111827",
  marginBottom: "24px",
  fontWeight: "600",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "1.6",
  color: "#4b5563",
  margin: "0 0 16px",
};

const featureContainer = {
  backgroundColor: "#f9fafb",
  borderRadius: "8px",
  padding: "24px",
  marginBottom: "24px",
};

const featureTitle = {
  fontSize: "18px",
  fontWeight: "600",
  color: "#111827",
  marginBottom: "12px",
};

const featureList = {
  margin: "16px 0",
  padding: "0",
  listStyle: "none",
};

const featureItem = {
  fontSize: "15px",
  lineHeight: "1.6",
  color: "#4b5563",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  marginBottom: "12px",
  paddingLeft: "24px",
  position: "relative" as const,
};

const button = {
  backgroundColor: "#7c3aed",
  borderRadius: "8px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px 24px",
  marginTop: "32px",
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
interface WelcomeEmailProps {
  userName: string;
  dashboardUrl: string;
}

export const WelcomeEmail = ({
  userName = "there",
  dashboardUrl = "https://kidbooks.fun/home",
}: WelcomeEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>
        Welcome to KidBooks - Start Creating Magical Stories! 🌟
      </Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Logo */}
          <Img
            src="https://cdn.kidbooks.fun/logo.png"
            width="200"
            height="200"
            alt="Logo"
            style={logo}
          />

          {/* Welcome Message */}
          <Text style={tagline}>Welcome to KidBooks, {userName}! 🎉</Text>

          <Text style={paragraph}>
            We're thrilled to have you join our creative storytelling community.
            Get ready to embark on an amazing journey of story creation with
            AI-powered tools and beautiful templates.
          </Text>

          {/* Free Features */}
          <Section style={featureContainer}>
            <Text style={featureTitle}>Start Creating with Free Features:</Text>
            <ul style={featureList}>
              <li style={featureItem}>✨ 2 AI Story Generations per month</li>
              <li style={featureItem}>📚 Access to basic story templates</li>
              <li style={featureItem}>
                🎨 Essential design tools and elements
              </li>
              <li style={featureItem}>💾 Save and export your stories</li>
            </ul>
          </Section>

          {/* Premium Features */}
          <Section style={featureContainer}>
            <Text style={featureTitle}>Unlock Premium Features:</Text>
            <ul style={featureList}>
              <li style={featureItem}>🤖 Train custom AI models</li>
              <li style={featureItem}>🎯 Unlimited story generations</li>
              <li style={featureItem}>🎨 Premium templates for all ages</li>
              <li style={featureItem}>✨ Advanced customization tools</li>
            </ul>
          </Section>

          {/* Getting Started */}
          <Text style={paragraph}>
            Ready to create your first story? We've made it super easy to get
            started:
          </Text>
          <ul style={featureList}>
            <li style={featureItem}>
              1. Choose a template or start from scratch
            </li>
            <li style={featureItem}>2. Customize characters and settings</li>
            <li style={featureItem}>3. Generate AI-powered content</li>
            <li style={featureItem}>4. Share your magical creation!</li>
          </ul>

          {/* CTA Button */}
          <Button style={button} href={dashboardUrl}>
            Start Creating Your Story
          </Button>

          {/* Footer */}
          <Section style={footer}>
            <Text style={{ ...paragraph, fontSize: "14px", color: "#6b7280" }}>
              Need help getting started? Check out our{" "}
              <Link
                href="https://kidbooks.fun/tutorials"
                style={{ color: "#7c3aed" }}
              >
                tutorials
              </Link>{" "}
              or reach out to our{" "}
              <Link
                href="mailto:support@kidbooks.fun"
                style={{ color: "#7c3aed" }}
              >
                support team
              </Link>
              .
            </Text>
          </Section>
        </Container>
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

export default WelcomeEmail;
