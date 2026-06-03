import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MessagesService } from '../../services/messages.service';

@Component({
  selector: 'app-error',
  imports: [RouterLink],
  templateUrl: './error.component.html',
  styleUrl: './error.component.css'
})
export class ErrorComponent {
  constructor(protected readonly messages: MessagesService) { }
}
