import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-terms-conditions',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="legal-page">
      <div class="container">
        <!-- Page Header -->
        <header class="legal-header">
          <span class="badge-tag">Terms of Service</span>
          <h1 class="page-title">Terms and Conditions</h1>
          <p class="effective-date">Please read these terms carefully before using our Service</p>
        </header>

        <!-- Document Content -->
        <article class="legal-card">
          <div class="intro-block">
            <p>
              Please read these Terms and Conditions ("Terms", "Terms and Conditions") carefully before using the 
              <a href="https://southcolours.in/" target="_blank" rel="noopener noreferrer">https://southcolours.in/</a> website (the "Service") 
              operated by SouthColours ("us", "we", or "our").
            </p>
            <p>
              Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users and others who access or use the Service.
            </p>
            <p>
              By accessing or using the Service you agree to be bound by these Terms. If you disagree with any part of the terms then you may not access the Service.
            </p>
          </div>

          <!-- Accounts -->
          <section class="policy-section">
            <h2>Accounts</h2>
            <p>
              When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
            </p>
            <p>
              You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password, whether your password is with our Service or a third-party service.
            </p>
            <p>
              You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
            </p>
          </section>

          <!-- Links To Other Web Sites -->
          <section class="policy-section">
            <h2>Links To Other Web Sites</h2>
            <p>
              Our Service may contain links to third-party web sites or services that are not owned or controlled by SouthColours.
            </p>
            <p>
              SouthColours has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third party web sites or services. You further acknowledge and agree that SouthColours shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with use of or reliance on any such content, goods or services available on or through any such web sites or services.
            </p>
            <p>
              We strongly advise you to read the terms and conditions and privacy policies of any third-party web sites or services that you visit.
            </p>
          </section>

          <!-- Termination -->
          <section class="policy-section">
            <h2>Termination</h2>
            <p>
              We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
            </p>
            <p>
              All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity and limitations of liability.
            </p>
            <p>
              We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
            </p>
            <p>
              Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, you may simply discontinue using the Service.
            </p>
            <p>
              All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity and limitations of liability.
            </p>
          </section>

          <!-- General Conditions -->
          <section class="policy-section">
            <h2>General Conditions</h2>
            <p>We reserve the right to refuse service to anyone for any reason at any time.</p>
            <p>
              You understand that your content (not including credit card information), may be transferred unencrypted and involve (a) transmissions over various networks; and (b) changes to conform and adapt to technical requirements of connecting networks or devices. Credit card information is always encrypted during transfer over networks.
            </p>
            <p>
              You agree not to reproduce, duplicate, copy, sell, resell or exploit any portion of the Service, use of the Service, or access to the Service or any contact on the website through which the service is provided, without express written permission by us.
            </p>
            <p>
              The headings used in this agreement are included for convenience only and will not limit or otherwise affect these Terms.
            </p>
          </section>

          <!-- Products -->
          <section class="policy-section">
            <h2>Products</h2>
            <p>
              Certain products may be available exclusively online through the website. These products may have limited quantities and are subject to return or exchange only according to our Return Policy.
            </p>
            <p>
              We have made every effort to display as accurately as possible the colors and images of our products that appear at the store. We cannot guarantee that your computer monitor’s display of any color will be accurate.
            </p>
            <p>
              We reserve the right, but are not obligated, to limit the sales of our products or Services to any person, geographic region or jurisdiction. We may exercise this right on a case-by-case basis. We reserve the right to limit the quantities of any products or services that we offer. All descriptions of products or product pricing are subject to change at anytime without notice, at the sole discretion of us. We reserve the right to discontinue any product at any time. Any offer for any product or service made on this site is void where prohibited.
            </p>
            <p>
              We do not warrant that the quality of any products, services, information, or other material purchased or obtained by you will meet your expectations, or that any errors in the Service will be corrected.
            </p>
          </section>

          <!-- Governing Law -->
          <section class="policy-section">
            <h2>Governing Law</h2>
            <p>
              These Terms shall be governed and construed in accordance with the laws of Karnataka, India, without regard to its conflict of law provisions.
            </p>
            <p>
              Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect. These Terms constitute the entire agreement between us regarding our Service, and supersede and replace any prior agreements we might have between us regarding the Service.
            </p>
          </section>

          <!-- Prohibited Uses -->
          <section class="policy-section">
            <h2>PROHIBITED USES</h2>
            <p>
              In addition to other prohibitions as set forth in the Terms of Service, you are prohibited from using the site or its content:
            </p>
            <ul class="styled-list">
              <li>(a) for any unlawful purpose;</li>
              <li>(b) to solicit others to perform or participate in any unlawful acts;</li>
              <li>(c) to violate any international, federal, provincial or state regulations, rules, laws, or local ordinances;</li>
              <li>(d) to infringe upon or violate our intellectual property rights or the intellectual property rights of others;</li>
              <li>(e) to harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate based on gender, sexual orientation, religion, ethnicity, race, age, national origin, or disability;</li>
              <li>(f) to submit false or misleading information;</li>
              <li>(g) to upload or transmit viruses or any other type of malicious code that will or may be used in any way that will affect the functionality or operation of the Service or of any related website, other websites, or the Internet;</li>
              <li>(h) to collect or track the personal information of others;</li>
              <li>(i) to spam, phish, pharm, pretext, spider, crawl, or scrape;</li>
              <li>(j) for any obscene or immoral purpose; or</li>
              <li>(k) to interfere with or circumvent the security features of the Service or any related website, other websites, or the Internet.</li>
            </ul>
            <div class="warning-box">
              <p>We reserve the right to terminate your use of the Service or any related website for violating any of the prohibited uses.</p>
            </div>
          </section>

          <!-- Changes -->
          <section class="policy-section">
            <h2>Changes</h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
            </p>
            <p>
              By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, please stop using the Service.
            </p>
          </section>

          <!-- Contact Us -->
          <section class="policy-section contact-box">
            <h2>Contact Us</h2>
            <p>If you have any questions about these Terms, please contact us:</p>
            <p class="contact-email">
              By email: <a href="mailto:prasuna.goje@gmail.com">prasuna.goje&#64;gmail.com</a>
            </p>
          </section>
        </article>
      </div>
    </div>
  `,
  styles: [`
    .legal-page {
      background-color: var(--bg-page, #FFF9FB);
      color: var(--text-dark, #18263B);
      padding: 56px 0 80px;
      min-height: 80vh;
    }

    .container {
      max-width: 900px;
      margin: 0 auto;
      padding: 0 20px;
    }

    .legal-header {
      text-align: center;
      margin-bottom: 40px;
    }

    .badge-tag {
      display: inline-block;
      background: #FFF0F5;
      color: var(--primary-pink, #FF4081);
      border: 1px solid var(--border-pink, #F3DCE5);
      border-radius: 9999px;
      padding: 4px 14px;
      font-size: 12px;
      font-weight: 700;
      margin-bottom: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .page-title {
      font-size: 38px;
      font-weight: 800;
      color: var(--dark-navy, #18263B);
      margin-bottom: 8px;
    }

    .effective-date {
      font-size: 13px;
      color: var(--text-muted, #666666);
    }

    .legal-card {
      background: #FFFFFF;
      border: 1px solid var(--border-pink, #F3DCE5);
      border-radius: 20px;
      padding: 48px 44px;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.03);
    }

    .intro-block {
      padding-bottom: 24px;
      border-bottom: 1px solid #F1F5F9;
      margin-bottom: 32px;
      p {
        font-size: 15px;
        line-height: 1.75;
        color: var(--text-dark, #18263B);
        margin-bottom: 14px;
        &:last-child { margin-bottom: 0; }
        a {
          color: var(--primary-pink, #FF4081);
          font-weight: 700;
          text-decoration: underline;
        }
      }
    }

    .policy-section {
      margin-bottom: 36px;
      h2 {
        font-size: 22px;
        font-weight: 800;
        color: var(--dark-navy, #18263B);
        margin-bottom: 14px;
        padding-bottom: 8px;
        border-bottom: 2px solid #FFF0F5;
      }
      p {
        font-size: 14.5px;
        line-height: 1.75;
        color: #475569;
        margin-bottom: 12px;
      }
    }

    .styled-list {
      padding-left: 20px;
      margin-bottom: 16px;
      li {
        font-size: 14.5px;
        color: #475569;
        line-height: 1.8;
        margin-bottom: 6px;
      }
    }

    .warning-box {
      background: #FEF2F2;
      border: 1px solid #FECACA;
      border-radius: 12px;
      padding: 16px 20px;
      margin-top: 14px;
      p {
        color: #991B1B;
        font-weight: 600;
        margin: 0;
      }
    }

    .contact-box {
      background: linear-gradient(135deg, #FFF0F5 0%, #FFFFFF 100%);
      border: 1px solid var(--border-pink, #F3DCE5);
      border-radius: 16px;
      padding: 24px;
      margin-bottom: 0;
      .contact-email {
        font-size: 15px;
        margin: 0;
        a {
          color: var(--primary-pink, #FF4081);
          font-weight: 700;
          text-decoration: underline;
        }
      }
    }

    @media (max-width: 768px) {
      .legal-card {
        padding: 28px 20px;
        border-radius: 16px;
      }
      .page-title {
        font-size: 28px;
      }
    }
  `]
})
export class TermsConditionsComponent implements OnInit {
  constructor(private titleService: Title, private metaService: Meta) {}

  ngOnInit() {
    this.titleService.setTitle('Terms and Conditions | SouthColours');
    this.metaService.updateTag({
      name: 'description',
      content: 'Read the Terms and Conditions for using our website, services, and purchasing products.'
    });
  }
}
