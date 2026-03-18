// Application-level types that the UI uses (camelCase)

export type UserRole = "USER" | "ADMIN";
export type ReservationStatus = "ACTIVE" | "CANCELLED";

export interface Room {
  id: string;
  name: string;
  capacity: number;
  resources: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Reservation {
  id: string;
  title: string;
  description?: string | null;
  startTime: Date;
  endTime: Date;
  status: ReservationStatus;
  roomId: string;
  userId?: string | null;
  room?: Room;
  user?: { name: string } | null;
}

export interface Profile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

// Supabase raw row shapes (snake_case returned by PostgREST)
export interface RoomRow {
  id: string;
  name: string;
  capacity: number;
  resources: string[];
  created_at: string;
  updated_at: string;
}

export interface ReservationRow {
  id: string;
  title: string;
  description?: string | null;
  start_time: string;
  end_time: string;
  status: string;
  room_id: string;
  user_id: string | null;
  rooms?: RoomRow | null;
  profiles?: { name: string } | null;
}

export function mapRoom(row: RoomRow): Room {
  return {
    id: row.id,
    name: row.name,
    capacity: row.capacity,
    resources: row.resources ?? [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapReservation(row: ReservationRow): Reservation {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    startTime: new Date(row.start_time),
    endTime: new Date(row.end_time),
    status: row.status as ReservationStatus,
    roomId: row.room_id,
    userId: row.user_id,
    room: row.rooms ? mapRoom(row.rooms) : undefined,
    user: row.profiles ? { name: row.profiles.name } : null,
  };
}
