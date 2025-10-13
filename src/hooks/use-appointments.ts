"use client";

import { getAppointments } from "@/lib/actions/appointments";
import { useQuery } from "@tanstack/react-query";

export const useGetAppointments = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["getAppointments"],
    queryFn: getAppointments,
  });

  return { data, isLoading, error };
};
