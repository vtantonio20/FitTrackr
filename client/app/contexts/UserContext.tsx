import { createContext, ReactNode, useContext, useState } from "react";
import { MeasurementType } from "../utilities";

export interface User {
    id: string,
    name: string,
    email: string,
}

interface UserContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    measureType: MeasurementType;
    toggleMeasureType: () => void;
    weightUnit: string;
    isImperial: boolean;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [measureType, setMeasureType] = useState<MeasurementType>(MeasurementType.Imperial);
    const weightUnit = (measureType === MeasurementType.Imperial) ? "Ibs" : "Kg";
    const isImperial = (measureType === MeasurementType.Imperial);
    
    const toggleMeasureType = () => {
      if (!user) return;
      if (measureType === MeasurementType.Imperial) {
        setMeasureType(MeasurementType.Metric)
      }else{
        setMeasureType(MeasurementType.Imperial)
      }
    }

    return (
      <UserContext.Provider value={{ user, setUser, measureType, toggleMeasureType, isImperial, weightUnit}}>
        {children}
      </UserContext.Provider>
    );
  };
  
  export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
      throw new Error('useUser must be used within a UserProvider');
    }
    return context;
  };
  