import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Utility to get the value from local storage
const getLocalStorageValue = (key: string, defaultValue: any) => {
  const stickyValue = window.localStorage.getItem(key);
  return stickyValue !== null ? JSON.parse(stickyValue) : defaultValue;
};

// Utility to set the value in local storage
const setLocalStorageValue = (key: string, value: any) => {
  window.localStorage.setItem(key, JSON.stringify(value));
};

// Custom hook to interact with local storage using React Query
export const useLocalStorageState = (key: string, defaultValue: any) => {
  const queryClient = useQueryClient();
  const existingValue = getLocalStorageValue(key, defaultValue);

  // console.log({
  //     existingValue,
  //     key,
  //     defaultValue
  // })

  // Query to read the value
  const query = useQuery({
    queryKey: [key],
    queryFn: () => getLocalStorageValue(key, defaultValue),
    initialData: existingValue,
  });
  const { data } = query;

  // Mutation to update the value
  const mutation = useMutation({
    mutationFn: (newValue: any) => {
      setLocalStorageValue(key, newValue);
      return newValue;
    },
  });

  // Function to update the value and invalidate the query
  const setValue = (newValue: any) => {
    mutation.mutate(newValue, {
      onSuccess: () => {
        // Invalidate the query to notify all consumers of the update
        queryClient.invalidateQueries({
          queryKey: [key],
        });
      },
    });
  };

  return [data, setValue, query] as const;
};

export default useLocalStorageState;
