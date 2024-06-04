import { useState, useEffect } from 'react';
import { UseFormSetValue } from 'react-hook-form';

type UseDateReturn = [Date | undefined, (date: Date) => void];

const useDate = (setValue: UseFormSetValue<any>): UseDateReturn => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    setValue("workoutDate", date || new Date());
  }, [date, setValue]);

  return [date, setDate];
};

export default useDate;
