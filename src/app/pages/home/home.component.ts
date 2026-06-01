import { Component } from '@angular/core';
import { MessagesService } from '../../services/messages.service';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(protected readonly messages: MessagesService) {}

  protected changeLanguage(): void {
    this.messages.toggleLanguage();
  }
}
