import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { EventPage } from './event';

describe('EventPage', () => {
    let component: EventPage;
    let fixture: ComponentFixture<EventPage>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EventPage],
            providers: [provideHttpClient()]
        })
            .compileComponents();

        fixture = TestBed.createComponent(EventPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
