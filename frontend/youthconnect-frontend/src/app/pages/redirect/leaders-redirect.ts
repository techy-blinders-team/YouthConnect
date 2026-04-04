import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-leaders-redirect',
    template: '',
    standalone: true
})
export class LeadersRedirect implements OnInit {
    constructor(private router: Router) { }

    ngOnInit() {
        this.router.navigate(['/']).then(() => {
            setTimeout(() => {
                const leadersSection = document.getElementById('leaders');
                if (leadersSection) {
                    leadersSection.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        });
    }
}
