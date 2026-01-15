import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const id = body.id || body._id || body.userId;
    if (!id) return NextResponse.json({ error: "Missing id in body" }, { status: 400 });

    const { benefit, free_play_hours, overnight_rentals_used, is_active } = body;
    const usersCollection = await getCollection("users");

    // Convert to ObjectId if valid hex string; MongoDB requires ObjectId for updates
    let query: any = { _id: id };
    try {
      if (ObjectId.isValid(id)) {
        query = { _id: new ObjectId(id) };
        console.debug('admin-new users update: converted id to ObjectId');
      }
    } catch (e) {
      console.error('Failed to convert to ObjectId, using string id:', e);
    }

    // Handle hard delete when is_active is explicitly false
    if (is_active === false) {
      console.debug('admin-new users delete query:', JSON.stringify(query));
      const deleteResult = await usersCollection.deleteOne(query);
      if (deleteResult.deletedCount === 0) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      return NextResponse.json({ message: "Deleted" });
    }

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
      // Only reset usage counters if benefit changed AND user didn't explicitly provide new values
      if (typeof free_play_hours === "undefined") update.free_play_hours = 0;
      if (typeof overnight_rentals_used === "undefined") update.overnight_rentals_used = 0;
    }

    console.debug('admin-new users update query:', JSON.stringify(query));
    console.debug('admin-new users update object:', JSON.stringify(update));
    // log whether a matching user exists before update
    let existing = null;
    try {
      existing = await usersCollection.findOne(query, { projection: { password_hash: 0 } });
      console.debug('admin-new users update found before update:', existing ? 'yes' : 'no');
    } catch (e) {
      console.error('findOne check failed', e);
    }

    let result: any = null;
    try {
      result = await usersCollection.findOneAndUpdate(query, { $set: update }, { returnDocument: "after" });
      console.debug('findOneAndUpdate result:', result ? 'success' : 'null', result);
    } catch (updateErr) {
      console.error('findOneAndUpdate threw error:', updateErr);
    }

    // MongoDB returns either { value: doc } or doc directly depending on driver version
    const updatedUser = result && (result.value || result);
    if (!updatedUser) {
      console.error('findOneAndUpdate returned no result; query:', JSON.stringify(query), 'result:', result);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Updated", user: updatedUser });
  } catch (err) {
    console.error("PATCH admin-new users update error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
