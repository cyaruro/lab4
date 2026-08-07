import { http, HttpResponse } from 'msw';
import { CreateTechnicalSupportInput, Task, TechnicalSupport } from '../types';

const API_URL = 'https://api.taskmanager.com';

// ponytail: la "API falsa" es un array en memoria; resetTasks lo limpia entre tests
let tasks: Task[] = [];
let technicalSupports: TechnicalSupport[] = [];

export const resetTasks = () => {
  tasks = [];
};

export const resetTechnicalSupports = () => {
  technicalSupports = [];
};

export const handlers = [
  http.post(`${API_URL}/tasks`, async ({ request }) => {
    const { title } = (await request.json()) as { title: string };
    const task: Task = { id: String(tasks.length + 1), title, status: 'pending' };
    tasks.push(task);
    return HttpResponse.json(task, { status: 201 });
  }),

  http.get(`${API_URL}/tasks`, () => HttpResponse.json(tasks)),

  http.post(`${API_URL}/technical-supports`, async ({ request }) => {
    const body = (await request.json()) as CreateTechnicalSupportInput;
    const support: TechnicalSupport = {
      id: String(technicalSupports.length + 1),
      ...body,
      status: 'abierta',
      createdAt: new Date().toISOString(),
    };
    technicalSupports.push(support);
    return HttpResponse.json(support, { status: 201 });
  }),

  http.get(`${API_URL}/technical-supports`, () => HttpResponse.json(technicalSupports)),
];

// https://api.taskmanager.com/tasks - POST
/**
{
  {
    id: "234234",
    title: "Tarea 1",
    status: 'pending'
  },
  { status: 201 }
}
*/

// https://api.taskmanager.com/tasks - GET
/**
[
  {
    id: "234234",
    title: "Tarea 1",
    status: 'pending'
  }
]
*/

// https://api.taskmanager.com/technical-supports - POST
/**
{
  id: "1",
  fullName: "Juan Pérez",
  phone: "3000000000",
  area: "Tecnología",
  category: "Error de la aplicación",
  description: "La app se cierra al iniciar",
  priority: "alta",
  maxSolutionDate: "2026-08-20",
  status: "abierta",
  createdAt: "2026-08-06T12:00:00.000Z"
}
*/

// https://api.taskmanager.com/technical-supports - GET
/**
[
  {
    id: "1",
    fullName: "Juan Pérez",
    status: "abierta",
    ...
  }
]
*/