import { useEffect, useState } from "react";
import Content from "@/features/settings/components/content";
import { getRooms } from "@/features/settings/actions";
import { getUsers } from "@/features/settings/user";
import type { Room, Profile } from "@/types/database";
import { Spinner } from "@/components/ui/spinner";

export default function SettingsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    Promise.all([getRooms(), getUsers()])
      .then(([r, u]) => {
        if (cancelled) return;
        setRooms(r);
        setUsers(u);
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
      users={users}
      onRefresh={() => setRefreshKey((k) => k + 1)}
    />
  );
}
