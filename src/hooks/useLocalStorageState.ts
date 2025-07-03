import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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

  const { data = defaultValue } = useQuery<T>({
    queryKey: [key],
    queryFn: () => getLocalStorageValue(key, defaultValue),
  });

  const mutation = useMutation<void, Error, T>({
    mutationFn: async (newValue: T) => {
      setLocalStorageValue(key, newValue);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [key] });
    },
  });

  const setValue = (newValue: T | ((val: T) => T)) => {
    const valueToStore =
      newValue instanceof Function ? newValue(data) : newValue;
    mutation.mutate(valueToStore);
  };

  return [data, setValue] as [T, (newValue: T | ((val: T) => T)) => void];
};

export default useLocalStorageState;
