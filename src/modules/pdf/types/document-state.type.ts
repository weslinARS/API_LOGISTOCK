/**
 * Internal state management interface for PDF document generation
 */
export interface DocumentState {
	currentPage: number;

	currentY: number;

	pageHeight: number;

	pageWidth: number;

	margins: {
		top: number;
		right: number;
		bottom: number;
		left: number;
	};

	defaultFontSize: number;

	lineHeight: number;

	isInitialized: boolean;

	composition?: {
		currentSection: number;
		totalSections: number;
		footerConfig?: {
			content: string;
			options?: any;
			showPageNumbers?: boolean;
			pageNumberFormat?: string;
			bottomMargin?: number;
			showOnFirstPage?: boolean;
		};
		hasFooter: boolean;
		sections: Array<{
			id: string;
			title?: string;
			startPage: number;
			startY: number;
			contentType: "text" | "table" | "mixed";
		}>;
	};
}
