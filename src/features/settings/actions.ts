import { supabase } from "@/lib/supabase";
import { mapRoom, type Room } from "@/types/database";

export async function getRooms(): Promise<Room[]> {
  const { data, error } = await supabase
    .from("rooms")
    .select("*")
    .order("created_at");

  if (error) throw error;
  return (data ?? []).map(mapRoom);
}

export async function createRoom(): Promise<void> {
  const { error } = await supabase.from("rooms").insert({
    name: "Nova Sala",
    capacity: 6,
    resources: [],
  });
  if (error) throw error;
}

export async function updateRoom(
  roomId: string,
  data: { name: string; capacity: number; resources: string[] },
): Promise<void> {
  const { error } = await supabase
    .from("rooms")
    .update({ name: data.name, capacity: data.capacity, resources: data.resources })
    .eq("id", roomId);
  if (error) throw error;
}

export async function deleteRoom(roomId: string): Promise<void> {
  const { error } = await supabase.from("rooms").delete().eq("id", roomId);
  if (error) throw error;
}

