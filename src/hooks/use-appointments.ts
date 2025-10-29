"use client";

import {
  getAppointments,
  getBookedTimeSlots,
  bookAppointment,
  getUserAppointments,
} from "@/lib/actions/appointments";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetAppointments = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["getAppointments"],
    queryFn: getAppointments,
  });

  return { data, isLoading, error };
};

export function useUserAppointments() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["getUserAppointments"],
    queryFn: getUserAppointments,
  });

  return { data, isLoading, error };
}

export const useGetBookedTimeSlots = (doctorId: string, date: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["getBookedTimeSlots"],
    queryFn: () => getBookedTimeSlots(doctorId, date),
    enabled: !!doctorId && !!date,
  });

  return { data, isLoading, error };
};

export const useBookAppointment = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: bookAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getUserAppointments"] });
    },
    onError: (error) => console.error("Failed to book appointment", error),
  });

  return { mutate, isPending };
};
