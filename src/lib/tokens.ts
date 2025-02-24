"use server";

import { v4 as uuidv4 } from "uuid";
import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { VerificationToken, verificationTokens } from "@/db/schema";

export const generateVerificationToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000); // 1 hour from now

  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    await db
      .delete(verificationTokens)
      .where(eq(verificationTokens.identifier, existingToken.identifier));
  }

  const [verificationToken] = await db
    .insert(verificationTokens)
    .values({
      identifier: email,
      token,
      expires,
    })
    .returning();

  return verificationToken;
};

export const getVerificationTokenByEmail = async (
  email: string,
): Promise<VerificationToken | null> => {
  try {
    const [verificationToken] = await db
      .select()
      .from(verificationTokens)
      .where(eq(verificationTokens.identifier, email))
      .limit(1);

    return verificationToken || null;
  } catch {
    return null;
  }
};

export const getVerificationTokenByToken = async (
  token: string,
): Promise<VerificationToken | null> => {
  try {
    const [verificationToken] = await db
      .select()
      .from(verificationTokens)
      .where(eq(verificationTokens.token, token))
      .limit(1);

    return verificationToken || null;
  } catch {
    return null;
  }
};
