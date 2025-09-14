export interface PdfDocumentOptions {
	title?: string;

	orientation?: "portrait" | "landscape";

	format?: "a4" | "letter" | "legal";

	margins?: {
		top: number;
		right: number;
		bottom: number;
		left: number;
	};
}
