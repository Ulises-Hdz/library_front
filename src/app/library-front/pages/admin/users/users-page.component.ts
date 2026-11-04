import { Component, computed, inject, signal } from '@angular/core';
import { UsersService } from '../../../../admin/services/users.service';
import { ToastService } from '../../../../shared/toast/toast.service';
import { ConfirmDialogService } from '../../../../shared/confirm-dialog/confirm-dialog.service';
import { UserItem } from '../../../../auth/services/auth.service';

@Component({
  selector: 'app-users-page',
  templateUrl: './users-page.component.html',
})
export class UsersPageComponent {
  private usersService = inject(UsersService);
  private toast = inject(ToastService);
  private confirmDialog = inject(ConfirmDialogService);

  users = signal<UserItem[]>([]);
  search = signal('');
  onlyBlocked = signal(false);

  filtered = computed(() => {
    const term = this.search().trim().toLowerCase();
    return this.users().filter((u) =>
      (!this.onlyBlocked() || u.status === 'BLOCKED') &&
      (!term || [u.full_name, u.email].some((v) => (v ?? '').toLowerCase().includes(term)))
    );
  });

  constructor() {
    this.load();
  }

  load() {
    this.usersService.getUsers().subscribe((users) => this.users.set(users));
  }

  toggleSanction(user: UserItem) {
    const blocking = user.status !== 'BLOCKED';
    const action = blocking ? 'Sancionar (bloquear)' : 'Reactivar';
    this.confirmDialog
      .confirm({
        title: action,
        message: `¿${action} a ${user.full_name}?`,
        confirmText: blocking ? 'Sancionar' : 'Reactivar',
        danger: blocking,
      })
      .subscribe((ok) => {
        if (!ok) return;
        this.usersService.setUserStatus(user._id, blocking ? 'BLOCKED' : 'ACTIVE').subscribe({
          next: () => {
            this.toast.success(blocking ? 'Usuario sancionado.' : 'Usuario reactivado.');
            this.load();
          },
          error: () => this.toast.error('No se pudo actualizar el usuario.'),
        });
      });
  }

  isRol(rol: string) {
    switch(rol) {
      case 'STUDENT':
        return 'Estudiante'

      case 'ADMIN':
        return 'Administrativo'

      default:
        return '';
    }
  }

  initials(name: string) {
    const parts = (name ?? '').trim().split(/\s+/).filter(Boolean);
    return ((parts[0]?.[0] ?? '') + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase() || '?';
  }
}
