import { Component, OnInit } from '@angular/core';
import { MessagesService } from '../../services/messages.service';
import { ImagePreloadService } from '../../services/image-preload.service';
import { LoadingComponent } from '../loading/loading.component';
import { RouterLink } from '@angular/router';

type RgbColor = {
  r: number;
  g: number;
  b: number;
};

@Component({
  selector: 'app-chromatic-mode',
  imports: [LoadingComponent, RouterLink],
  templateUrl: './chromatic-mode.component.html',
  styleUrl: './chromatic-mode.component.css'
})
export class ChromaticModeComponent implements OnInit {
  loading: boolean = true;
  hue: number = 268;
  saturation: number = 62;
  brightness: number = 74;
  objectiveHex: string = '#8E6CC9';
  accuracy: number | null = null;
  confirmed: boolean = false;

  constructor(
    protected readonly messages: MessagesService,
    private readonly imagePreloadService: ImagePreloadService
  ) { }

  protected changeLanguage(): void {
    this.messages.toggleLanguage();
  }

  protected get yourColorHex(): string {
    return this.rgbToHex(this.hsvToRgb(this.hue, this.saturation, this.brightness));
  }

  protected get hueBackground(): string {
    return 'linear-gradient(90deg, #f24545, #f5a333, #f0e333, #57d84f, #31d6cf, #3177df, #8d52de, #e842a2, #f24545)';
  }

  protected get saturationBackground(): string {
    const base = `hsl(${this.hue} 100% ${Math.max(this.brightness / 2, 16)}%)`;
    return `linear-gradient(90deg, #b9b9b9, ${base})`;
  }

  protected get brightnessBackground(): string {
    const base = `hsl(${this.hue} ${this.saturation}% 62%)`;
    return `linear-gradient(90deg, #1f2552, ${base})`;
  }

  protected onHueChange(event: Event): void {
    this.hue = this.getRangeValue(event);
    this.clearResult();
  }

  protected onSaturationChange(event: Event): void {
    this.saturation = this.getRangeValue(event);
    this.clearResult();
  }

  protected onBrightnessChange(event: Event): void {
    this.brightness = this.getRangeValue(event);
    this.clearResult();
  }

  protected confirmColor(): void {
    this.accuracy = this.calculateAccuracy(this.objectiveHex, this.yourColorHex);
    this.confirmed = true;
  }

  protected restart(): void {
    this.generateObjectiveColor();
    this.hue = Math.floor(Math.random() * 361);
    this.saturation = 65;
    this.brightness = 78;
    this.clearResult();
  }

  ngOnInit(): void {
    this.imagePreloadService
      .preloadAll()
      .finally(() => {
        this.restart();
        this.loading = false;
      });
  }

  private clearResult(): void {
    this.accuracy = null;
    this.confirmed = false;
  }

  private generateObjectiveColor(): void {
    this.objectiveHex = this.rgbToHex({
      r: this.randomChannel(),
      g: this.randomChannel(),
      b: this.randomChannel()
    });
  }

  private calculateAccuracy(objectiveHex: string, yourHex: string): number {
    const objective = this.hexToRgb(objectiveHex);
    const yourColor = this.hexToRgb(yourHex);
    const distance = Math.sqrt(
      ((objective.r - yourColor.r) ** 2) +
      ((objective.g - yourColor.g) ** 2) +
      ((objective.b - yourColor.b) ** 2)
    );
    const maxDistance = Math.sqrt(3 * (255 ** 2));
    return Math.max(0, Math.round((1 - distance / maxDistance) * 100));
  }

  private getRangeValue(event: Event): number {
    return Number((event.target as HTMLInputElement).value);
  }

  private randomChannel(): number {
    return Math.floor(Math.random() * 256);
  }

  private hsvToRgb(h: number, s: number, v: number): RgbColor {
    const saturation = s / 100;
    const value = v / 100;
    const chroma = value * saturation;
    const x = chroma * (1 - Math.abs(((h / 60) % 2) - 1));
    const match = value - chroma;
    let red = 0;
    let green = 0;
    let blue = 0;

    if (h < 60) {
      red = chroma;
      green = x;
    } else if (h < 120) {
      red = x;
      green = chroma;
    } else if (h < 180) {
      green = chroma;
      blue = x;
    } else if (h < 240) {
      green = x;
      blue = chroma;
    } else if (h < 300) {
      red = x;
      blue = chroma;
    } else {
      red = chroma;
      blue = x;
    }

    return {
      r: Math.round((red + match) * 255),
      g: Math.round((green + match) * 255),
      b: Math.round((blue + match) * 255)
    };
  }

  private rgbToHex(color: RgbColor): string {
    return `#${this.channelToHex(color.r)}${this.channelToHex(color.g)}${this.channelToHex(color.b)}`;
  }

  private channelToHex(value: number): string {
    return value.toString(16).padStart(2, '0').toUpperCase();
  }

  private hexToRgb(hex: string): RgbColor {
    const normalized = hex.replace('#', '');
    return {
      r: parseInt(normalized.slice(0, 2), 16),
      g: parseInt(normalized.slice(2, 4), 16),
      b: parseInt(normalized.slice(4, 6), 16)
    };
  }
}
