import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/todos/:id
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const todo = await prisma.todo.findUnique({
      where: { id },
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
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch todo",
      },
      { status: 500 },
    );
  }
}

// PATCH /api/todos/:id
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const body = await request.json();

    const todo = await prisma.todo.update({
      where: { id },
      data: body,
    });

    return NextResponse.json({
      success: true,
      message: "Todo updated successfully",
      data: todo,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update todo",
      },
      { status: 500 },
    );
  }
}

// DELETE /api/todos/:id
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    await prisma.todo.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Todo deleted successfully",
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete todo",
      },
      { status: 500 },
    );
  }
}
