import { computed, Injectable, signal } from '@angular/core';

export type Language = 'es' | 'en';

type HomeMessages = {
  languageAlt: string;
  introLineOne: string;
  introLineTwo: string;
  characterTitle: string;
  characterSubtitle: string;
  chromaticTitle: string;
  chromaticSubtitle: string;
  challengeTitle: string;
  challengeSubtitle: string;
};

const HOME_MESSAGES: Record<Language, HomeMessages> = {
  es: {
    languageAlt: 'Cambiar idioma a ingles',
    introLineOne: 'Eleg\u00ed tu modo de juego',
    introLineTwo: 'y pon\u00e9 a prueba tu ojo art\u00edstico',
    characterTitle: 'PERSONAJES',
    characterSubtitle: 'Adivina el personaje por sus colores',
    chromaticTitle: 'CROM\u00c1TICO',
    chromaticSubtitle: 'Adivina con precisi\u00f3n el color indicado',
    challengeTitle: 'DESAF\u00cdO',
    challengeSubtitle: 'Un reto que combina ambos modos'
  },
  en: {
    languageAlt: 'Switch language to Spanish',
    introLineOne: 'Choose your game mode',
    introLineTwo: 'and put your artistic eye to the test',
    characterTitle: 'CHARACTERS',
    characterSubtitle: 'Guess the character by their colors',
    chromaticTitle: 'CHROMATIC',
    chromaticSubtitle: 'Guess the target color precisely',
    challengeTitle: 'CHALLENGE',
    challengeSubtitle: 'A mode that combines both challenges'
  }
};

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  private readonly storageKey = 'palette-guess-language';
  private readonly languageState = signal<Language>(this.getStoredLanguage());
  private readonly transitionState = signal<'idle' | 'out' | 'in'>('idle');
  private transitionTimeouts: ReturnType<typeof setTimeout>[] = [];

  readonly language = this.languageState.asReadonly();
  readonly home = computed(() => HOME_MESSAGES[this.languageState()]);
  readonly languageIcon = computed(() => `icons/${this.languageState() === 'es' ? 'spanish' : 'english'}.png`);
  readonly languageTransitionState = this.transitionState.asReadonly();
  readonly languageTransitioning = computed(() => this.transitionState() !== 'idle');

  toggleLanguage(): void {
    if (this.languageTransitioning()) {
      return;
    }

    this.clearTransitionTimeouts();
    this.transitionState.set('out');

    this.transitionTimeouts.push(setTimeout(() => {
      this.applyNextLanguage();
      this.transitionState.set('in');
    }, 170));

    this.transitionTimeouts.push(setTimeout(() => {
      this.transitionState.set('idle');
      this.clearTransitionTimeouts();
    }, 420));
  }

  private applyNextLanguage(): void {
    const nextLanguage = this.languageState() === 'es' ? 'en' : 'es';
    this.languageState.set(nextLanguage);
    this.storeLanguage(nextLanguage);
  }

  private clearTransitionTimeouts(): void {
    this.transitionTimeouts.forEach((timeout) => clearTimeout(timeout));
    this.transitionTimeouts = [];
  }

  private getStoredLanguage(): Language {
    if (typeof sessionStorage === 'undefined') {
      return 'es';
    }

    const storedLanguage = sessionStorage.getItem(this.storageKey);
    return storedLanguage === 'en' || storedLanguage === 'es' ? storedLanguage : 'es';
  }

  private storeLanguage(language: Language): void {
    if (typeof sessionStorage === 'undefined') {
      return;
    }

    sessionStorage.setItem(this.storageKey, language);
  }
}
