import { INITIAL_STATE } from "../constants";
import useLocalStorageState from "./useLocalStorageState";

const useGameState = () =>  useLocalStorageState('gamestate', INITIAL_STATE)

export default useGameState