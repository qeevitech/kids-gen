import { Role } from "@prisma/client";
import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: Role;
    } & DefaultSession["user"];
  }

  interface User {
    role: Role;
  }

  interface JWT {
    role?: Role;
  }
}
