// src/utils/history.ts
import { HistoryItem } from "@/types";

/**
 * Generates a unique filename for a new or existing history entry.
 * If a duplicate exists, it adds an index in the format "Filename (1).ext".
 * 
 * @param fileName The original filename
 * @param history Current history items
 * @param excludeId Optional ID to exclude from duplicate check (useful when renaming an existing item)
 */
export const getUniqueFileName = (
  fileName: string, 
  history: HistoryItem[], 
  excludeId?: string
): string => {
  const baseName = fileName.includes('.') 
    ? fileName.substring(0, fileName.lastIndexOf('.')) 
    : fileName;
  const extension = fileName.includes('.') 
    ? fileName.substring(fileName.lastIndexOf('.')) 
    : "";
  
  // Find all items that have the exact same name or follow the "Name (index)" pattern
  const duplicateRegex = new RegExp(`^${baseName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}( \\(\\d+\\))?${extension.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`);
  
  const existingDuplicates = history.filter(item => 
    item.id !== excludeId && 
    item.fileName && 
    duplicateRegex.test(item.fileName)
  );

  if (existingDuplicates.length === 0) {
    return fileName;
  }

  // Find the highest index currently in use
  let maxIndex = 0;
  existingDuplicates.forEach(item => {
    const match = item.fileName?.match(/\((\d+)\)/);
    if (match) {
      const index = parseInt(match[1]);
      if (index > maxIndex) maxIndex = index;
    }
  });

  return `${baseName} (${maxIndex + 1})${extension}`;
};

/**
 * Checks if a filename already exists in the history.
 */
export const checkFileNameExists = (
  fileName: string,
  history: HistoryItem[],
  excludeId?: string
): boolean => {
  return history.some(item => 
    item.id !== excludeId && 
    item.fileName?.toLowerCase() === fileName.toLowerCase()
  );
};

/**
 * Sanitizes the entire history by ensuring all filenames are unique.
 * This is useful for cleaning up existing duplicates.
 */
export const sanitizeHistoryNames = (history: HistoryItem[]): { sanitized: HistoryItem[], changed: boolean } => {
  let changed = false;
  const seenNames = new Map<string, string>(); // name -> id
  const newHistory = [...history];

  // We iterate from oldest to newest (end to start) or vice versa? 
  // Let's go from oldest to newest to keep the original name for the first one.
  for (let i = newHistory.length - 1; i >= 0; i--) {
    const item = newHistory[i];
    const currentName = item.fileName || "Dokument bez názvu";
    
    // If we've seen this name before, it's a duplicate
    if (seenNames.has(currentName.toLowerCase())) {
      // Get a unique name for this duplicate
      const uniqueName = getUniqueFileName(currentName, newHistory.slice(i + 1));
      newHistory[i] = { ...item, fileName: uniqueName };
      seenNames.set(uniqueName.toLowerCase(), String(item.id));
      changed = true;
    } else {
      seenNames.set(currentName.toLowerCase(), String(item.id));
    }
  }

  return { sanitized: newHistory, changed };
};
