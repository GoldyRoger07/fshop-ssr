import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AdminService, ProductRequest } from '../../../services/admin.service';
import { Category } from '../../../models/category.model';
import { ProductTag } from '../../../models/product.model';
import { errorMessage } from '../../../shared/api-error';

/** Création (/admin/produits/nouveau) et édition (/admin/produits/:id) d'un produit. */
@Component({
  selector: 'app-admin-product-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './product-form.html',
})
export default class ProductForm {
  private readonly admin = inject(AdminService);
  private readonly router = inject(Router);
  private readonly fb = inject(NonNullableFormBuilder);

  /** Paramètre d'URL « id » (absent en création). */
  readonly id = input<string>();
  protected readonly productId = computed(() => (this.id() ? Number(this.id()) : null));
  protected readonly isEdit = computed(() => this.productId() !== null);

  protected readonly categories = signal<Category[]>([]);
  protected readonly tags: ProductTag[] = ['new', 'bestseller', 'trending'];
  protected readonly loading = signal(false);
  protected readonly submitting = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly form = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(255)]],
    description: [''],
    image: [''],
    categorySlug: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    originalPrice: [0, Validators.min(0)],
    stock: [0, [Validators.required, Validators.min(0)]],
    tag: [''],
  });

  constructor() {
    this.admin.listCategories().subscribe({ next: (categories) => this.categories.set(categories) });

    effect(() => {
      const id = this.productId();
      if (id === null) {
        return;
      }
      this.loading.set(true);
      this.admin.getProduct(id).subscribe({
        next: (product) => {
          this.form.patchValue({
            title: product.title,
            description: product.description ?? '',
            image: product.image ?? '',
            categorySlug: product.categorySlug,
            price: product.price,
            originalPrice: product.originalPrice ?? 0,
            stock: product.stock ?? 0,
            tag: product.tag ?? '',
          });
          this.loading.set(false);
        },
        error: (err: unknown) => {
          this.error.set(errorMessage(err));
          this.loading.set(false);
        },
      });
    });
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.error.set('Vérifiez les champs obligatoires (titre, catégorie, prix, stock).');
      return;
    }

    const value = this.form.getRawValue();
    const request: ProductRequest = {
      title: value.title.trim(),
      description: value.description.trim() || undefined,
      image: value.image.trim() || undefined,
      categorySlug: value.categorySlug,
      price: value.price,
      // 0 = pas de prix barré
      originalPrice: value.originalPrice > 0 ? value.originalPrice : null,
      stock: value.stock,
      tag: (value.tag as ProductTag) || null,
    };

    this.submitting.set(true);
    this.error.set(null);
    const id = this.productId();
    const save = id === null ? this.admin.createProduct(request) : this.admin.updateProduct(id, request);

    save.subscribe({
      next: () => this.router.navigateByUrl('/admin/produits'),
      error: (err: unknown) => {
        this.submitting.set(false);
        this.error.set(errorMessage(err));
      },
    });
  }
}
