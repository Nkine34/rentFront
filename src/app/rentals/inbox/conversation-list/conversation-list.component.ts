
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { ConversationStore } from '../../state/conversation.store';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-conversation-list',
    standalone: true,
    imports: [CommonModule, MatListModule, MatIconModule],
    templateUrl: './conversation-list.component.html',
    styleUrls: ['./conversation-list.component.scss']
})
export class ConversationListComponent {
    readonly store = inject(ConversationStore);

    selectConversation(id: number) {
        this.store.selectConversation(id);
    }
}
