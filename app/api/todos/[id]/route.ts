import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/session";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(
  request: Request,
  { params }: RouteContext,
) {
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

  const { id } = await params;

  const todo = await prisma.todo.findFirst({
    where: {
      id,
      ...(user.role === "ADMIN" ? {} : { userId: user.id }),
    },
  });

  if (!todo) {
    return NextResponse.json(
      {
        success: false,
        message: "Todo not found",
      },
      { status: 404 },
    );
  }

  return NextResponse.json({
    success: true,
    data: todo,
  });
}

export async function PATCH(
  request: Request,
  { params }: RouteContext,
) {
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

  const { id } = await params;
  const body = await request.json();

  const protectedFields = ["id", "userId", "createdAt", "updatedAt"];

  const attemptedProtectedChange = protectedFields.some((field) =>
    Object.prototype.hasOwnProperty.call(body, field),
  );

  if (attemptedProtectedChange) {
    return NextResponse.json(
      {
        success: false,
        message: "Protected fields cannot be changed",
      },
      { status: 400 },
    );
  }

  const todo = await prisma.todo.findFirst({
    where: {
      id,
      ...(user.role === "ADMIN" ? {} : { userId: user.id }),
    },
  });

  if (!todo) {
    return NextResponse.json(
      {
        success: false,
        message: "Todo not found",
      },
      { status: 404 },
    );
  }

  const allowedData: {
    title?: string;
    description?: string | null;
    completed?: boolean;
  } = {};

  if (body.title !== undefined) {
    if (typeof body.title !== "string" || body.title.trim() === "") {
      return NextResponse.json(
        {
          success: false,
          message: "Title must be a non-empty string",
        },
        { status: 400 },
      );
    }

    allowedData.title = body.title;
  }

  if (body.description !== undefined) {
    if (
      body.description !== null &&
      typeof body.description !== "string"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Description must be a string or null",
        },
        { status: 400 },
      );
    }

    allowedData.description = body.description;
  }

  if (body.completed !== undefined) {
    if (typeof body.completed !== "boolean") {
      return NextResponse.json(
        {
          success: false,
          message: "Completed must be a boolean",
        },
        { status: 400 },
      );
    }

    allowedData.completed = body.completed;
  }

  const updatedTodo = await prisma.todo.update({
    where: {
      id: todo.id,
    },
    data: allowedData,
  });

  return NextResponse.json({
    success: true,
    message: "Todo updated successfully",
    data: updatedTodo,
  });
}

export async function DELETE(
  request: Request,
  { params }: RouteContext,
) {
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

  const { id } = await params;

  const todo = await prisma.todo.findFirst({
    where: {
      id,
      ...(user.role === "ADMIN" ? {} : { userId: user.id }),
    },
  });

  if (!todo) {
    return NextResponse.json(
      {
        success: false,
        message: "Todo not found",
      },
      { status: 404 },
    );
  }

  await prisma.todo.delete({
    where: {
      id: todo.id,
    },
  });

  return NextResponse.json({
    success: true,
    message: "Todo deleted successfully",
  });
}