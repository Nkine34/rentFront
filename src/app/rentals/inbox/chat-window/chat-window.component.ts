
import { Component, inject, Input, ViewChild, ElementRef, AfterViewChecked, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Conversation } from '../../models';
import { ConversationStore } from '../../state/conversation.store';

@Component({
    selector: 'app-chat-window',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule
    ],
    templateUrl: './chat-window.component.html',
    styleUrls: ['./chat-window.component.scss']
})
export class ChatWindowComponent implements OnInit, AfterViewChecked {
    @Input({ required: true }) conversation!: Conversation;
    @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

    protected readonly store = inject(ConversationStore);

    messageControl = new FormControl('');
    private shouldScrollToBottom = false;

    get messages() {
        return this.store.messages();
    }

    ngOnInit() {
        // Scroll to bottom on initial load
        this.shouldScrollToBottom = true;
    }

    ngAfterViewChecked() {
        if (this.shouldScrollToBottom) {
            this.scrollToBottom();
            this.shouldScrollToBottom = false;
        }
    }

    sendMessage() {
        const content = this.messageControl.value?.trim();
        if (!content) return;

        this.store.sendMessage({
            conversationId: this.conversation.id,
            content: content
        });

        this.messageControl.reset();
        this.shouldScrollToBottom = true;
    }

    onKeydown(event: KeyboardEvent) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            this.sendMessage();
        }
    }

    private scrollToBottom(): void {
        try {
            this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
        } catch (err) { }
    }
}
