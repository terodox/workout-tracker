import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import './start.api-request.css'

function getNames() {
  return fetch('/demo/api/names').then((res) => res.json() as Promise<string[]>)
}

export const Route = createFileRoute('/demo/start/api-request')({
  component: Home,
})

/**
 * Demo page showing API request with names list.
 */
function Home() {
  const { data: names = [] } = useQuery({
    queryKey: ['names'],
    queryFn: getNames,
  })

  return (
    <div className="api-request">
      <div className="api-request__card">
        <h1 className="api-request__title">Start API Request Demo - Names List</h1>
        <ul className="api-request__list">
          {names.map((name) => (
            <li key={name} className="api-request__item">
              <span className="api-request__name">{name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
