export interface Conversation {
    id: number;
    locationId: number;
    locationName: string;
    hostId: number;
    hostName: string;
    hostAvatar?: string;
    guestId: number;
    lastMessage: string;
    lastMessageAt: Date;
    isRead: boolean;
}
