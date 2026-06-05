import { Component, effect, HostListener, OnInit } from '@angular/core';
import { ImagePreloadService } from '../../services/image-preload.service';
import { MessagesService } from '../../services/messages.service';
import { LoadingComponent } from '../loading/loading.component';
import { RouterLink } from '@angular/router';

type Category = 'brands' | 'cartoons' | 'countries';

type CharacterOption = {
  name_es: string;
  name_en: string;
  hint1_es: string;
  hint1_en: string;
  hint2_es: string;
  hint2_en: string;
  colors: string[];
};

@Component({
  selector: 'app-characters-mode',
  imports: [LoadingComponent, RouterLink],
  templateUrl: './characters-mode.component.html',
  styleUrl: './characters-mode.component.css'
})
export class CharactersModeComponent implements OnInit{
  loading: boolean = true;
  choosingCategory: boolean = true;
  categoryLoading: boolean = false;
  selectedCategory: Category | null = null;
  currentOption: CharacterOption | null = null;
  answerLetters: string[] = [];
  hintOneVisible: boolean = false;
  hintTwoVisible: boolean = false;
  wrongAnswer: boolean = false;
  winVisible: boolean = false;
  private categoryOptions: CharacterOption[] = [];
  private readonly usedStoragePrefix = 'palette-guess-characters-used';

  protected readonly categories: Category[] = ['cartoons', 'countries', 'brands'];
  private readonly categoryFiles: Record<Category, string> = {
    brands: 'data/brands.json',
    cartoons: 'data/cartoon_data.json',
    countries: 'data/countries.json'
  };

  constructor(
    protected readonly messages: MessagesService,
    private readonly imagePreloadService: ImagePreloadService
  ) {
    effect(() => {
      this.messages.language();

      if (this.currentOption) {
        this.resetAnswerForCurrentName();
      }
    });
  }

  protected changeLanguage(): void {
    this.messages.toggleLanguage();
  }

  protected get currentName(): string {
    if (!this.currentOption) {
      return '';
    }

    return this.messages.language() === 'es' ? this.currentOption.name_es : this.currentOption.name_en;
  }

  protected get normalizedCurrentName(): string {
    return this.normalizeAnswer(this.currentName);
  }

  protected get currentHintOne(): string {
    if (!this.currentOption) {
      return '';
    }

    return this.messages.language() === 'es' ? this.currentOption.hint1_es : this.currentOption.hint1_en;
  }

  protected get currentHintTwo(): string {
    if (!this.currentOption) {
      return '';
    }

    return this.messages.language() === 'es' ? this.currentOption.hint2_es : this.currentOption.hint2_en;
  }

  protected get categoryTitleMap(): Record<Category, string> {
    return {
      brands: this.messages.characters().brands,
      cartoons: this.messages.characters().cartoons,
      countries: this.messages.characters().countries
    };
  }

  protected get pageTitle(): string {
    return this.selectedCategory ? this.categoryTitleMap[this.selectedCategory] : this.messages.characters().title;
  }

  protected get answerRows(): number[][] {
    let currentIndex = 0;

    return this.currentName
      .trim()
      .split(/\s+/)
      .map((word) => this.normalizeAnswer(word))
      .filter(Boolean)
      .map((word) => Array.from({ length: word.length }, () => currentIndex++));
  }

  protected get answerValue(): string {
    return this.answerLetters.join('');
  }

  protected getColor(index: number): string {
    return this.currentOption?.colors[index] ?? 'transparent';
  }

  protected async chooseCategory(category: Category): Promise<void> {
    this.selectedCategory = category;
    this.categoryLoading = true;

    try {
      const response = await fetch(this.categoryFiles[category]);
      this.categoryOptions = await response.json() as CharacterOption[];
      this.chooseNextOption();
      this.choosingCategory = false;
      this.focusAnswerInputIfDesktop();
    } finally {
      this.categoryLoading = false;
    }
  }

  protected revealHint(hintNumber: 1 | 2): void {
    if (!this.currentOption) {
      return;
    }

    if (hintNumber === 1) {
      this.hintOneVisible = true;
      return;
    }

    this.hintTwoVisible = true;
  }

  protected onAnswerInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = this.normalizeAnswer(input.value).slice(0, this.answerLetters.length);
    this.answerLetters = Array.from({ length: this.answerLetters.length }, (_, index) => value[index] ?? '');
    input.value = value;
    this.wrongAnswer = false;

