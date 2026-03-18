import type { Reservation } from "@/types/database";

// Reservation already includes `user: { name: string } | null`
export type ReservationWithUser = Reservation;

