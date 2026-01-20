
import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Conversation, Message } from '../models';

@Injectable({
    providedIn: 'root'
})
export class ConversationService {

    // MOCK DATA for MVP Frontend Development
    private mockConversations: Conversation[] = [
        {
            id: 1,
            locationId: 101,
            locationName: "Charming Parisian Apartment",
            hostId: 1,
            hostName: "Sophie Martin",
            hostAvatar: "https://i.pravatar.cc/150?u=sophie",
            guestId: 5,
            lastMessage: "Bonjour! Is the apartment available for these dates?",
            lastMessageAt: new Date(new Date().getTime() - 1000 * 60 * 30), // 30 mins ago
            isRead: false
        },
        {
            id: 2,
            locationId: 102,
            locationName: "Modern Loft in Lyon",
            hostId: 1,
            hostName: "Sophie Martin",
            hostAvatar: "https://i.pravatar.cc/150?u=sophie",
            guestId: 5,
            lastMessage: "Thank you for the information.",
            lastMessageAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
            isRead: true
        },
        {
            id: 3,
            locationId: 201,
            locationName: "Cozy Studio in Rome",
            hostId: 2,
            hostName: "Marco Rossi",
            hostAvatar: "https://i.pravatar.cc/150?u=marco",
            guestId: 5,
            lastMessage: "Sure, check-in is at 3 PM.",
            lastMessageAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
            isRead: true
        }
    ];

    private mockMessages: Record<number, Message[]> = {
        1: [
            {
                id: 101,
                conversationId: 1,
                senderId: 5, // Me
                content: "Bonjour! Is the apartment available for these dates?",
                sentAt: new Date(new Date().getTime() - 1000 * 60 * 30),
                readAt: null,
                isMine: true
            },
            {
                id: 102,
                conversationId: 1,
                senderId: 1, // Host
                content: "Yes, it is! Looking forward to hosting you.",
                sentAt: new Date(new Date().getTime() - 1000 * 60 * 10),
                readAt: null,
                isMine: false
            }
        ],
        2: [
            {
                id: 201,
                conversationId: 2,
                senderId: 5,
                content: "Is there parking nearby?",
                sentAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 3),
                readAt: new Date(),
                isMine: true
            },
            {
                id: 202,
                conversationId: 2,
                senderId: 1, // Host
                content: "Yes, there is a public garage just around the corner.",
                sentAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 2.5),
                readAt: new Date(),
                isMine: false
            },
            {
                id: 203,
                conversationId: 2,
                senderId: 5,
                content: "Thank you for the information.",
                sentAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 2),
                readAt: new Date(),
                isMine: true
            }
        ]
    };

    /**
     * Get all conversations for the current user (Mock)
     */
    getConversations(): Observable<Conversation[]> {
        return of(this.mockConversations).pipe(delay(500)); // Simulate network latency
    }

    /**
     * Get messages for a specific conversation (Mock)
     */
    getMessages(conversationId: number): Observable<Message[]> {
        const messages = this.mockMessages[conversationId] || [];
        return of(messages).pipe(delay(300));
    }

    /**
     * Send a new message (Mock)
     */
    sendMessage(conversationId: number, content: string): Observable<Message> {
        const newMessage: Message = {
            id: Math.floor(Math.random() * 10000),
            conversationId: conversationId,
            senderId: 5, // Mock current user ID
            content: content,
            sentAt: new Date(),
            readAt: null,
            isMine: true
        };

        // Update mock data store
        if (!this.mockMessages[conversationId]) {
            this.mockMessages[conversationId] = [];
        }
        this.mockMessages[conversationId].push(newMessage);

        // Update conversation last message preview
        const convIndex = this.mockConversations.findIndex(c => c.id === conversationId);
        if (convIndex !== -1) {
            this.mockConversations[convIndex] = {
                ...this.mockConversations[convIndex],
                lastMessage: content,
                lastMessageAt: new Date(),
                isRead: true
            };
        }

        return of(newMessage).pipe(delay(300));
    }
}
