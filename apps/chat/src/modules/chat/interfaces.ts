export interface Message {
	id: string;
	text: string;
	fromUserId: string;
	targetId: string;
	date: Date;
	read: boolean;
}