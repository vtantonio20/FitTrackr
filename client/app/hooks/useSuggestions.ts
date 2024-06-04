import { useEffect, useRef, useState } from "react";
/*
  This hook provides the ability to have a suggestions array
  that a user can select values from, and causing two arrays 
  to be returned, one for the selected suggestions, and another
  for unselected suggestions.
*/
type Suggested = {
  appendSuggestion: (suggestion: string) => boolean;
  removeSuggestion: (suggestion: string) => boolean;
  setNewSuggestions: (suggestion: string[]) => void;
  unselectedSuggestions: string[];
  selectedSuggestions: string[];
}
export const useSuggested = ( group:string[]): Suggested => {
  const [groupSuggestions, setGroupSuggestions] = useState(group);
  const [unselectedSuggestions, setUnselectedSuggested] = useState(group);
  const [inputSuggestions, setInputSuggestions] = useState<Set<string>>(new Set());


  const setNewSuggestions = (suggestions: string[]) => {
    setGroupSuggestions(suggestions); 
  }
  const appendSuggestion = (suggestion: string) => {
    if (!inputSuggestions.has(suggestion)) {
      const temp = new Set(inputSuggestions);
      temp.add(suggestion)
      setInputSuggestions(temp)
      return true;
    }
    return false;
  }
  const removeSuggestion = (suggestion: string) => {
    if (inputSuggestions.has(suggestion)) {
      const temp = new Set(inputSuggestions);
      temp.delete(suggestion)
      setInputSuggestions(temp)
      return true;
    }
    return false;
  }
  useEffect(() => {
    const set1 = new Set(inputSuggestions);
    const set2 = new Set(groupSuggestions);
    const combinedArray = [...new Set([...set2].filter(val => !set1.has(val)))];
    setUnselectedSuggested(combinedArray);
  }, [groupSuggestions, inputSuggestions])

  
  return {
    appendSuggestion,
    removeSuggestion,
    setNewSuggestions,
    unselectedSuggestions: unselectedSuggestions,
    selectedSuggestions: [...inputSuggestions]
  };
}