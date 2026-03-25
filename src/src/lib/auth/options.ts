import type { NextAuthOptions, Session } from "next-auth";
import type { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";

/** Extended session user with role/permission data */
export interface SessionUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  defaultLocationId: string | null;
  permissions: string[];
}

export interface ExtendedSession extends Session {
  user: SessionUser;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email, deletedAt: null },
          include: {
            profile: true,
            roleAssignments: {
              where: { revokedAt: null },
              include: { role: { include: { permissions: { include: { permission: true } } } } },
            },
          },
        });

        if (!user || user.status !== "ACTIVE") return null;

        // Check lockout
        if (user.lockedUntil && user.lockedUntil > new Date()) return null;

        const passwordValid = await compare(credentials.password, user.passwordHash);
        if (!passwordValid) {
          // Increment failed login count
          const newCount = user.failedLoginCount + 1;
          await prisma.user.update({
            where: { id: user.id },
            data: {
              failedLoginCount: newCount,
              lockedUntil: newCount >= 5 ? new Date(Date.now() + 30 * 60 * 1000) : null,
            },
          });
          return null;
        }

        // Reset failed count on success
        await prisma.user.update({
          where: { id: user.id },
          data: { failedLoginCount: 0, lockedUntil: null, lastLoginAt: new Date() },
        });

        // Collect roles and permissions
        const roles = user.roleAssignments.map((ra) => ra.role.name);
        const permissionSet = new Set<string>();
        for (const ra of user.roleAssignments) {
          for (const rp of ra.role.permissions) {
            permissionSet.add(rp.permission.code);
          }
        }

        return {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          roles,
          defaultLocationId: user.profile?.defaultLocationId ?? null,
          permissions: Array.from(permissionSet),
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    maxAge: 24 * 60 * 60,
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as unknown as SessionUser;
        token["id"] = u.id;
        token["roles"] = u.roles;
        token["defaultLocationId"] = u.defaultLocationId;
        token["permissions"] = u.permissions;
        token["firstName"] = u.firstName;
        token["lastName"] = u.lastName;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      const extended = session as ExtendedSession;
      extended.user = {
        id: token["id"] as string,
        email: token["email"] as string,
        firstName: token["firstName"] as string,
        lastName: token["lastName"] as string,
        roles: token["roles"] as string[],
        defaultLocationId: token["defaultLocationId"] as string | null,
        permissions: token["permissions"] as string[],
      };
      return extended;
    },
  },
};
