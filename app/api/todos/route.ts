import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/session";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      {
        success: false,
        message: "Authentication required",
      },
      { status: 401 },
    );
  }

  const todos = await prisma.todo.findMany({
    where: user.role === "ADMIN"
      ? undefined
      : {
          userId: user.id,
        },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json({
    success: true,
    data: todos,
  });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      {
        success: false,
        message: "Authentication required",
      },
      { status: 401 },
    );
  }

  try {
    const body = await request.json();

    if (!body.title || typeof body.title !== "string") {
      return NextResponse.json(
        {
          success: false,
          message: "Title is required",
        },
        { status: 400 },
      );
    }

    const todo = await prisma.todo.create({
      data: {
        title: body.title,
        description:
          typeof body.description === "string"
            ? body.description
            : null,

        // Never use body.userId here.
        userId: user.id,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Todo created successfully",
        data: todo,
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create todo",
      },
      { status: 500 },
    );
  }
}