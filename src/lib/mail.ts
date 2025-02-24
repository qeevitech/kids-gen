"use server";
import { Resend } from "resend";
import { TrainingCompletedEmail } from "@/components/emails/training-completed-template";
import { TrainingFailedEmail } from "@/components/emails/training-failed-template";
import { WelcomeEmail } from "@/components/emails/welcome-template";
import { VerificationEmail } from "@/components/emails/verification-template";

const resend = new Resend(process.env.RESEND_API_KEY!);

const domain = process.env.NEXT_PUBLIC_APP_URL!;

export async function sendTrainingCompletedEmail(
  to: string,
  userName: string,
  modelName: string,
) {
  try {
    await resend.emails.send({
      from: "AI Training <no-reply@kidbooks.fun>",
      to: [to],
      subject: "Your AI Model Training is Complete! 🎉",
      react: TrainingCompletedEmail({
        userName,
        modelName,
        modelId: `${userName}_${modelName}`,
        dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL}/models`,
      }),
    });
  } catch (error) {
    console.error("Error sending completion email:", error);
  }
}

export async function sendTrainingFailedEmail(
  to: string,
  userName: string,
  modelName: string,
) {
  try {
    await resend.emails.send({
      from: "AI Training <no-reply@kidbooks.fun>",
      to: [to],
      subject: "AI Model Training Failed - Action Required",
      react: TrainingFailedEmail({
        userName,
        modelName,
        errorMessage: "Training process failed to complete successfully",
        supportUrl: `${process.env.NEXT_PUBLIC_APP_URL}/support`,
      }),
    });
  } catch (error) {
    console.error("Error sending failure email:", error);
  }
}

export async function sendWelcomeEmail(to: string, userName: string) {
  try {
    await resend.emails.send({
      from: "AI Training <no-reply@kidbooks.fun>",
      to: [to],
      subject: "Welcome to KidBooks - Start Creating Magical Stories! 🌟",
      react: WelcomeEmail({
        userName,
        dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL}/home`,
      }),
    });
  } catch (error) {
    console.error("Error sending failure email:", error);
  }
}

export const sendVerificationEmail = async (email: string, token: string) => {
  try {
    const confirmLink = `${domain}/auth/new-verification?token=${token}`;

    await resend.emails.send({
      from: "KidBooks <no-reply@kidbooks.fun>",
      to: [email],
      subject: "Verify your email address",
      react: VerificationEmail({ confirmLink }),
    });
  } catch (error) {
    console.error("Error sending verification email:", error);
  }
};
