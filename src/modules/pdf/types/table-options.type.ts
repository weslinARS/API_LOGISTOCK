import { TextOptions } from "./text-options.type";

export interface TableOptions {
	headerStyle?: TextOptions;

	cellStyle?: TextOptions;

	columnWidths?: number[];

	showBorders?: boolean;

	headerBackgroundColor?: string;

	alternatingRowColors?: boolean;

	alternatingRowColor?: string;

	cellPadding?: number;

	repeatHeadersOnNewPage?: boolean;

	borderWidth?: number;

	borderColor?: string;

	columnWidthMode?: "equal" | "auto" | "manual";

	minColumnWidth?: number;

	maxColumnWidth?: number;
}
