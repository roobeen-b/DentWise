"use client";

import { addDoctor, updateDoctor, getDoctors } from "@/lib/actions/doctors";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetDoctors = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["getDoctors"],
    queryFn: getDoctors,
  });

  return { data, isLoading, error };
};

export const useAddDoctor = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: addDoctor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getDoctors"] });
    },
  });

  return { mutate, isPending };
};

export const useUpdateDoctor = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: updateDoctor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getDoctors"] });
    },
  });

  return { mutate, isPending };
};
