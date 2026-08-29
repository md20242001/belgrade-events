import * as jwt from "jsonwebtoken";

export const AUTH_COOKIE = "auth";

function getJwtSecret() {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error("Missing JWT_SECRET in environment variables");
    }

    return secret;
}

export type JwtUserClaims = {
    sub: string;
    email: string;
    firstname?: string;
    lastname?: string;
    dateOfBirth?: string;
    role: "user" | "admin";
};

export function signAuthToken(claims: JwtUserClaims) {
    return jwt.sign(claims, getJwtSecret(), {
        algorithm: "HS256",
        expiresIn: "7d",
    });
}

export function verifyAuthToken(token: string): JwtUserClaims {
    const payload = jwt.verify(
        token,
        getJwtSecret(),
    ) as jwt.JwtPayload & JwtUserClaims;

    if (
        !payload ||
        !payload.sub ||
        !payload.email ||
        (payload.role !== "user" && payload.role !== "admin")
    ) {
        throw new Error("Invalid token");
    }

    return {
        sub: payload.sub,
        email: payload.email,
        firstname: payload.firstname,
        lastname: payload.lastname,
        dateOfBirth: payload.dateOfBirth,
        role: payload.role,
    };
}

export function cookieOpts() {
    return {
        httpOnly: true,
        sameSite: "lax" as const,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
    };
}