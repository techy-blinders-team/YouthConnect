import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';

interface SkOfficialSet {
  images: string[];
  name: string;
}

@Component({
  selector: 'app-leaders-landing-page',
  imports: [],
  templateUrl: './leaders-landing-page.html',
  styleUrl: './leaders-landing-page.scss',
})
export class LeadersLandingPage implements OnInit, OnDestroy {
  
  skOfficialSets: SkOfficialSet[] = [
    {
      name: 'First Set',
      images: [
        '/assets/sk-official-1.png',
        '/assets/sk-official-2.png',
        '/assets/sk-official-3.png',
        '/assets/sk-official-4.png',
      ]
    },
    {
      name: 'Second Set',
      images: [
        '/assets/sk-official-5.png',
        '/assets/sk-official-6.png',
        '/assets/sk-official-7.png',
        '/assets/sk-official-8.png'
      ]
    }
  ];

  currentSetIndex = 0;
  private carouselSubscription: Subscription | undefined;
  autoplayInterval = 6000;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.startAutoplay();
  }

  ngOnDestroy(): void {
    if (this.carouselSubscription) {
      this.carouselSubscription.unsubscribe();
    }
  }

  startAutoplay(): void {
    this.carouselSubscription = interval(this.autoplayInterval).subscribe(() => {
      this.nextImage();
    });
  }


  nextImage(): void {
    this.currentSetIndex = (this.currentSetIndex + 1) % this.skOfficialSets.length;
  }


  prevImage(): void {
    this.currentSetIndex = (this.currentSetIndex - 1 + this.skOfficialSets.length) % this.skOfficialSets.length;
  }


  goToSet(index: number): void {
    if (index >= 0 && index < this.skOfficialSets.length) {
      this.currentSetIndex = index;
    }
  }


  get currentSkOfficialSet(): SkOfficialSet {
    return this.skOfficialSets[this.currentSetIndex];
  }


  get official1Image(): string {
    return this.currentSkOfficialSet.images[0];
  }

  get official2Image(): string {
    return this.currentSkOfficialSet.images[1];
  }

  get official3Image(): string {
    return this.currentSkOfficialSet.images[2];
  }

  get official4Image(): string {
    return this.currentSkOfficialSet.images[3];
  }

  // Static images for mobile view (always show the same officials)
  get official5Image(): string {
    return '/assets/sk-official-5.png';
  }

  get official6Image(): string {
    return '/assets/sk-official-6.png';
  }

  get official7Image(): string {
    return '/assets/sk-official-7.png';
  }

  get official8Image(): string {
    return '/assets/sk-official-8.png';
  }

  // Static getters for mobile - always show officials 1-4 regardless of carousel
  get official1ImageStatic(): string {
    return '/assets/sk-official-1.png';
  }

  get official2ImageStatic(): string {
    return '/assets/sk-official-2.png';
  }

  get official3ImageStatic(): string {
    return '/assets/sk-official-3.png';
  }

  get official4ImageStatic(): string {
    return '/assets/sk-official-4.png';
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}