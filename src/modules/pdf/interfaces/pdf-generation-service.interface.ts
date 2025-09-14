import {
	PdfDocumentOptions,
	TextOptions as PdfTextOptions,
	TableOptions,
} from "../types";

/**
 * Interface for PDF generation service providing methods for creating
 * and managing PDF documents with tables, text, and various export formats
 */
export interface IPdfGenerationService {
	/**
	 * Creates a new PDF document with optional configuration
	 * @param options Document configuration options
	 */
	createDocument(options?: PdfDocumentOptions): void;

	/**
	 * Generates a formatted table with headers and data records
	 * @param headers Array of column header strings
	 * @param records Array of data records for table rows (objects, arrays, or primitives)
	 * @param options Optional table formatting options
	 */
	generateTable(
		headers: string[],
		records: Record<string, unknown>[] | unknown[][] | unknown[],
		options?: TableOptions,
	): void;

	/**
	 * Adds formatted text content to the document
	 * @param content Text content to add
	 * @param options Text formatting options
	 */
	addText(content: string, options?: PdfTextOptions): void;

	/**
	 * Adds a header with specified level and styling
	 * @param content Header text content
	 * @param level Header level (1-6, default 1)
	 */
	addHeader(content: string, level?: number): void;

	/**
	 * Adds a manual page break to the document
	 */
	addPageBreak(): void;

	/**
	 * Resets the document state for reuse
	 */
	reset(): void;

	/**
	 * Sets document margins
	 * @param margins Margin configuration
	 */
	setMargins(margins: {
		top: number;
		right: number;
		bottom: number;
		left: number;
	}): void;

	/**
	 * Checks if there is enough space on the current page for content of specified height
	 * @param requiredHeight Height in mm required for the content
	 * @returns true if content fits on current page, false if new page is needed
	 */
	checkPageSpace(requiredHeight: number): boolean;

	/**
	 * Adds a new page to the document and resets the current Y position
	 */
	addNewPage(): void;

	/**
	 * Exports the PDF document as a Buffer
	 * @returns PDF document as Buffer
	 */
	exportAsBuffer(): Buffer;

	/**
	 * Adds a content section with proper spacing
	 * @param sectionTitle Optional section title
	 * @param spacing Spacing before section in mm (default: 10)
	 */
	addSection(sectionTitle?: string, spacing?: number): void;

	/**
	 * Adds a footer to all pages with optional page numbering
	 * @param content Footer content (can include {pageNumber} and {totalPages} placeholders)
	 * @param options Footer formatting options
	 */
	addFooter(content: string, options?: PdfTextOptions): void;

	/**
	 * Adds spacing between content elements
	 * @param spacing Spacing amount in mm
	 */
	addSpacing(spacing: number): void;
}
