import { TextOptions as PdfTextOptions } from "./text-options.type";


export interface ContentSectionOptions {
	title?: string;
	spacingBefore?: number;
	spacingAfter?: number;
	titleOptions?: PdfTextOptions;
	pageBreakBefore?: boolean;
}


export interface FooterOptions extends PdfTextOptions {
	showPageNumbers?: boolean;
	pageNumberFormat?: string;
	bottomMargin?: number;
	showOnFirstPage?: boolean;
}


export interface DocumentComposition {
	currentSection: number;
	totalSections: number;
	footerConfig?: FooterOptions;
	hasFooter: boolean;
	sections: ContentSectionMetadata[];
}


export interface ContentSectionMetadata {
	id: string;
	title?: string;
	startPage: number;
	startY: number;
	contentType: "text" | "table" | "mixed";
}
