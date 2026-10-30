import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { HeaderComponent } from './shared/components/header.component';
import { FooterComponent } from './shared/components/footer.component';
import { ToastComponent } from './shared/components/toast.component';
import { WhatsappButtonComponent } from './shared/components/whatsapp-button.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent, ToastComponent, WhatsappButtonComponent],
  template: `
    @if (!isAdminRoute()) {
      <app-header />
    }
    
    <main class="app-main">
      <router-outlet />
    </main>

    @if (!isAdminRoute()) {
      <app-footer />
      <app-whatsapp-button />
    }

    <app-toast />
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    .app-main {
      flex: 1;
    }
  `]
})
export class AppComponent {
  constructor(private router: Router) {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      });
  }

  isAdminRoute(): boolean {
    return this.router.url.startsWith('/admin');
  }
}
