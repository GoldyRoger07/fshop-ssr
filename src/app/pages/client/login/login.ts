import { Component, computed, inject, input, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';
import { Container } from '../../../components/container/container';
import { errorMessage } from '../../../shared/api-error';

/** Connexion et inscription (/connexion, /connexion?mode=inscription). */
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, Container],
  templateUrl: './login.html',
})
export default class Login {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(NonNullableFormBuilder);

  /** Paramètre d'URL « mode » (lié via withComponentInputBinding). */
  readonly mode = input<string>();
  /** Paramètre d'URL « redirect » : page à ouvrir après la connexion. */
  readonly redirect = input<string>();
  protected readonly isRegister = computed(() => this.mode() === 'inscription');

  protected readonly form = this.fb.group({
    firstName: [''],
    lastName: [''],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  protected readonly submitting = signal(false);
  protected readonly error = signal<string | null>(null);

  protected submit(): void {
    const { firstName, lastName, email, password } = this.form.getRawValue();
    if (this.form.invalid || (this.isRegister() && (!firstName.trim() || !lastName.trim() || password.length < 8))) {
      this.form.markAllAsTouched();
      this.error.set(
        this.isRegister()
          ? 'Renseignez tous les champs (mot de passe de 8 caractères minimum).'
          : 'Renseignez un e-mail valide et votre mot de passe.',
      );
      return;
    }

    this.submitting.set(true);
    this.error.set(null);
    const request = this.isRegister()
      ? this.auth.register({ firstName, lastName, email, password })
      : this.auth.login({ email, password });

    request.subscribe({
      next: () => this.router.navigateByUrl(this.redirect() || '/'),
      error: (err: unknown) => {
        this.submitting.set(false);
        this.error.set(errorMessage(err));
      },
    });
  }
}
