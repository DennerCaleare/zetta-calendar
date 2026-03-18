import { supabase } from "@/lib/supabase";
import { mapReservation, mapRoom, type Reservation } from "@/types/database";

export async function getReservations(): Promise<Reservation[]> {
  const { data, error } = await supabase
    .from("reservations")
    .select("*, rooms(*), profiles(name)")
    .order("start_time");

  if (error) throw error;
  return (data ?? []).map(mapReservation);
}

interface ReservationInput {
  id?: string;
  roomId: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
}

export async function saveReservationAction(input: ReservationInput) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autorizado");

  // Check conflicts
  let conflictQuery = supabase
    .from("reservations")
    .select("id")
    .eq("room_id", input.roomId)
    .eq("status", "ACTIVE")
    .lt("start_time", input.endTime)
    .gt("end_time", input.startTime);

  if (input.id) conflictQuery = conflictQuery.neq("id", input.id);

  const { data: conflicts } = await conflictQuery;
  if (conflicts && conflicts.length > 0) {
    throw new Error("Já existe uma reserva nesse horário");
  }

  if (input.id) {
    const { error } = await supabase
      .from("reservations")
      .update({
        title: input.title,
        description: input.description ?? null,
        room_id: input.roomId,
        start_time: input.startTime,
        end_time: input.endTime,
      })
      .eq("id", input.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from("reservations").insert({
      title: input.title,
      description: input.description ?? null,
      room_id: input.roomId,
      start_time: input.startTime,
      end_time: input.endTime,
      user_id: user.id,
      status: "ACTIVE",
    });
    if (error) throw error;
  }
}

export async function cancelReservationAction(id: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autorizado");

  const { data: reservation } = await supabase
    .from("reservations")
    .select("id, user_id, status")
    .eq("id", id)
    .single();

  if (!reservation) throw new Error("Reserva não encontrada");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const isOwner = reservation.user_id === user.id;
  const isAdmin = profile?.role === "ADMIN";

  if (!isOwner && !isAdmin)
    throw new Error("Você não tem permissão para cancelar esta reserva");

  if (reservation.status === "CANCELLED")
    throw new Error("Esta reserva já está cancelada");

  const { error } = await supabase
    .from("reservations")
    .update({ status: "CANCELLED" })
    .eq("id", id);

  if (error) throw error;
}

export { mapRoom };