    if (this.isAnswerComplete()) {
      this.validateAnswer();
    }
  }

  protected focusAnswerInput(input: HTMLInputElement): void {
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
  }

  protected validateAnswer(): void {
    const answer = this.normalizeAnswer(this.answerLetters.join(''));

    if (answer === this.normalizedCurrentName) {
      this.blurActiveInput();
      this.winVisible = true;
      this.wrongAnswer = false;
      return;
    }

    this.wrongAnswer = true;
  }

  protected continueGame(): void {
    this.winVisible = false;
    this.chooseNextOption();
  }

  protected restart(): void {
    this.winVisible = false;
    this.chooseNextOption();
  }

  @HostListener('window:keydown.enter', ['$event'])
  protected onEnterPressed(event: KeyboardEvent): void {
    if (!this.winVisible) {
      return;
    }

    event.preventDefault();
    this.continueGame();
  }

  ngOnInit(): void {
    this.imagePreloadService
      .preloadAll()
      .finally(() => {
        this.loading = false;
      });
  }

  private chooseNextOption(): void {
    if (!this.categoryOptions.length || !this.selectedCategory) {
      return;
    }

    const usedKeys = this.getUsedKeys(this.selectedCategory);
    let availableOptions = this.categoryOptions.filter((option) => !usedKeys.includes(this.getOptionKey(option)));

    if (!availableOptions.length) {
      this.storeUsedKeys(this.selectedCategory, []);
      availableOptions = [...this.categoryOptions];
    }

    const nextIndex = Math.floor(Math.random() * availableOptions.length);
    this.currentOption = availableOptions[nextIndex];
    this.markOptionAsUsed(this.selectedCategory, this.currentOption);
    this.resetAnswerForCurrentName();
    this.hintOneVisible = false;
    this.hintTwoVisible = false;
    this.focusAnswerInputIfDesktop();
  }

  private resetAnswerForCurrentName(): void {
    this.answerLetters = Array.from({ length: this.normalizedCurrentName.length }, () => '');
    this.wrongAnswer = false;
  }

  private getOptionKey(option: CharacterOption): string {
    return `${this.normalizeAnswer(option.name_es)}|${this.normalizeAnswer(option.name_en)}`;
  }

  private markOptionAsUsed(category: Category, option: CharacterOption): void {
    const usedKeys = this.getUsedKeys(category);
    const optionKey = this.getOptionKey(option);

    if (usedKeys.includes(optionKey)) {
      return;
    }

    this.storeUsedKeys(category, [...usedKeys, optionKey]);
  }

  private getUsedKeys(category: Category): string[] {
    if (typeof sessionStorage === 'undefined') {
      return [];
    }

    const storedValue = sessionStorage.getItem(this.getUsedStorageKey(category));

    if (!storedValue) {
      return [];
    }

    try {
      const parsedValue = JSON.parse(storedValue);
      return Array.isArray(parsedValue) ? parsedValue.filter((value) => typeof value === 'string') : [];
    } catch {
      return [];
    }
  }

  private storeUsedKeys(category: Category, usedKeys: string[]): void {
    if (typeof sessionStorage === 'undefined') {
      return;
    }

    sessionStorage.setItem(this.getUsedStorageKey(category), JSON.stringify(usedKeys));
  }

  private getUsedStorageKey(category: Category): string {
    return `${this.usedStoragePrefix}-${category}`;
  }

  private normalizeAnswer(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '');
  }

  private isAnswerComplete(): boolean {
    return this.answerLetters.length > 0 && this.answerLetters.every((letter) => letter);
  }

  private blurActiveInput(): void {
    const activeElement = document.activeElement;

    if (activeElement instanceof HTMLInputElement) {
      activeElement.blur();
    }
  }

  private focusAnswerInputIfDesktop(): void {
    if (!this.isDesktopInputEnvironment()) {
      return;
    }

    setTimeout(() => {
      const answerInput = document.querySelector<HTMLInputElement>('.input_answer');
      answerInput?.focus();
      answerInput?.setSelectionRange(answerInput.value.length, answerInput.value.length);
    });
  }

  private isDesktopInputEnvironment(): boolean {
    return typeof matchMedia !== 'undefined' && matchMedia('(hover: hover) and (pointer: fine)').matches;
  }

}
