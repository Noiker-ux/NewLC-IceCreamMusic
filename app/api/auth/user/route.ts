import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: Request) {
  const data = await req.json();
  return Response.json(data);
}
