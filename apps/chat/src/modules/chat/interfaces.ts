export interface Message {
	id: string;
	text: string;
	from: string;
	to: string;
	date: Date;
	read: boolean;
}