import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-whatsapp-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="floating-social-group">
      <!-- Instagram Button -->
      <a
        [href]="instagramUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="social-float-btn instagram-float-btn"
        aria-label="Follow us on Instagram"
      >
        <span class="instagram-ambient-glow"></span>
        <div class="social-icon-box">
          <svg
            viewBox="0 0 24 24"
            class="social-svg instagram-svg"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
          </svg>
        </div>
        <span class="social-tooltip">Follow on Instagram</span>
      </a>

      <!-- WhatsApp Button -->
      <a
        [href]="whatsappUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="social-float-btn whatsapp-float-btn"
        aria-label="Chat with us on WhatsApp"
      >
        <span class="whatsapp-ripple"></span>
        <div class="social-icon-box">
          <!-- Official WhatsApp SVG icon -->
          <svg
            viewBox="0 0 32 32"
            class="social-svg whatsapp-svg"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              fill="currentColor"
              d="M16.002 0C7.165 0 0 7.165 0 16.002c0 2.825.738 5.58 2.143 8.01L0 32l8.196-2.115a15.908 15.908 0 0 0 7.806 2.053h.006C24.839 31.938 32 24.773 32 16.002 32 7.165 24.839 0 16.002 0zm0 29.239a13.23 13.23 0 0 1-6.745-1.847l-.484-.287-5.008 1.291 1.339-4.882-.315-.502a13.228 13.228 0 0 1-2.036-7.014c0-7.306 5.945-13.251 13.255-13.251 3.541 0 6.869 1.379 9.373 3.884a13.177 13.177 0 0 1 3.879 9.369c-.004 7.309-5.949 13.257-13.258 13.257zm7.269-9.924c-.398-.2-2.358-1.164-2.723-1.297-.365-.133-.63-.2-.896.2-.266.398-1.03 1.297-1.263 1.562-.233.266-.465.299-.864.1-.399-.2-1.684-.621-3.208-1.979-1.185-1.057-1.986-2.363-2.219-2.762-.233-.399-.025-.614.175-.813.18-.179.399-.465.598-.698.199-.233.266-.399.399-.665.133-.266.066-.498-.033-.698-.1-.2-.897-2.161-1.23-2.959-.324-.777-.653-.671-.896-.684-.233-.011-.499-.013-.765-.013-.266 0-.698.1-1.063.499-.365.399-1.396 1.363-1.396 3.324 0 1.961 1.429 3.856 1.628 4.122.2.266 2.812 4.294 6.812 6.02.952.41 1.695.656 2.274.839.956.304 1.826.261 2.513.158.766-.114 2.358-.964 2.69-1.895.332-.931.332-1.729.233-1.895-.1-.166-.365-.266-.764-.466z"
            />
          </svg>
        </div>
        <span class="social-tooltip">Chat with us</span>
      </a>
    </div>
  `,
  styles: [`
    .floating-social-group {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 9990;
      display: flex;
      flex-direction: column;
      gap: 12px;
      align-items: center;
    }

    .social-float-btn {
      position: relative;
      width: 58px;
      height: 58px;
      border-radius: 50%;
      color: #FFFFFF;
      display: flex;
      align-items: center;
      justify-content: center;
      text-decoration: none;
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;

      &:active {
        transform: translateY(0) scale(0.96);
      }
    }

    .whatsapp-float-btn {
      background: #25D366;
      background: linear-gradient(135deg, #25D366 0%, #1EBE5D 100%);
      box-shadow: 0 4px 16px rgba(37, 211, 102, 0.42), 0 2px 6px rgba(0, 0, 0, 0.12);

      &:hover {
        transform: translateY(-3px) scale(1.08);
        box-shadow: 0 8px 24px rgba(37, 211, 102, 0.5), 0 4px 10px rgba(0, 0, 0, 0.18);
        color: #FFFFFF;

        .social-tooltip {
          opacity: 1;
          visibility: visible;
          transform: translateX(0);
        }
      }
    }

    .instagram-float-btn {
      background: radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%);
      box-shadow: 0 4px 16px rgba(214, 36, 159, 0.38), 0 2px 6px rgba(0, 0, 0, 0.12);
      animation: instaFloat 3.5s ease-in-out infinite;

      &:hover {
        animation-play-state: paused;
        transform: translateY(-4px) scale(1.12);
        box-shadow: 0 10px 28px rgba(214, 36, 159, 0.55), 0 4px 12px rgba(0, 0, 0, 0.2);
        color: #FFFFFF;

        .instagram-svg {
          animation: instaWiggle 0.6s ease-in-out;
        }

        .social-tooltip {
          opacity: 1;
          visibility: visible;
          transform: translateX(0);
        }
      }
    }

    /* Ambient pulse glow for Instagram */
    .instagram-ambient-glow {
      position: absolute;
      top: -4px;
      left: -4px;
      right: -4px;
      bottom: -4px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(214, 36, 159, 0.6) 0%, rgba(253, 89, 73, 0.3) 50%, transparent 70%);
      opacity: 0.7;
      animation: instaPulse 2.8s infinite ease-out;
      pointer-events: none;
      z-index: 1;
    }

    @keyframes instaFloat {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-5px);
      }
    }

    @keyframes instaPulse {
      0% {
        transform: scale(0.9);
        opacity: 0.8;
      }
      60% {
        transform: scale(1.35);
        opacity: 0;
      }
      100% {
        transform: scale(1.35);
        opacity: 0;
      }
    }

    @keyframes instaWiggle {
      0% { transform: rotate(0deg) scale(1); }
      20% { transform: rotate(-12deg) scale(1.15); }
      40% { transform: rotate(10deg) scale(1.15); }
      60% { transform: rotate(-6deg) scale(1.1); }
      80% { transform: rotate(4deg) scale(1.05); }
      100% { transform: rotate(0deg) scale(1); }
    }

    .social-icon-box {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      z-index: 2;
    }

    .social-svg {
      filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.15));
    }

    .whatsapp-svg {
      width: 32px;
      height: 32px;
    }

    .instagram-svg {
      width: 30px;
      height: 30px;
    }

    /* Ambient pulse wave around WhatsApp button */
    .whatsapp-ripple {
      position: absolute;
      top: -4px;
      left: -4px;
      right: -4px;
      bottom: -4px;
      border-radius: 50%;
      border: 2px solid #25D366;
      opacity: 0.7;
      animation: pulseRipple 2.4s infinite ease-out;
      pointer-events: none;
      z-index: 1;
    }

    @keyframes pulseRipple {
      0% {
        transform: scale(0.95);
        opacity: 0.8;
      }
      50% {
        transform: scale(1.25);
        opacity: 0;
      }
      100% {
        transform: scale(1.25);
        opacity: 0;
      }
    }

    /* Desktop hover tooltip */
    .social-tooltip {
      position: absolute;
      right: 68px;
      background: #18263B;
      color: #FFFFFF;
      font-size: 13px;
      font-weight: 600;
      padding: 6px 12px;
      border-radius: 8px;
      white-space: nowrap;
      pointer-events: none;
      opacity: 0;
      visibility: hidden;
      transform: translateX(6px);
      transition: all 0.25s ease;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

      &::after {
        content: '';
        position: absolute;
        top: 50%;
        right: -5px;
        transform: translateY(-50%);
        border-width: 5px 0 5px 6px;
        border-style: solid;
        border-color: transparent transparent transparent #18263B;
      }
    }

    /* Responsive adjustments for mobile */
    @media (max-width: 768px) {
      .floating-social-group {
        bottom: 20px;
        right: 18px;
        gap: 10px;
      }

      .social-float-btn {
        width: 50px;
        height: 50px;
      }

      .whatsapp-svg {
        width: 27px;
        height: 27px;
      }

      .instagram-svg {
        width: 25px;
        height: 25px;
      }

      .social-tooltip {
        display: none;
      }
    }
  `]
})
export class WhatsappButtonComponent {
  readonly phoneNumber = '919398293994';
  readonly defaultMessage = 'Hello Southcolours, I would like to know more about your collection!';
  readonly instagramUrl = 'https://www.instagram.com/south_colours';

  get whatsappUrl(): string {
    return `https://wa.me/${this.phoneNumber}?text=${encodeURIComponent(this.defaultMessage)}`;
  }
}
