import { jwtVerify } from "jose";

const secretKey = process.env.SESSION_SECRET;

const encodedKey = secretKey
  ? new TextEncoder().encode(secretKey)
  : undefined;

export async function decryptSession(session: string | undefined) {
  if (!session || !encodedKey) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });

    return {
      userId: payload.userId as string,
      email: payload.email as string,
    };
  } catch {
    return null;
  }
}
