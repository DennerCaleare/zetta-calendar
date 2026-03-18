import { useEffect, useState } from "react";
import Content from "@/features/dashboard/components/content";
import { getReservations } from "@/features/dashboard/actions";
import { getRooms } from "@/features/settings/actions";
import type { Reservation, Room } from "@/types/database";
import { Spinner } from "@/components/ui/spinner";

export default function DashboardPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    Promise.all([getRooms(), getReservations()])
      .then(([r, res]) => {
        if (cancelled) return;
        setRooms(r);
        setReservations(res);
      })
      .catch(console.error)
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner className="size-8 text-primary" />
      </div>
    );
  }

  return (
    <Content
      rooms={rooms}
      reservations={reservations}
      onRefresh={() => setRefreshKey((k) => k + 1)}
    />
  );
}
