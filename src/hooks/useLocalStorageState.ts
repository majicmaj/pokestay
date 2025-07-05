import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

// Utility to get the value from local storage
const getLocalStorageValue = <T>(key: string, defaultValue: T): T => {
  const stickyValue = window.localStorage.getItem(key);
  if (stickyValue) {
    try {
      return JSON.parse(stickyValue);
    } catch (error) {
      console.error("Error parsing JSON from localStorage", error);
      return defaultValue;
    }
  }
  return defaultValue;
};

// Utility to set the value in local storage
const setLocalStorageValue = <T>(key: string, value: T) => {
  window.localStorage.setItem(key, JSON.stringify(value));
};

// Custom hook to interact with local storage using React Query
export const useLocalStorageState = <T>(key: string, defaultValue: T) => {
  const queryClient = useQueryClient();

  const { data } = useQuery<T>({
    queryKey: [key],
    queryFn: () => getLocalStorageValue(key, defaultValue),
    initialData: () => getLocalStorageValue(key, defaultValue),
    staleTime: Infinity,
  });

  const mutation = useMutation<void, Error, T>({
    mutationFn: async (newValue: T) => {
      setLocalStorageValue(key, newValue);
    },
    onSuccess: (_data, variables) => {
      queryClient.setQueryData([key], variables);
    },
  });

  const setValue = useCallback(
    (newValue: T | ((val: T) => T)) => {
      const valueToStore =
        newValue instanceof Function ? newValue(data as T) : newValue;
      mutation.mutate(valueToStore);
    },
    [data, mutation]
  );

  return [data as T, setValue] as const;
};

export default useLocalStorageState;
