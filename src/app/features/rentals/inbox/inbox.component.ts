
import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ConversationListComponent } from './conversation-list/conversation-list.component';
import { ChatWindowComponent } from './chat-window/chat-window.component';
import { ConversationStore } from '../state/conversation.store';

@Component({
    selector: 'app-inbox',
    standalone: true,
    imports: [
        CommonModule,
        MatSidenavModule,
        ConversationListComponent,
        ChatWindowComponent
    ],
    templateUrl: './inbox.component.html',
    styleUrls: ['./inbox.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class InboxComponent implements OnInit {
    protected readonly store = inject(ConversationStore);

    ngOnInit(): void {
        // Load conversations when entering the inbox
        this.store.loadConversations();
    }
}
