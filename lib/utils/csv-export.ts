/**
 * CSV Export Utility Functions
 * Handles conversion of data arrays to CSV format with proper encoding and formatting
 */

/**
 * Escapes a CSV field value to handle commas, quotes, and newlines
 */
function escapeCSVField(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }

  const stringValue = String(value);

  // If the value contains comma, quote, or newline, wrap it in quotes and escape quotes
  if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
}

/**
 * Converts an array of objects to CSV format
 * @param data Array of objects to convert
 * @param headers Array of header labels (in order)
 * @param fields Array of field keys to extract from each object (must match headers order)
 * @returns CSV string with UTF-8 BOM for Excel compatibility
 */
export function convertToCSV<T extends Record<string, unknown>>(
  data: T[],
  headers: string[],
  fields: (keyof T)[]
): string {
  // Add UTF-8 BOM for Excel compatibility
  const BOM = "\uFEFF";

  // Create header row
  const headerRow = headers.map(escapeCSVField).join(",");

  // Create data rows
  const dataRows = data.map((row) => {
    return fields.map((field) => escapeCSVField(row[field])).join(",");
  });

  // Combine header and data rows
  const csvContent = [headerRow, ...dataRows].join("\n");

  return BOM + csvContent;
}

/**
 * Downloads a CSV file to the user's browser
 * @param csvContent CSV string content
 * @param filename Name of the file to download (without extension)
 */
export function downloadCSV(csvContent: string, filename: string): void {
  // Create blob with CSV content
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

  // Create download link
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  link.style.visibility = "hidden";

  // Trigger download
  document.body.appendChild(link);
  link.click();

  // Cleanup
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exports data to CSV and triggers download
 * @param data Array of objects to export
 * @param headers Array of header labels
 * @param fields Array of field keys to extract
 * @param filename Base filename (without extension)
 */
export function exportToCSV<T extends Record<string, unknown>>(
  data: T[],
  headers: string[],
  fields: (keyof T)[],
  filename: string
): void {
  if (data.length === 0) {
    throw new Error("No data to export");
  }

  if (headers.length !== fields.length) {
    throw new Error("Headers and fields arrays must have the same length");
  }

  const csvContent = convertToCSV(data, headers, fields);
  downloadCSV(csvContent, filename);
}

/**
 * Generates a filename with timestamp
 * @param baseName Base name for the file
 * @returns Filename with date suffix
 */
export function generateFilenameWithDate(baseName: string): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${baseName}-${year}-${month}-${day}`;
}

