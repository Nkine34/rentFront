export interface Message {
    id: number;
    conversationId: number;
    senderId: number;
    content: string;
    sentAt: Date;
    readAt: Date | null;
    isMine?: boolean; // Helper UI property
}
