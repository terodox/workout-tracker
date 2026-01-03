import { useCallback, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation } from '@tanstack/react-query'
import './tanstack-query.css'

export const Route = createFileRoute('/demo/tanstack-query')({
  component: TanStackQueryDemo,
})

type Todo = {
  id: number
  name: string
}

/**
 * Demo page showcasing TanStack Query with a todo list.
 */
function TanStackQueryDemo() {
  const { data, refetch } = useQuery<Todo[]>({
    queryKey: ['todos'],
    queryFn: () => fetch('/demo/api/tq-todos').then((res) => res.json()),
    initialData: [],
  })

  const { mutate: addTodo } = useMutation({
    mutationFn: (todo: string) =>
      fetch('/demo/api/tq-todos', {
        method: 'POST',
        body: JSON.stringify(todo),
      }).then((res) => res.json()),
    onSuccess: () => refetch(),
  })

  const [todo, setTodo] = useState('')

  const submitTodo = useCallback(async () => {
    await addTodo(todo)
    setTodo('')
  }, [addTodo, todo])

  return (
    <div className="tq-demo">
      <div className="tq-demo__card">
        <h1 className="tq-demo__title">TanStack Query Todos list</h1>
        <ul className="tq-demo__list">
          {data?.map((t) => (
            <li key={t.id} className="tq-demo__item">
              <span className="tq-demo__item-text">{t.name}</span>
            </li>
          ))}
        </ul>
        <div className="tq-demo__form">
          <input
            type="text"
            value={todo}
            onChange={(e) => setTodo(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                submitTodo()
              }
            }}
            placeholder="Enter a new todo..."
            className="tq-demo__input"
          />
          <button
            disabled={todo.trim().length === 0}
            onClick={submitTodo}
            className="tq-demo__btn"
          >
            Add todo
          </button>
        </div>
      </div>
    </div>
  )
}
