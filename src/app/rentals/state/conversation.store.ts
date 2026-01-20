
import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { withEntities, setAllEntities, addEntity, updateEntity } from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';

import { Conversation, Message } from '../models';
import { ConversationService } from '../services/conversation.service';
import { withCallState } from '../../shared/state/call-state.feature';

// --- State Definition ---
interface ConversationState {
    activeConversationId: number | null;
    messages: Message[]; // Messages for the ACTIVE conversation
}

const initialState: ConversationState = {
    activeConversationId: null,
    messages: []
};

export const ConversationStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withCallState(), // For loading/error states of CONVERSATIONS list
    withEntities<Conversation>(), // Collection of Conversations

    // --- Computed Selectors ---
    withComputed((store) => ({
        activeConversation: computed(() => {
            const activeId = store.activeConversationId();
            if (!activeId) return null;
            return store.entities().find(c => c.id === activeId) || null;
        }),

        // Sort conversations by date (newest first)
        sortedConversations: computed(() => {
            return [...store.entities()].sort((a, b) =>
                new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
            );
        }),

        unreadCount: computed(() => {
            return store.entities().filter(c => !c.isRead).length;
        })
    })),

    // --- Methods (Actions/Effects) ---
    withMethods((store, conversationService = inject(ConversationService)) => ({

        // 1. Load All Conversations
        loadConversations: rxMethod<void>(
            pipe(
                tap(() => store.setLoading()),
                switchMap(() =>
                    conversationService.getConversations().pipe(
                        tapResponse({
                            next: (conversations) => {
                                patchState(store, setAllEntities(conversations));
                                store.setLoaded();
                            },
                            error: (error: Error) => {
                                console.error("Error loading conversations", error);
                                store.setError("Failed to load conversations");
                            }
                        })
                    )
                )
            )
        ),

        // 2. Select a Conversation & Load its Messages
        selectConversation: rxMethod<number>(
            pipe(
                tap((conversationId) => {
                    patchState(store, { activeConversationId: conversationId, messages: [] }); // Clear previous messages
                    // Optimistic read update
                    const conv = store.entities().find(c => c.id === conversationId);
                    if (conv && !conv.isRead) {
                        patchState(store, updateEntity({ id: conversationId, changes: { isRead: true } }));
                    }
                }),
                switchMap((conversationId) =>
                    conversationService.getMessages(conversationId).pipe(
                        tapResponse({
                            next: (messages) => {
                                patchState(store, { messages });
                            },
                            error: (error: Error) => {
                                console.error("Error loading messages", error);
                                // Could handle message-specific error state here if needed
                            }
                        })
                    )
                )
            )
        ),

        // 3. Send Message
        sendMessage: rxMethod<{ conversationId: number, content: string }>(
            pipe(
                switchMap(({ conversationId, content }) =>
                    conversationService.sendMessage(conversationId, content).pipe(
                        tapResponse({
                            next: (message) => {
                                // Add message to local state
                                patchState(store, (state) => ({ messages: [...state.messages, message] }));

                                // Update conversation snippet in the list
                                patchState(store, updateEntity({
                                    id: conversationId,
                                    changes: {
                                        lastMessage: message.content,
                                        lastMessageAt: message.sentAt,
                                        isRead: true
                                    }
                                }));
                            },
                            error: (error) => console.error("Error sending message", error)
                        })
                    )
                )
            )
        )

    }))
);
