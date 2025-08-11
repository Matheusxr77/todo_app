import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

interface Task {
  id: number;
  description: string;
  priority: 'Baixa' | 'Média' | 'Alta';
  status: 'pendente' | 'concluida';
  userId?: number;
}

@Component({
  selector: 'app-task-list',
  standalone: true,
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
  imports: [CommonModule, FormsModule]
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];

  modalOpen = false;
  modalMode: 'create' | 'edit' = 'create';
  modalTask: Task = { id: 0, description: '', priority: 'Baixa', status: 'pendente' };

  successMessage = '';

  constructor(private http: HttpClient, private router: Router) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Você precisa estar logado para acessar as tarefas.');
      throw new Error('Token não encontrado');
    }
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    const options = this.getAuthHeaders();
    this.http.get<Task[]>('/api/tasks', options).subscribe({
      next: (tasks) => {
        this.tasks = tasks;
      },
      error: () => {
        this.showError('Erro ao carregar tarefas');
      }
    });
  }

  showSuccess(msg: string) {
    this.successMessage = msg;
    setTimeout(() => {
      this.successMessage = '';
    }, 3500);
  }

  showError(msg: string) {
    this.successMessage = msg;
    setTimeout(() => {
      this.successMessage = '';
    }, 3500);
  }

  markAsDone(task: Task) {
    if (task.status === 'concluida') return;
    const options = this.getAuthHeaders();
    this.http.put<Task>(
      `/api/tasks/${task.id}`,
      { description: task.description, priority: task.priority, status: 'concluida' },
      options
    ).subscribe({
      next: () => {
        this.showSuccess('Tarefa marcada como concluída!');
        this.loadTasks();
      },
      error: () => {
        this.showError('Erro ao marcar como concluída');
      }
    });
  }

  openModal(mode: 'create' | 'edit', task?: Task) {
    this.modalMode = mode;
    this.modalOpen = true;
    if (mode === 'edit' && task) {
      this.modalTask = { ...task };
    } else {
      this.modalTask = { id: 0, description: '', priority: 'Baixa', status: 'pendente' };
    }
  }

  closeModal() {
    this.modalOpen = false;
  }

  saveTask() {
    const options = this.getAuthHeaders();
    if (!this.modalTask.description || !this.modalTask.priority) {
      this.showError('Descrição e prioridade são obrigatórias.');
      return;
    }
    if (!['Baixa', 'Média', 'Alta'].includes(this.modalTask.priority)) {
      this.showError('Prioridade inválida.');
      return;
    }
    if (this.modalMode === 'create') {
      this.http.post<Task>(
        '/api/tasks',
        {
          description: this.modalTask.description,
          priority: this.modalTask.priority
        },
        options
      ).subscribe({
        next: (newTask) => {
          this.tasks.push({ ...newTask, status: 'pendente' });
          this.closeModal();
          this.showSuccess('Tarefa criada com sucesso!');
        },
        error: (err) => {
          this.showError(err.error?.error || 'Não foi possível criar a tarefa.');
        }
      });
    } else {
      const status = ['pendente', 'concluida'].includes(this.modalTask.status)
        ? this.modalTask.status
        : 'pendente';
      this.http.put<Task>(
        `/api/tasks/${this.modalTask.id}`,
        {
          description: this.modalTask.description,
          priority: this.modalTask.priority,
          status
        },
        options
      ).subscribe({
        next: (updatedTask) => {
          this.closeModal();
          this.loadTasks();
          this.showSuccess('Tarefa editada com sucesso!');
        },
        error: (err) => {
          this.showError(err.error?.error || 'Não foi possível editar a tarefa.');
        }
      });
    }
  }

  deleteTask(task: Task) {
    const options = this.getAuthHeaders();
    this.http.delete(
      `/api/tasks/${task.id}`,
      options
    ).subscribe({
      next: () => {
        this.tasks = this.tasks.filter(t => t.id !== task.id);
        this.showSuccess('Tarefa excluída com sucesso!');
      },
      error: (err) => {
        this.showError(err.error?.error || 'Erro ao excluir tarefa');
      }
    });
  }
}