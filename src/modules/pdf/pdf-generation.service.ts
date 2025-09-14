import { Injectable } from "@nestjs/common";
import { jsPDF } from "jspdf";
import { IPdfGenerationService } from "./interfaces/pdf-generation-service.interface";
import {
	DocumentState,
	PdfDocumentOptions,
	TextOptions as PdfTextOptions,
	TableOptions,
} from "./types";

@Injectable()
export class PdfGenerationService implements IPdfGenerationService {
	private document: jsPDF | null = null;
	private currentY: number = 0;
	private pageHeight: number = 0;
	private margins: {
		top: number;
		right: number;
		bottom: number;
		left: number;
	} = {
		top: 20,
		right: 20,
		bottom: 20,
		left: 20,
	};
	private documentState: DocumentState = {
		currentPage: 1,
		currentY: 0,
		pageHeight: 0,
		pageWidth: 0,
		margins: this.margins,
		defaultFontSize: 12,
		lineHeight: 1,
		isInitialized: false,
	};

	constructor() {
		this.reset();
	}

	createDocument(options?: PdfDocumentOptions): void {
		const defaultOptions: PdfDocumentOptions = {
			orientation: "portrait",
			format: "letter",
			margins: this.margins,
		};

		const documentOptions = { ...defaultOptions, ...options };

		this.document = new jsPDF({
			orientation: documentOptions.orientation,
			unit: "mm",
			format: documentOptions.format,
		});

		if (documentOptions.title) {
			this.document.setProperties({ title: documentOptions.title });
		}

		if (documentOptions.margins) {
			this.margins = { ...documentOptions.margins };
		}

		const pageSize = this.document.internal.pageSize;
		this.pageHeight = pageSize.getHeight();
		this.currentY = this.margins.top;

		this.documentState = {
			currentPage: 1,
			currentY: this.currentY,
			pageHeight: this.pageHeight,
			pageWidth: pageSize.getWidth(),
			margins: this.margins,
			defaultFontSize: 12,
			lineHeight: 1,
			isInitialized: true,
			composition: {
				currentSection: 0,
				totalSections: 0,
				hasFooter: false,
				sections: [],
			},
		};

		this.document.setFontSize(this.documentState.defaultFontSize);
	}

	generateTable(
		headers: string[],
		records: Record<string, unknown>[] | unknown[][] | unknown[],
		options?: TableOptions,
	): void {
		if (!this.document || !this.documentState.isInitialized) {
			throw new Error(
				"Document must be created before generating tables",
			);
		}

		if (!headers || headers.length === 0) {
			throw new Error("Headers are required for table generation");
		}

		const defaultOptions: TableOptions = {
			headerStyle: {
				fontSize: this.documentState.defaultFontSize,
				fontStyle: "bold",
				color: "#000000",
				align: "left",
			},
			cellStyle: {
				fontSize: this.documentState.defaultFontSize,
				fontStyle: "normal",
				color: "#000000",
				align: "left",
			},
			showBorders: true,
			headerBackgroundColor: "#f0f0f0",
			alternatingRowColors: false,
			alternatingRowColor: "#f9f9f9",
			cellPadding: 2,
			repeatHeadersOnNewPage: true,
			borderWidth: 0.5,
			borderColor: "#000000",
			columnWidthMode: "equal",
			minColumnWidth: 20,
			maxColumnWidth: 100,
		};

		const tableOptions = { ...defaultOptions, ...options };

		const columnWidths = this.calculateColumnWidths(
			headers,
			records,
			tableOptions,
		);

		if (this.currentY > this.margins.top) {
			this.addSpacing(1);
		}

		const headerHeight = this.calculateRowHeight(
			tableOptions.headerStyle?.fontSize ||
				this.documentState.defaultFontSize,
			tableOptions.cellPadding || 2,
		);

		if (!this.checkPageSpace(headerHeight)) {
			this.addNewPage();
		}

		this.renderTableHeader(headers, columnWidths, tableOptions);

		if (records && records.length > 0) {
			this.renderTableRowsWithPagination(
				headers,
				records,
				columnWidths,
				tableOptions,
			);
		}

		this.addSpacing(1);
	}

