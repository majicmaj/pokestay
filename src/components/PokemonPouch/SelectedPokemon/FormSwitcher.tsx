import React from "react";
import { ActionButton } from "../../ui/ActionButton";
import { usePokemonVarieties } from "../../../hooks/usePokemonVarieties";
import { Pokemon } from "../../../types";

interface FormSwitcherProps {
  onOpenModal: () => void;
  pokemon: Pokemon;
}

const FormSwitcher: React.FC<FormSwitcherProps> = ({
  onOpenModal,
  pokemon,
}) => {
  const { varieties, isLoading } = usePokemonVarieties(pokemon);

  if (isLoading || varieties.length <= 1) {
    return null;
  }

  return (
    <ActionButton
      onClick={onOpenModal}
      label="Switch Form"
      //   icon={<GitCommitHorizontal />}
      className="w-full"
      disabled={false}
    />
  );
};

export default FormSwitcher;
