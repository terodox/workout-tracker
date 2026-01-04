import { createFileRoute } from '@tanstack/react-router'
import { LoginPage } from '../components/LoginPage'
import '../components/LoginPage.css'

export const Route = createFileRoute('/')({ component: LoginPage })
