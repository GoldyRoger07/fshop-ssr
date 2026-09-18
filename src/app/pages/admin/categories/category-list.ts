import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminService, CategoryRequest } from '../../../services/admin.service';
import { Category } from '../../../models/category.model';
import { errorMessage } from '../../../shared/api-error';

/** Liste des catégories et formulaire d'ajout / modification. */
@Component({
  selector: 'app-admin-category-list',
  imports: [ReactiveFormsModule],
  templateUrl: './category-list.html',
})
export default class CategoryList {
  private readonly admin = inject(AdminService);
  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly categories = signal<Category[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly submitting = signal(false);

  /** Catégorie en cours de modification (null = création). */
  protected readonly editing = signal<Category | null>(null);
  protected readonly confirmingDelete = signal<number | null>(null);

  protected readonly form = this.fb.group({
    name: ['', Validators.required],
    slug: ['', [Validators.required, Validators.pattern(/^[a-z0-9]+(-[a-z0-9]+)*$/)]],
    image: [''],
  });

  constructor() {
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    this.admin.listCategories().subscribe({
      next: (categories) => {
        this.categories.set(categories);
        this.loading.set(false);
      },
      error: (err: unknown) => {
        this.error.set(errorMessage(err));
        this.loading.set(false);
      },
    });
  }

  protected edit(category: Category): void {
    this.editing.set(category);
    this.error.set(null);
    this.form.setValue({
      name: category.name,
      slug: category.slug,
      image: category.image ?? '',
    });
  }

  protected cancelEdit(): void {
    this.editing.set(null);
    this.form.reset();
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.error.set('Nom obligatoire, et slug au format « a-z, 0-9, tirets ».');
      return;
    }

    const value = this.form.getRawValue();
    const request: CategoryRequest = {
      name: value.name.trim(),
      slug: value.slug.trim(),
      image: value.image.trim() || undefined,
    };

    this.submitting.set(true);
    this.error.set(null);
    const current = this.editing();
    const save =
      current?.id === undefined
        ? this.admin.createCategory(request)
        : this.admin.updateCategory(current.id, request);

    save.subscribe({
      next: () => {
        this.submitting.set(false);
        this.cancelEdit();
        this.load();
      },
      error: (err: unknown) => {
        this.submitting.set(false);
        this.error.set(errorMessage(err));
      },
    });
  }

  protected remove(category: Category): void {
    if (category.id === undefined) {
      return;
    }
    this.error.set(null);
    this.admin.deleteCategory(category.id).subscribe({
      next: () => {
        this.confirmingDelete.set(null);
        this.load();
      },
      error: (err: unknown) => {
        this.confirmingDelete.set(null);
        this.error.set(errorMessage(err));
      },
    });
  }
}
