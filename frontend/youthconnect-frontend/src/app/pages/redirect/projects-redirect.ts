import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-projects-redirect',
    template: '',
    standalone: true
})
export class ProjectsRedirect implements OnInit {
    constructor(private router: Router) { }

    ngOnInit() {
        this.router.navigate(['/']).then(() => {
            setTimeout(() => {
                const projectsSection = document.getElementById('projects');
                if (projectsSection) {
                    projectsSection.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        });
    }
}
