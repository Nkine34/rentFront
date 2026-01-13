import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';

/**
 * Component responsable de traiter le callback Keycloak.
 * Décide le JWT du localStorage et met à jour l'état utilisateur.
 */
@Component({
  selector: 'app-callback',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="callback-container">
      <p>Traitement de votre connexion...</p>
    </div>
  `,
  styles: [`
    .callback-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      font-size: 18px;
    }
  `]
})
export class CallbackComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.processCallback();
  }

  private processCallback(): void {
    try {
      // Récupérer le token depuis le localStorage
      // (il a été sauvegardé par LoginComponent/AuthService)
      const token = this.authService.getToken();

      if (!token) {
        console.warn('Aucun token trouvé dans le callback');
        this.router.navigate(['/login']);
        return;
      }

      // Décoder le token pour extraire les informations utilisateur
      const user = this.authService.decodeJwt(token);
      if (user) {
        this.authService.currentUser.set(user);
        console.log('Utilisateur chargé:', user);
      }

      // Charger le profil complet depuis l'API
      this.authService.loadCurrentUser().subscribe({
        next: (currentUser) => {
          console.log('Profil utilisateur chargé du serveur:', currentUser);
          // Rediriger vers l'URL de retour ou l'accueil
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
          this.router.navigateByUrl(returnUrl);
        },
        error: (error) => {
          console.warn('Erreur lors du chargement du profil utilisateur, redirection quand même:', error);
          // On redirige quand même, le profil décédé du JWT est disponible
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
          this.router.navigateByUrl(returnUrl);
        }
      });
    } catch (error) {
      console.error('Erreur lors du traitement du callback:', error);
      this.router.navigate(['/login']);
    }
  }
}

