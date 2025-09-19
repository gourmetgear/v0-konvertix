export interface TaskData {
  title: string
  description?: string
  status?: 'pending' | 'in_progress' | 'completed' | 'blocked'
  priority?: 'low' | 'medium' | 'high' | 'urgent'
  assigned_to?: string
  due_date?: string
  project_id?: string
  tags?: string[]
  metadata?: Record<string, any>
}

export interface TaskResponse {
  success: boolean
  message: string
  data?: any
  error?: string
}

export class TaskService {
  private static baseUrl = typeof window !== 'undefined' ? window.location.origin : ''

  /**
   * Create a new task via webhook to Supabase
   */
  static async createTask(taskData: TaskData): Promise<TaskResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/create-task`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create task')
      }

      return result
    } catch (error) {
      console.error('TaskService.createTask error:', error)
      return {
        success: false,
        message: 'Failed to create task',
        error: error instanceof Error ? error.message : String(error)
      }
    }
  }

  /**
   * Create multiple tasks at once
   */
  static async createTasks(tasks: TaskData[]): Promise<TaskResponse[]> {
    const results = await Promise.all(
      tasks.map(task => this.createTask(task))
    )
    return results
  }

  /**
   * Helper method to create a task from SuperClaude TodoWrite format
   */
  static async createFromTodo(todo: {
    content: string
    status: string
    activeForm?: string
  }, options?: {
    priority?: TaskData['priority']
    project_id?: string
    tags?: string[]
  }): Promise<TaskResponse> {
    return this.createTask({
      title: todo.content,
      description: todo.activeForm ? `Currently: ${todo.activeForm}` : undefined,
      status: todo.status as TaskData['status'],
      priority: options?.priority || 'medium',
      project_id: options?.project_id,
      tags: options?.tags || [],
      metadata: {
        source: 'SuperClaude',
        activeForm: todo.activeForm
      }
    })
  }
}

// Convenience functions for common use cases
export const createTask = TaskService.createTask.bind(TaskService)
export const createTasks = TaskService.createTasks.bind(TaskService)
export const createFromTodo = TaskService.createFromTodo.bind(TaskService)