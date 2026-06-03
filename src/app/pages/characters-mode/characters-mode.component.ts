import { Component, OnInit } from '@angular/core';
import { ImagePreloadService } from '../../services/image-preload.service';
import { MessagesService } from '../../services/messages.service';
import { LoadingComponent } from '../loading/loading.component';

@Component({
  selector: 'app-characters-mode',
  imports: [LoadingComponent],
  templateUrl: './characters-mode.component.html',
  styleUrl: './characters-mode.component.css'
})
export class CharactersModeComponent implements OnInit{
  loading: boolean = true;

  constructor(
    protected readonly messages: MessagesService,
    private readonly imagePreloadService: ImagePreloadService
  ) { }

  ngOnInit(): void {
    this.imagePreloadService
      .preloadAll()
      .finally(() => {
        this.loading = false;
      });
  }
}