	addText(content: string, options?: PdfTextOptions): void {
		if (!this.document || !this.documentState.isInitialized) {
			throw new Error("Document must be created before adding text");
		}

		if (!content || content.trim().length === 0) {
			return;
		}

		this.applyTextFormatting(options);

		const fontSize =
			options?.fontSize || this.documentState.defaultFontSize;
		const availableWidth =
			this.documentState.pageWidth -
			this.margins.left -
			this.margins.right;
		const textHeight = this.calculateTextHeight(
			content,
			fontSize,
			availableWidth,
		);

		if (!this.checkPageSpace(textHeight)) {
			this.addNewPage();
		}

		const textX = this.calculateTextX(content, options?.align || "left");

		this.document.text(content, textX, this.currentY);

		this.currentY += textHeight;
		this.documentState.currentY = this.currentY;
	}

	addHeader(
		content: string,
		level: number = 1,
		align?: "left" | "center" | "right",
	): void {
		if (!this.document || !this.documentState.isInitialized) {
			throw new Error("Document must be created before adding headers");
		}

		if (!content || content.trim().length === 0) {
			return;
		}

		const headerLevel = Math.max(1, Math.min(6, level));

		const baseFontSize = this.documentState.defaultFontSize;
		const headerFontSizes = [20, 18, 16, 14, 13, 12];
		const fontSize = headerFontSizes[headerLevel - 1] || baseFontSize;

		const headerOptions: PdfTextOptions = {
			fontSize,
			fontStyle: "bold",
			color: "#000000",
			align: align || "left",
		};

		if (this.currentY > this.margins.top) {
			const spacingBefore = fontSize * 0.05;
			if (!this.checkPageSpace(spacingBefore)) {
				this.addNewPage();
			} else {
				this.currentY += spacingBefore;
				this.documentState.currentY = this.currentY;
			}
		}

		this.addText(content, headerOptions);

		const spacingAfter = fontSize * 0.02;
		this.currentY += spacingAfter;
		this.documentState.currentY = this.currentY;
	}

