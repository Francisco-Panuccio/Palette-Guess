import { Component, OnInit } from '@angular/core';
import { MessagesService } from '../../services/messages.service';
import { LoadingComponent } from '../loading/loading.component';
import { ImagePreloadService } from '../../services/image-preload.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [LoadingComponent, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  loading: boolean = true;

  constructor(
    protected readonly messages: MessagesService,
    private readonly imagePreloadService: ImagePreloadService
  ) { }

  protected changeLanguage(): void {
    this.messages.toggleLanguage();
  }

  ngOnInit(): void {
    this.imagePreloadService
      .preloadAll()
      .finally(() => {
        this.loading = false;
      });
  }
}
