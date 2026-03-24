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
  let baseName = fileName.includes('.') 
    ? fileName.substring(0, fileName.lastIndexOf('.')) 
    : fileName;
  const extension = fileName.includes('.') 
    ? fileName.substring(fileName.lastIndexOf('.')) 
    : "";
  
  // 1. Strip any existing (N) from the end of baseName to prevent (1) (2)
  const indexMatch = baseName.match(/(.+) \((\d+)\)$/);
  if (indexMatch) {
    baseName = indexMatch[1];
  }

  // 2. Find all items that share the same baseName (with or without index)
  // We use a case-insensitive match for the base name
  const escapedBase = baseName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const duplicateRegex = new RegExp(`^${escapedBase}( \\(\\d+\\))?${extension.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i');
  
  const existingItems = history.filter(item => 
    item.id !== excludeId && 
    item.fileName && 
    duplicateRegex.test(item.fileName)
  );

  if (existingItems.length === 0) {
    return `${baseName}${extension}`;
  }

  // 3. Find all used indices
  const usedIndices = new Set<number>();
  existingItems.forEach(item => {
    const m = item.fileName?.match(/\((\d+)\)/);
    if (m) {
      usedIndices.add(parseInt(m[1]));
    } else if (item.fileName?.toLowerCase() === `${baseName}${extension}`.toLowerCase()) {
      // The original name itself is used (index 0 effectively)
      usedIndices.add(0);
    }
  });

  // 4. Find the first available index starting from 1
  let nextIndex = 1;
  while (usedIndices.has(nextIndex)) {
    nextIndex++;
  }

  return `${baseName} (${nextIndex})${extension}`;
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
  const newHistory = [...history];

  // We iterate from oldest to newest to keep the original name for the first one.
  // History is usually sorted [newest, ..., oldest]
  for (let i = newHistory.length - 1; i >= 0; i--) {
    const item = newHistory[i];
    const currentName = item.fileName || "Dokument bez názvu";
    
    // Check if this name already appeared earlier in the processing (which means later in history)
    // Actually, let's just use the current unique generator against the already processed items
    const processedItems = newHistory.slice(i + 1);
    
    const uniqueName = getUniqueFileName(currentName, processedItems, String(item.id));
    
    if (uniqueName !== currentName) {
      newHistory[i] = { ...item, fileName: uniqueName };
      changed = true;
    }
  }

  return { sanitized: newHistory, changed };
};
