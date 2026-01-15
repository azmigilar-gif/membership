import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: paramId } = await params;
    let id = paramId;
    // fallback: try to extract id from the request URL if params is not provided
    if (!id) {
      try {
        const url = new URL(request.url);
        const parts = url.pathname.split("/").filter(Boolean);
        id = parts[parts.length - 1];
      } catch (e) {
        console.error("Failed to parse request.url for id", e);
      }
    }

    if (!id) {
      console.error("PATCH missing id; params:", params, "request.url:", request.url);
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    if (!ObjectId.isValid(id)) {
      console.error("Invalid ObjectId", id);
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const body = await request.json();
    const { benefit, free_play_hours, overnight_rentals_used } = body;

    const usersCollection = await getCollection("users");

    const update: any = { updated_at: new Date() };

    if (typeof free_play_hours !== "undefined") update.free_play_hours = Number(free_play_hours);
    if (typeof overnight_rentals_used !== "undefined") update.overnight_rentals_used = Number(overnight_rentals_used);

    let resetExpiry = false;
    if (typeof benefit !== "undefined") {
      update.benefit = benefit;
      resetExpiry = true;
    }

    if (resetExpiry) {
      const now = new Date();
      const expiry = new Date(now);
      expiry.setDate(now.getDate() + 30);
      update.subscription_start = now;
      update.subscription_expiry = expiry;
      update.subscription_status = "active";
      // clear old usage counters when tier changes
      update.free_play_hours = 0;
      update.overnight_rentals_used = 0;
    }

    // Try updating using ObjectId first, then fallback to string _id
    const filters = [] as any[];
    try {
      if (ObjectId.isValid(id)) filters.push({ _id: new ObjectId(id) });
    } catch (e) {
      // ignore
    }
    filters.push({ _id: id });

    let result: any = null;
    for (const filter of filters) {
      try {
        result = await usersCollection.findOneAndUpdate(filter, { $set: update }, { returnDocument: "after" });
        if (result && result.value) break;
      } catch (e) {
        console.error("findOneAndUpdate attempt failed for filter", filter, e);
      }
    }

    if (!result || !result.value) {
      console.error("User not found for id", id, "tried filters", filters);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Updated", user: result.value });
  } catch (err) {
    console.error("PATCH admin user error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const usersCollection = await getCollection("users");
    // Try ObjectId then string id
    let user: any = null;
    const getFilters = [] as any[];
    try {
      if (ObjectId.isValid(id)) getFilters.push({ _id: new ObjectId(id) });
    } catch (e) {}
    getFilters.push({ _id: id });

    for (const f of getFilters) {
      try {
        user = await usersCollection.findOne(f, { projection: { password_hash: 0 } });
        if (user) break;
      } catch (e) {
        console.error("findOne attempt failed for filter", f, e);
      }
    }

    if (!user) {
      console.error("GET user not found for id", id, "tried", getFilters);
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (err) {
    console.error("GET admin user error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
