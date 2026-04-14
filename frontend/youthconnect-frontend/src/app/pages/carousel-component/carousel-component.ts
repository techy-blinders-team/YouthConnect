import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-carousel-component',
  imports: [CommonModule],
  templateUrl: './carousel-component.html',
  styleUrl: './carousel-component.scss',
})
export class CarouselComponent implements OnInit, OnDestroy {
  backgroundImages = [
    '/assets/landing-page-bg.png',
    '/assets/header_background.png',
  ];

  currentImageIndex = 0;
  private carouselSubscription: Subscription |undefined;
  autoplayInterval = 5000; 

  constructor (private router: Router){}
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
    this.currentImageIndex = (this.currentImageIndex + 1) % this.backgroundImages.length;
  }

  prevImage(): void {
    this.currentImageIndex = (this.currentImageIndex - 1 + this.backgroundImages.length) % this.backgroundImages.length;
  }

  goToImage(index: number): void {
    this.currentImageIndex = index;
  }

  get currentBackgroundImage(): string {
    return `url('${this.backgroundImages[this.currentImageIndex]}')`;
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
