import { NextResponse } from "next/server";

export const jsonResponse = (data: object, statusCode: number) => {
  return new NextResponse(JSON.stringify(data), {
    status: statusCode,
    headers: { "Content-Type": "application/json" },
  });
};
