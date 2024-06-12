import { useEffect, useMemo, useState } from "react";
export const useSuggested = (group: any[]): any => {
  const [groupSuggestions, setGroupSuggestions] = useState(group);
  const [inputSuggestions, setInputSuggestions] = useState<Set<string>>(new Set());

  const setNewSuggestions = (suggestions: string[]) => {
    setGroupSuggestions(suggestions);
  }

  const appendSuggestion = (suggestion: string) => {
    if (!inputSuggestions.has(suggestion)) {
      setInputSuggestions(new Set(inputSuggestions).add(suggestion));
      return true;
    }
    return false;
  }

  const removeSuggestion = (suggestion: string) => {
    if (inputSuggestions.has(suggestion)) {
      const temp = new Set(inputSuggestions);
      temp.delete(suggestion);
      setInputSuggestions(temp);
      return true;
    }
    return false;
  }

  const unselectedSuggestions = useMemo(() => {
    const set1 = new Set(inputSuggestions);
    return groupSuggestions.filter(val => !set1.has(val));
  }, [groupSuggestions, inputSuggestions]);

  const selectedSuggestions = useMemo(() => {
    return [...inputSuggestions];
  }, [inputSuggestions]);

  return {
    appendSuggestion,
    removeSuggestion,
    setNewSuggestions,
    unselectedSuggestions,
    selectedSuggestions
  };
}
