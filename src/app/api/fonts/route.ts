import { NextResponse } from "next/server";

const ONE_WEEK = 60 * 60 * 24 * 7; // seconds

export async function GET() {
  const apiKey = process.env.WEB_FONTS_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Missing API key" }, { status: 500 });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const res = await fetch(
      `https://www.googleapis.com/webfonts/v1/webfonts?key=${apiKey}`,
      {
        next: { revalidate: ONE_WEEK },
        signal: controller.signal,
      }
    );

    clearTimeout(timeout);

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch fonts" },
        { status: res.status }
      );
    }

    const data = await res.json();
    const fonts = data.items.map((f: any) => f.family);

    return NextResponse.json(
      { fonts },
      {
        headers: {
          "Cache-Control": `public, max-age=${ONE_WEEK}, s-maxage=${ONE_WEEK}, stale-while-revalidate=${ONE_WEEK}`,
        },
      }
    );
  } catch (err) {
    clearTimeout(timeout);
    console.error("Error fetching fonts:", err);
    return NextResponse.json(
      { error: "Unable to fetch fonts" },
      { status: 500 }
    );
  }
}

