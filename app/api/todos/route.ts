import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/todos
export async function GET() {
  try {
    const todos = await prisma.todo.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: todos,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch todos",
      },
      { status: 500 },
    );
  }
}

// POST /api/todos
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { title, description, userId } = body;

    if (!title || !userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Title and userId are required",
        },
        { status: 400 },
      );
    }

    const todo = await prisma.todo.create({
      data: {
        title,
        description,
        userId,
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
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 },
    );
  }
}
