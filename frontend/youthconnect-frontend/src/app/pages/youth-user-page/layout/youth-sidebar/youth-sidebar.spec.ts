import { ComponentFixture, TestBed } from '@angular/core/testing';
import { YouthSidebar } from './youth-sidebar';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

describe('YouthSidebar', () => {
    let component: YouthSidebar;
    let fixture: ComponentFixture<YouthSidebar>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [YouthSidebar],
            providers: [provideRouter([]), provideHttpClient()]
        })
            .compileComponents();

        fixture = TestBed.createComponent(YouthSidebar);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
