import { INITIAL_STATE } from "../constants";
import { GameState } from "../types";
import useLocalStorageState from "./useLocalStorageState";

const useGameState = () =>
  useLocalStorageState<GameState>("gamestate", INITIAL_STATE);

export default useGameState;
