"use server";
import { Resend } from "resend";
import { TrainingCompletedEmail } from "@/components/emails/training-completed-template";
import { TrainingFailedEmail } from "@/components/emails/training-failed-template";

const resend = new Resend(process.env.RESEND_API_KEY!);

// const domain = process.env.NEXT_PUBLIC_APP_URL!;

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
      from: "AI Training <no-reply@yourdomain.com>",
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
