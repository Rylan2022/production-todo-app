import { NextResponse } from "next/server";
import { registerSchema } from "@/lib/validations/auth.schema";
import { registerUser } from "@/services/auth.service";
import {
  createSession,
  SESSION_COOKIE,
  SESSION_DURATION_SECONDS,
} from "@/lib/auth/session";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: result.error.flatten().fieldErrors,
        },
        {
          status: 400,
        },
      );
    }

    const user = await registerUser(result.data);

    const session = await createSession(user.id);
    const response = NextResponse.json(
      {
        success: true,
        message: "User registered successfully",
        data: user,
      },
      {
        status: 201,
      },
    );

    response.cookies.set({
      name: SESSION_COOKIE,
      value: session.token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_DURATION_SECONDS,
      expires: session.expiresAt,
    });

    return response;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "EMAIL_ALREADY_EXISTS") {
        return NextResponse.json(
          {
            success: false,
            message: "Email is already registered",
          },
          {
            status: 409,
          },
        );
      }
    }
    console.error("Registration error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      {
        status: 500,
      },
    );
  }
}
