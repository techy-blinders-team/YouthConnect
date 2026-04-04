import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-about-redirect',
    template: '',
    standalone: true
})
export class AboutRedirect implements OnInit {
    constructor(private router: Router) { }

    ngOnInit() {
        this.router.navigate(['/']).then(() => {
            setTimeout(() => {
                const aboutSection = document.getElementById('about');
                if (aboutSection) {
                    aboutSection.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        });
    }
}
