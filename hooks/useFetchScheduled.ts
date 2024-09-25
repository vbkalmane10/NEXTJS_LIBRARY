import { useState, useEffect } from "react";

const useFetchScheduledEvents = (email: string) => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`/api/calendly/events?email=${email}`);
        const data = await response.json();

        if (response.ok) {
          setEvents(data.events);
        } else {
          setError(data.error || "Failed to load scheduled events.");
        }
        setLoading(false);
      } catch (err) {
        setError("Failed to load scheduled events.");
        setLoading(false);
      }
    };

    fetchEvents();
  }, [email]);

  return { events, loading, error };
};
export default useFetchScheduledEvents;
