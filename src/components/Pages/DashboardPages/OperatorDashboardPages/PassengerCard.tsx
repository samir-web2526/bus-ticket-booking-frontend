'use client'

import { useState } from 'react'
import { User, deleteUser } from '@/src/services/user.service'
import { TableCell, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { UserCircle2, Trash2, Loader2, AlertTriangle } from 'lucide-react'

function StatusBadge({ status }: { status?: string }) {
  const map: Record<string, string> = {
    ACTIVE:    'bg-emerald-50 text-emerald-700 border-emerald-200',
    INACTIVE:  'bg-gray-100 text-gray-500 border-gray-200',
    SUSPENDED: 'bg-red-50 text-red-600 border-red-200',
  }
  const s = status ?? 'ACTIVE'
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
        map[s] ?? 'bg-gray-100 text-gray-500 border-gray-200'
      }`}
    >
      {s}
    </span>
  )
}

function DeleteConfirmModal({
  passenger,
  open,
  onClose,
  onDeleted,
}: {
  passenger: User
  open: boolean
  onClose: () => void
  onDeleted: (id: string) => void
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleDelete = async () => {
    try {
      setLoading(true)
      setError('')
      const res = await deleteUser(passenger.id)
      if (res.error) { setError(res.error); return }
      onDeleted(passenger.id)
      onClose()
    } catch {
      setError('Failed to delete. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-white border border-gray-200 text-gray-900 max-w-sm rounded-2xl p-0 overflow-hidden shadow-xl">
        <DialogHeader className="px-6 pt-6 pb-2">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-14 h-14 rounded-full bg-red-50 border border-red-200 flex items-center justify-center">
              <AlertTriangle className="w-7 h-7 text-red-500" />
            </div>
            <div>
              <DialogTitle className="text-gray-900 font-bold text-lg">
                Delete Passenger?
              </DialogTitle>
              <p className="text-gray-400 text-sm mt-2 leading-relaxed">
                This will permanently delete{' '}
                <span className="text-gray-900 font-semibold">{passenger.name}</span>.
                This action cannot be undone.
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 pb-6 pt-4 space-y-3">
          {error && (
            <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-center">
              {error}
            </p>
          )}
          <Button
            onClick={handleDelete}
            disabled={loading}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl h-11"
          >
            {loading
              ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Deleting…</>
              : 'Yes, Delete'}
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="w-full border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300 hover:text-gray-900 rounded-xl h-11"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function PassengerCard({
  passenger,
  onDeleted,
}: {
  passenger: User
  onDeleted?: (id: string) => void
}) {
  const [deleteOpen, setDeleteOpen] = useState(false)

  return (
    <>
      <TableRow className="border-gray-100 hover:bg-gray-50 transition-colors duration-150">
        <TableCell className="py-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
              <UserCircle2 className="w-5 h-5 text-gray-400" />
            </div>
            <div>
              <p className="text-gray-900 font-semibold text-sm leading-tight">{passenger.name}</p>
              <p className="text-gray-400 text-xs mt-0.5">{passenger.email}</p>
            </div>
          </div>
        </TableCell>

        <TableCell className="text-gray-500 text-sm">
          {passenger.phone ?? <span className="text-gray-300 italic">No phone</span>}
        </TableCell>

        <TableCell className="text-gray-500 text-sm">
          {passenger.passengerProfile?.gender ?? <span className="text-gray-300">—</span>}
        </TableCell>

        <TableCell className="text-gray-500 text-sm">
          {passenger.passengerProfile?.dateOfBirth ?? <span className="text-gray-300">—</span>}
        </TableCell>

        <TableCell>
          <span className="text-xs font-medium text-gray-600 bg-gray-100 border border-gray-200 px-2.5 py-1 rounded-lg">
            {passenger.role}
          </span>
        </TableCell>

        <TableCell>
          <StatusBadge status="ACTIVE" />
        </TableCell>

        <TableCell>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setDeleteOpen(true)}
            className="border-gray-200 bg-gray-50 text-gray-400 hover:border-red-300 hover:text-red-500 hover:bg-red-50 h-8 px-3 text-xs gap-1.5 rounded-lg"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </Button>
        </TableCell>
      </TableRow>

      <DeleteConfirmModal
        passenger={passenger}
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onDeleted={(id) => {
          onDeleted?.(id)
          setDeleteOpen(false)
        }}
      />
    </>
  )
}