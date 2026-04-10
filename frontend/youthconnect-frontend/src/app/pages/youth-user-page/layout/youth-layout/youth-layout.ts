import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { YouthSidebar } from '../youth-sidebar/youth-sidebar';

@Component({
    selector: 'app-youth-layout',
    standalone: true,
    imports: [RouterOutlet, YouthSidebar],
    templateUrl: './youth-layout.html',
    styleUrl: './youth-layout.scss',
})
export class YouthLayout {

}
