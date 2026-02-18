import { extractLocationData } from "@/backend/gpx/extractLocationData";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const formData = await req.formData();
  const startDate = formData.get("startDate");
  const fastForward = formData.get("fastForward");
  const startTime = formData.get("startTime");
  const file = formData.get("file");

  const results = await extractLocationData(
    file as File,
    startTime as string,
    fastForward as string
  );

  return NextResponse.json({ ...results, startDate }, { status: 200 });
}