	addPageBreak(): void {
		if (!this.document || !this.documentState.isInitialized) {
			throw new Error(
				"Document must be created before adding page breaks",
			);
		}

		this.addNewPage();
	}
	addSection(sectionTitle?: string, spacing: number = 1): void {
		if (!this.document || !this.documentState.isInitialized) {
			throw new Error("Document must be created before adding sections");
		}

		this.addSpacing(spacing);

		const sectionId = `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

		const sectionMetadata = {
			id: sectionId,
			title: sectionTitle,
			startPage: this.documentState.currentPage,
			startY: this.currentY,
			contentType: "mixed" as const,
		};

		if (this.documentState.composition) {
			this.documentState.composition.sections.push(sectionMetadata);
			this.documentState.composition.currentSection =
				this.documentState.composition.sections.length;
			this.documentState.composition.totalSections =
				this.documentState.composition.sections.length;
		}

		if (sectionTitle) {
			this.addHeader(sectionTitle, 2);
		}
	}

	addFooter(content: string, options?: PdfTextOptions): void {
		if (!this.document || !this.documentState.isInitialized) {
			throw new Error("Document must be created before adding footers");
		}

		if (!content || content.trim().length === 0) {
			return;
		}

		const footerConfig = {
			content,
			options: options || {
				fontSize: 10,
				fontStyle: "normal" as const,
				color: "#666666",
				align: "center" as const,
			},
			showPageNumbers:
				content.includes("{pageNumber}") ||
				content.includes("{totalPages}"),
			pageNumberFormat: content,
			bottomMargin: 15,
			showOnFirstPage: true,
		};

		if (this.documentState.composition) {
			this.documentState.composition.footerConfig = footerConfig;
			this.documentState.composition.hasFooter = true;
		}

		this.applyFooterToAllPages();
	}

	addSpacing(spacing: number): void {
		if (!this.document || !this.documentState.isInitialized) {
			throw new Error("Document must be created before adding spacing");
		}

		if (spacing <= 0) {
			return;
		}

		if (!this.checkPageSpace(spacing)) {
			this.addNewPage();
		} else {
			this.currentY += spacing;
			this.documentState.currentY = this.currentY;
		}
	}

	private calculateColumnWidths(
		headers: string[],
		records: Record<string, unknown>[] | unknown[][] | unknown[],
		options: TableOptions,
	): number[] {
		if (!this.document) return [];

		if (
			options.columnWidthMode === "manual" &&
			options.columnWidths &&
			options.columnWidths.length === headers.length
		) {
			return options.columnWidths;
		}

		const availableWidth =
			this.documentState.pageWidth -
			this.margins.left -
			this.margins.right;

		const columnCount = headers.length;

		switch (options.columnWidthMode) {
			case "auto":
				return this.calculateAutoColumnWidths(
					headers,
					records,
					availableWidth,
					options,
				);
			case "equal":
			default: {
				const equalWidth = availableWidth / columnCount;
				return new Array(columnCount).fill(equalWidth);
			}
		}
	}

	private calculateAutoColumnWidths(
		headers: string[],
		records: Record<string, unknown>[] | unknown[][] | unknown[],
		availableWidth: number,
		options: TableOptions,
	): number[] {
		if (!this.document) return [];

		const columnCount = headers.length;
		const minWidth = options.minColumnWidth || 20;
		const maxWidth = options.maxColumnWidth || 100;
		const cellPadding = (options.cellPadding || 2) * 2;

		const contentWidths: number[] = [];

		for (let i = 0; i < columnCount; i++) {
			let maxContentWidth = 0;

			const headerWidth =
				this.document.getTextWidth(headers[i]) + cellPadding;
			maxContentWidth = Math.max(maxContentWidth, headerWidth);

			const sampleSize = Math.min(records.length, 10);
			for (let j = 0; j < sampleSize; j++) {
				const record = records[j];
				let cellValue = "";

				if (Array.isArray(record)) {
					cellValue =
						i < record.length ? String(record[i] || "") : "";
				} else if (typeof record === "object" && record !== null) {
					cellValue = String(record[headers[i]] || "");
				} else {
					cellValue = String(record || "");
				}

				const contentWidth =
					this.document.getTextWidth(cellValue) + cellPadding;
				maxContentWidth = Math.max(maxContentWidth, contentWidth);
			}

			contentWidths[i] = Math.max(
				minWidth,
				Math.min(maxWidth, maxContentWidth),
			);
		}

		const totalContentWidth = contentWidths.reduce(
			(sum, width) => sum + width,
			0,
		);

		if (totalContentWidth <= availableWidth) {
			const remainingSpace = availableWidth - totalContentWidth;
			const spacePerColumn = remainingSpace / columnCount;
			return contentWidths.map(width =>
				Math.min(maxWidth, width + spacePerColumn),
			);
		} else {
			const scaleFactor = availableWidth / totalContentWidth;
			return contentWidths.map(width =>
				Math.max(minWidth, Math.min(maxWidth, width * scaleFactor)),
			);
		}
	}

	private calculateRowHeight(fontSize: number, cellPadding: number): number {
		return fontSize * this.documentState.lineHeight + cellPadding * 2;
	}

	private renderTableHeader(
		headers: string[],
		columnWidths: number[],
		options: TableOptions,
	): void {
		if (!this.document) return;

		const rowHeight = this.calculateRowHeight(
			options.headerStyle?.fontSize || this.documentState.defaultFontSize,
			options.cellPadding || 2,
		);

		if (options.showBorders) {
			this.document.setLineWidth(options.borderWidth || 0.5);
			this.document.setDrawColor(options.borderColor || "#000000");
		}

		if (options.headerBackgroundColor) {
			this.document.setFillColor(options.headerBackgroundColor);
			this.document.rect(
				this.margins.left,
				this.currentY,
				columnWidths.reduce((sum, width) => sum + width, 0),
				rowHeight,
				options.showBorders ? "FD" : "F",
			);
		}

		this.applyTextFormatting(options.headerStyle);

		let currentX = this.margins.left;
		for (let i = 0; i < headers.length; i++) {
			const header = headers[i];
			const cellWidth = columnWidths[i];

			if (options.showBorders && !options.headerBackgroundColor) {
				this.document.rect(
					currentX,
					this.currentY,
					cellWidth,
					rowHeight,
				);
			}

			const textX = currentX + (options.cellPadding || 2);
			const textY =
				this.currentY +
				rowHeight / 2 +
				(options.headerStyle?.fontSize ||
					this.documentState.defaultFontSize) /
					3;

			const maxTextWidth = cellWidth - 2 * (options.cellPadding || 2);
			const wrappedText = this.wrapTextToFit(header, maxTextWidth);

			if (wrappedText.length === 1) {
				this.document.text(wrappedText[0], textX, textY);
			} else {
				this.document.text(wrappedText[0], textX, textY);
			}

			currentX += cellWidth;
		}

		this.currentY += rowHeight;
		this.documentState.currentY = this.currentY;
	}

	private renderTableRowsWithPagination(
		headers: string[],
		records: Record<string, unknown>[] | unknown[][] | unknown[],
		columnWidths: number[],
		options: TableOptions,
	): void {
		if (!this.document) return;

		const rowHeight = this.calculateRowHeight(
			options.cellStyle?.fontSize || this.documentState.defaultFontSize,
			options.cellPadding || 2,
		);

		if (options.showBorders) {
			this.document.setLineWidth(options.borderWidth || 0.5);
			this.document.setDrawColor(options.borderColor || "#000000");
		}

		this.applyTextFormatting(options.cellStyle);

		for (let rowIndex = 0; rowIndex < records.length; rowIndex++) {
			const record = records[rowIndex];

			if (!this.checkPageSpace(rowHeight)) {
				this.addNewPage();

				if (options.repeatHeadersOnNewPage) {
					this.renderTableHeader(headers, columnWidths, options);
					this.applyTextFormatting(options.cellStyle);
					if (options.showBorders) {
						this.document.setLineWidth(options.borderWidth || 0.5);
						this.document.setDrawColor(
							options.borderColor || "#000000",
						);
					}
				}
			}

			if (options.alternatingRowColors && rowIndex % 2 === 1) {
				const alternatingColor =
					options.alternatingRowColor || "#f9f9f9";
				this.document.setFillColor(alternatingColor);
				this.document.rect(
					this.margins.left,
					this.currentY,
					columnWidths.reduce((sum, width) => sum + width, 0),
					rowHeight,
					options.showBorders ? "FD" : "F",
				);
			}

			this.renderTableRowCells(
				headers,
				record,
				columnWidths,
				options,
				rowHeight,
				rowIndex,
			);

			this.currentY += rowHeight;
			this.documentState.currentY = this.currentY;
		}
	}

	private renderTableRowCells(
		headers: string[],
		record: Record<string, unknown> | unknown[] | unknown,
		columnWidths: number[],
		options: TableOptions,
		rowHeight: number,
		rowIndex: number,
	): void {
		if (!this.document) return;

		let currentX = this.margins.left;

		for (let colIndex = 0; colIndex < headers.length; colIndex++) {
			const header = headers[colIndex];
			const cellWidth = columnWidths[colIndex];

			let cellValue = "";
			if (Array.isArray(record)) {
				cellValue =
					colIndex < record.length
						? String(record[colIndex] || "")
						: "";
			} else if (typeof record === "object" && record !== null) {
				cellValue = String(record[header] || "");
			} else {
				cellValue = String(record || "");
			}

			if (
				options.showBorders &&
				!(options.alternatingRowColors && rowIndex % 2 === 1)
			) {
				this.document.rect(
					currentX,
					this.currentY,
					cellWidth,
					rowHeight,
				);
			}

			const textX = currentX + (options.cellPadding || 2);
			const textY =
				this.currentY +
				rowHeight / 2 +
				(options.cellStyle?.fontSize ||
					this.documentState.defaultFontSize) /
					3;

			const maxTextWidth = cellWidth - 2 * (options.cellPadding || 2);
			const processedText = this.processTextForCell(
				cellValue,
				maxTextWidth,
			);
			this.document.text(processedText, textX, textY);

			currentX += cellWidth;
		}
	}

	private processTextForCell(text: string, maxWidth: number): string {
		if (!this.document || !text) return text;

		const textWidth = this.document.getTextWidth(text);
		if (textWidth <= maxWidth) {
			return text;
		}

		return this.truncateTextToFit(text, maxWidth);
	}

	private truncateTextToFit(text: string, maxWidth: number): string {
		if (!this.document || !text) return text;

		const textWidth = this.document.getTextWidth(text);
		if (textWidth <= maxWidth) {
			return text;
		}

		let truncated = text;
		const ellipsis = "...";

		while (truncated.length > 0) {
			const currentWidth = this.document.getTextWidth(
				truncated + ellipsis,
			);
			if (currentWidth <= maxWidth) {
				return truncated + ellipsis;
			}
			truncated = truncated.slice(0, -1);
		}

		return ellipsis;
	}

	private wrapTextToFit(text: string, maxWidth: number): string[] {
		if (!this.document || !text) return [text];

		const textWidth = this.document.getTextWidth(text);
		if (textWidth <= maxWidth) {
			return [text];
		}

		const words = text.split(" ");
		const lines: string[] = [];
		let currentLine = "";

		for (const word of words) {
			const testLine = currentLine ? `${currentLine} ${word}` : word;
			const testWidth = this.document.getTextWidth(testLine);

			if (testWidth <= maxWidth) {
				currentLine = testLine;
			} else {
				if (currentLine) {
					lines.push(currentLine);
					currentLine = word;
				} else {
					lines.push(this.truncateTextToFit(word, maxWidth));
					currentLine = "";
				}
			}
		}

		if (currentLine) {
			lines.push(currentLine);
		}

		return lines.length > 0 ? lines : [text];
	}

	private applyTextFormatting(options?: PdfTextOptions): void {
		if (!this.document) return;

		const fontSize =
			options?.fontSize || this.documentState.defaultFontSize;
		this.document.setFontSize(fontSize);

		const fontStyle = options?.fontStyle || "normal";
		this.document.setFont(undefined, fontStyle);

		if (options?.color) {
			this.document.setTextColor(options.color);
		} else {
			this.document.setTextColor("#000000");
		}
	}

	private calculateTextX(
		content: string,
		align: "left" | "center" | "right",
	): number {
		if (!this.document) return this.margins.left;

		const pageWidth = this.documentState.pageWidth;
		const textWidth = this.document.getTextWidth(content);

		switch (align) {
			case "center":
				return (pageWidth - textWidth) / 2;
			case "right":
				return pageWidth - this.margins.right - textWidth;
			case "left":
			default:
				return this.margins.left;
		}
	}

	private calculateTextHeight(
		content: string,
		fontSize: number,
		maxWidth?: number,
	): number {
		if (!this.document || !content) {
			return fontSize * this.documentState.lineHeight;
		}

		if (!maxWidth) {
			return fontSize * this.documentState.lineHeight;
		}

		const textWidth = this.document.getTextWidth(content);

		if (textWidth <= maxWidth) {
			return fontSize * this.documentState.lineHeight;
		} else {
			const estimatedLines = Math.ceil(textWidth / maxWidth);
			return estimatedLines * fontSize * this.documentState.lineHeight;
		}
	}

	reset(): void {
		this.document = null;

		this.currentY = 0;
		this.pageHeight = 0;

		this.margins = {
			top: 20,
			right: 20,
			bottom: 20,
			left: 20,
		};

		this.documentState = {
			currentPage: 1,
			currentY: 0,
			pageHeight: 0,
			pageWidth: 0,
			margins: this.margins,
			defaultFontSize: 12,
			lineHeight: 1,
			isInitialized: false,
			composition: {
				currentSection: 0,
				totalSections: 0,
				hasFooter: false,
				sections: [],
			},
		};
	}

	setMargins(margins: {
		top: number;
		right: number;
		bottom: number;
		left: number;
	}): void {
		this.margins = { ...margins };

		this.documentState.margins = { ...margins };

		if (this.documentState.isInitialized && this.currentY < margins.top) {
			this.currentY = margins.top;
			this.documentState.currentY = margins.top;
		}
	}

	checkPageSpace(requiredHeight: number): boolean {
		if (!this.documentState.isInitialized) {
			return false;
		}

		const availableSpace =
			this.pageHeight - this.currentY - this.margins.bottom;

		return requiredHeight <= availableSpace;
	}

	addNewPage(): void {
		if (!this.document || !this.documentState.isInitialized) {
			throw new Error("Document must be created before adding new pages");
		}

		this.document.addPage();

		this.documentState.currentPage += 1;
		this.currentY = this.margins.top;
		this.documentState.currentY = this.margins.top;

		this.updateFooterOnNewPage();
	}

	exportAsBuffer(): Buffer {
		if (!this.document || !this.documentState.isInitialized) {
			throw new Error(
				"Document must be created and initialized before export",
			);
		}

		try {
			const arrayBuffer = this.document.output("arraybuffer");

			const buffer = Buffer.from(arrayBuffer);

			this.performCleanupAfterExport();

			return buffer;
		} catch (error) {
			throw new Error(
				`Failed to export PDF as Buffer: ${error instanceof Error ? error.message : "Unknown error"}`,
			);
		}
	}
	private applyFooterToAllPages(): void {
		if (!this.document || !this.documentState.composition?.footerConfig) {
			return;
		}

		const footerConfig = this.documentState.composition.footerConfig;
		const currentPage = this.documentState.currentPage;
		const totalPages = this.document.getNumberOfPages();

		const savedY = this.currentY;
		const savedPage = currentPage;

		for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
			if (!footerConfig.showOnFirstPage && pageNum === 1) {
				continue;
			}

			this.document.setPage(pageNum);

			const footerY = this.pageHeight - (footerConfig.bottomMargin || 15);

			let footerText = footerConfig.content;
			if (footerConfig.showPageNumbers) {
				footerText = footerText
					.replace(/{pageNumber}/g, pageNum.toString())
					.replace(/{totalPages}/g, totalPages.toString());
			}

			this.applyTextFormatting(footerConfig.options);

			const textX = this.calculateTextX(
				footerText,
				footerConfig.options?.align || "center",
			);

			this.document.text(footerText, textX, footerY);
		}

		if (savedPage <= totalPages) {
			this.document.setPage(savedPage);
		}
		this.currentY = savedY;
	}

	private updateFooterOnNewPage(): void {
		if (!this.documentState.composition?.hasFooter) {
			return;
		}

		this.applyFooterToAllPages();
	}

	private performCleanupAfterExport(): void {
		if (this.document) {
			this.document.setFontSize(this.documentState.defaultFontSize);
			this.document.setFont(undefined, "normal");
			this.document.setTextColor("#000000");
		}

		if (this.documentState.composition) {
			this.documentState.composition.currentSection = 0;
		}

		if (typeof global !== "undefined" && global.gc) {
			global.gc();
		}

		console.debug(
			`PDF export completed. Document has ${this.documentState.currentPage} pages.`,
		);
	}
}
