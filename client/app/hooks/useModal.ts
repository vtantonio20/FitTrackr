import { useEffect, useState } from "react";


export const useModal = (selections:string[], numeric?: number[] , initalState?:boolean) => {
  const [modalOpen, setModalOpen] = useState(initalState || false);
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
    selections.findIndex((val, index, text) => {
      return index;
    });
  }
  useEffect(() => {
    toggleUpdate(false);
  }, [update])
  return {
    toggleOpen,
    changeIndex,
    getIndex,
    numericValue,
    selected,
    modalOpen,
    selections
  }
}