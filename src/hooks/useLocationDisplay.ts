import { useMemo } from 'react';

interface Building {
  building_code: string;
  building_name: string;
}

/**
 * Custom hook to format building location display
 * Handles building codes with optional room numbers
 * Example: "PG6 123" -> "PG6 - Parking Garage 6, Room 123"
 */
export const useLocationDisplay = (
  buildingStr: string | null,
  buildings: Building[]
): string => {
  return useMemo(() => {
    if (!buildingStr) return 'Location TBD';
    
    // Match building code and optional room number (e.g., "PG6 123" or "PG6-123")
    const match = buildingStr.match(/^([A-Z0-9]+)[\s-]*([\d]+)?$/i);
    if (!match) return buildingStr;
    
    const [, code, room] = match;
    const buildingCode = code.toUpperCase();
    
    // Find the full building name
    const building = buildings.find(b => b.building_code === buildingCode);
    const fullName = building 
      ? `${buildingCode} - ${building.building_name}` 
      : buildingCode;
    
    // Add room number if it exists
    return room ? `${fullName}, Room ${room}` : fullName;
  }, [buildingStr, buildings]);
};
