'use client'
import { useState } from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'

interface Props {
  action: () => Promise<void>
  label?: string
}

export function DeleteButton({ action, label = 'Poista' }: Props) {
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState(false)

  async function handleDelete() {
    setPending(true)
    try {
      await action()
      setOpen(false)
    } finally {
      setPending(false)
    }
  }

  return (
    <>
      <Button variant="outlined" color="error" size="small" onClick={() => setOpen(true)}>
        {label}
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Vahvista poisto</DialogTitle>
        <DialogContent>
          <DialogContentText>Haluatko varmasti poistaa tämän? Toimintoa ei voi perua.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Peruuta</Button>
          <Button onClick={handleDelete} color="error" disabled={pending}>
            {pending ? 'Poistetaan…' : 'Poista'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
