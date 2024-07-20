import { Routes } from '@angular/router';
import { TodoListComponent } from './todo-list/todo-list.component';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./todo-list/todo-list.component').then((c) => TodoListComponent),
  },
];
