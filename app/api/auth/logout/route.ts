import { NextResponse } from "next/server";
import {
  deleteCurrentSession,
  SESSION_COOKIE,
} from "@/lib/auth/session";

export async function POST() {
  await deleteCurrentSession();

  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully",
  });

  response.cookies.set({
    name: SESSION_COOKIE,
    value: "",
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });

  return response;
}