import { ComponentFixture, TestBed } from '@angular/core/testing';
import { YouthLayout } from './youth-layout';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

describe('YouthLayout', () => {
    let component: YouthLayout;
    let fixture: ComponentFixture<YouthLayout>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [YouthLayout],
            providers: [provideRouter([]), provideHttpClient()]
        })
            .compileComponents();

        fixture = TestBed.createComponent(YouthLayout);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
