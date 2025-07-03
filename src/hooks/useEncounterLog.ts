import { EncounterLogEntry } from "../types";
import useLocalStorageState from "./useLocalStorageState";

const useEncounterLog = () => {
  const [log, setLog] = useLocalStorageState<EncounterLogEntry[]>(
    "encounter_log",
    []
  );

  const addEntry = (entry: EncounterLogEntry) => {
    setLog((prevLog) => [entry, ...prevLog]);
  };

  return { log, addEntry };
};

export default useEncounterLog;
