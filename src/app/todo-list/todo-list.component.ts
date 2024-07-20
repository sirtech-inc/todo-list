import { Component, inject, signal } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TodoList } from '../interfaces/todo-list.interface';
import { CurrencyPipe, NgClass } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    NgClass,
    ReactiveFormsModule,
  ],
  templateUrl: './todo-list.component.html',
})
export class TodoListComponent {
  private readonly _fb = inject(FormBuilder);

  value = signal<string>('');
  currentPage = signal<number>(0);
  show = signal<boolean>(false);
  isNew = signal<boolean>(false);
  todolist = signal<TodoList[]>([
    {
      id: 1,
      name: 'Tarea 1',
      date: new Date(),
      state: 'inprocess',
    },
    {
      id: 2,
      name: 'Tarea 2',
      date: new Date(),
      state: 'completed',
    },
  ]);

  form: FormGroup = this._fb.group({
    id: [''],
    name: ['', [Validators.required, Validators.maxLength(100)]],
  });

  addTask(): void {
    this.show.set(true);
    this.isNew.set(true);
  }

  search(): TodoList[] {
    if (this.todolist().length === 0) {
      return this.todolist().slice(this.currentPage(), this.currentPage() + 5);
    }

    const filtered = this.todolist().filter((e) =>
      e.name.toLowerCase().includes(this.value().toLowerCase())
    );
    return filtered.slice(this.currentPage(), this.currentPage() + 5);
  }

  prevPage() {
    if (this.currentPage() > 0) {
      this.currentPage.set(this.currentPage() - 5);
    }
  }

  nextPage(): void {
    if (
      this.todolist().filter((e) =>
        e.name.toLowerCase().includes(this.value().toLowerCase())
      ).length >
      this.currentPage() + 5
    ) {
      this.currentPage.set(this.currentPage() + 5);
    }
  }

  clear(): void {
    this.show.set(false);
    this.isNew.set(false);
    this.form.reset();
  }

  deleteTask(id: number): void {
    const index = this.todolist().findIndex((e) => e.id === id);
    this.todolist().splice(index, 1);
  }

  completedTask(id: number): void {
    this.todolist().map((ele) => {
      if (ele.id === id) {
        ele.state = 'completed';
      }
    });
    this.sort();
  }

  updateClick(item: TodoList): void {
    this.show.set(true);
    this.isNew.set(false);
    this.form.get('name')?.setValue(item.name);
    this.form.get('id')?.setValue(item.id);
  }

  save(): void {
    if (this.form.invalid) {
      return Object.values(this.form.controls).forEach((controls) => {
        controls.markAllAsTouched();
      });
    }

    if (this.isNew()) {
      const maxId = this.todolist().reduce(
        (max, item) => (item.id > max ? item.id : max),
        0
      );

      this.todolist().push({
        id: maxId + 1,
        date: new Date(),
        name: this.form.get('name')?.value,
        state: 'inprocess',
      });

      this.sort();

      this.clear();
    } else {
      this.todolist().map((ele) => {
        if (ele.id === Number(this.form.get('id')?.value)) {
          ele.name = this.form.get('name')?.value;
        }
      });
      this.sort();
      this.clear();
    }
  }

  sort(): void {
    this.todolist().sort((a, b) => {
      if (a.state === 'inprocess' && b.state !== 'inprocess') {
        return -1;
      }
      if (a.state !== 'inprocess' && b.state === 'inprocess') {
        return 1;
      }
      return 0;
    });
  }
}
