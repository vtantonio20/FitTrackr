import { useEffect, useState } from "react";


export const useSelectionModal = (selections:string[], numeric?: number[] , isOpen?:boolean) => {
  const [modalOpen, setModalOpen] = useState(isOpen || false);
  const [selected, setSelected] = useState(selections[0])
  const [numericValue, setNumericValue] = useState(numeric ? numeric[0] : undefined);
  const [update, toggleUpdate] = useState<boolean>(false)

  const toggleOpen = () => setModalOpen(!modalOpen);
  const changeIndex = (index: number) => {
    setSelected(selections[index]);
    if (numeric)
      setNumericValue(numeric[index]);
    toggleUpdate(true)
  }

  const getIndex = (text: string) => {
    return selections.findIndex((val, index) => {
      if (val === text){
        return index;
      }
    });
  }
  useEffect(() => {
    toggleUpdate(false);
  }, [update])
  return {
    toggleOpen,
    toggleUpdate,
    changeIndex,
    getIndex,
    setSelected,
    setModalOpen,
    update,
    numericValue,
    selected,
    modalOpen,
    selections
  }
}