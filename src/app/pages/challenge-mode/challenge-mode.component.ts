import { Component, OnInit } from '@angular/core';
import { LoadingComponent } from "../loading/loading.component";
import { MessagesService } from '../../services/messages.service';
import { ImagePreloadService } from '../../services/image-preload.service';

@Component({
  selector: 'app-challenge-mode',
  imports: [LoadingComponent],
  templateUrl: './challenge-mode.component.html',
  styleUrl: './challenge-mode.component.css'
})
export class ChallengeModeComponent implements OnInit {
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
