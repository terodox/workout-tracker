import type { Meta, StoryObj } from '@storybook/react-vite'
import { Dialog } from './dialog'
import { Button } from './button'
import './dialog.stories.css'

const meta = {
  title: 'Form/Dialog',
  component: Dialog,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Dialog>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: 'User Profile',
    children: (
      <div className="dialog-story__content">
        <p className="dialog-story__text">
          This is a simple dialog component with a title and content area.
        </p>
      </div>
    ),
  },
}

export const WithFooter: Story = {
  args: {
    title: 'Confirm Action',
    children: (
      <div className="dialog-story__content">
        <p className="dialog-story__text">
          Are you sure you want to proceed with this action?
        </p>
      </div>
    ),
    footer: (
      <div className="dialog-story__footer">
        <Button variant="secondary" size="medium">
          Cancel
        </Button>
        <Button variant="primary" size="medium">
          Confirm
        </Button>
      </div>
    ),
  },
}

export const Form: Story = {
  args: {
    title: 'Create Account',
    children: (
      <div className="dialog-story__form">
        <div className="dialog-story__field">
          <label className="dialog-story__label">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            className="dialog-story__input"
          />
        </div>
        <div className="dialog-story__field">
          <label className="dialog-story__label">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            className="dialog-story__input"
          />
        </div>
      </div>
    ),
    footer: (
      <div className="dialog-story__footer">
        <Button variant="secondary" size="medium">
          Cancel
        </Button>
        <Button variant="primary" size="medium">
          Create Account
        </Button>
      </div>
    ),
  },
}
