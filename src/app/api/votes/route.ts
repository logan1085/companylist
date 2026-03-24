import { auth } from "@clerk/nextjs/server";
import { getSupabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const supabase = getSupabase();
    const { searchParams } = new URL(req.url);
    const companyId = searchParams.get("companyId");

    const { data: counts } = await supabase.rpc("get_vote_counts", {
      p_company_id: companyId ?? undefined,
    });

    const { userId } = await auth();
    let userVotes: Record<string, number> = {};

    if (userId) {
      const query = supabase
        .from("votes")
        .select("company_id, value")
        .eq("user_id", userId);
      if (companyId) query.eq("company_id", companyId);
      const { data } = await query;
      if (data) {
        userVotes = Object.fromEntries(data.map((v: { company_id: string; value: number }) => [v.company_id, v.value]));
      }
    }

    return NextResponse.json({ counts: counts ?? [], userVotes });
  } catch {
    return NextResponse.json({ counts: [], userVotes: {} });
  }
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = getSupabase();
    const { companyId, value } = (await req.json()) as {
      companyId: string;
      value: 1 | -1;
    };

    const { data: existing } = await supabase
      .from("votes")
      .select("id, value")
      .eq("user_id", userId)
      .eq("company_id", companyId)
      .maybeSingle();

    if (existing) {
      if (existing.value === value) {
        await supabase.from("votes").delete().eq("id", existing.id);
      } else {
        await supabase.from("votes").update({ value }).eq("id", existing.id);
      }
    } else {
      await supabase.from("votes").insert({ user_id: userId, company_id: companyId, value });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "DB not configured" }, { status: 503 });
  }
}
