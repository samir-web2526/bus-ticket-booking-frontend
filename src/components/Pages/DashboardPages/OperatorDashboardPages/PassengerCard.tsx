'use client'

import { useState } from 'react'
import { User as UserType, deleteUser } from '@/src/services/user.service'
import { TableCell, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { UserCircle2, Trash2, Loader2, AlertTriangle, Activity, Zap, ShieldCheck, Mail, Phone, Calendar, User, Hash } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

function StatusBadge({ status }: { status?: string }) {
  const map: Record<string, { cls: string; dot: string }> = {
    ACTIVE:    { cls: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20', dot: 'bg-emerald-500' },
    INACTIVE:  { cls: 'bg-slate-500/10 text-slate-500 border-slate-500/20', dot: 'bg-slate-500' },
    SUSPENDED: { cls: 'bg-destructive/10 text-destructive border-destructive/20', dot: 'bg-destructive' },
  }
  const s = status ?? 'ACTIVE'
  const cfg = map[s] ?? map.ACTIVE
  return (
    <span
      className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium border ${cfg.cls}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${cfg.dot}`} />
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
  passenger: UserType
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
      setError('Failed to delete user. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card border border-border text-foreground max-w-lg rounded-[48px] p-0 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-destructive/[0.05] rounded-full blur-3xl -mr-16 -mt-16" />
        
        <DialogHeader className="px-12 pt-12 pb-6">
          <div className="flex flex-col items-center text-center gap-8 relative z-10">
            <div className="w-20 h-20 rounded-[24px] bg-destructive/10 border border-destructive/20 flex items-center justify-center shadow-2xl shadow-destructive/10">
              <AlertTriangle className="w-10 h-10 text-destructive animate-pulse" />
            </div>
            <div>
              <p className="text-destructive text-sm font-medium mb-3">Delete User</p>
              <DialogTitle className="text-foreground font-bold text-2xl tracking-tight leading-none mb-4">
                Delete <span className="text-destructive">{passenger.name}</span>?
              </DialogTitle>
              <p className="text-muted-foreground text-base font-normal leading-relaxed">
                This action cannot be undone. The user will be permanently removed from the system.
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="px-12 pb-12 pt-6 space-y-4 relative z-10">
          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-2xl flex items-center gap-3 text-destructive text-sm font-medium mb-4">
              <Activity className="w-4 h-4" />
              {error}
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="h-14 border-border bg-muted/30 text-muted-foreground hover:bg-muted hover:text-foreground rounded-2xl text-base font-medium transition-all duration-500"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={loading}
              className="h-14 bg-destructive hover:bg-destructive/90 text-white font-semibold rounded-2xl text-base shadow-xl shadow-destructive/20 transition-all duration-500 group"
            >
              {loading
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : 'Delete User'}
            </Button>
          </div>
          
          <div className="flex items-center justify-center gap-3 opacity-20 select-none pt-4">
             <div className="h-[1px] w-8 bg-border" />
             <p className="text-xs font-medium text-muted-foreground">ID: {passenger.id.slice(0, 8)}</p>
             <div className="h-[1px] w-8 bg-border" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function PassengerCard({
  passenger,
  onDeleted,
}: {
  passenger: UserType
  onDeleted?: (id: string) => void
}) {
  const [deleteOpen, setDeleteOpen] = useState(false)

  return (
    <>
      <TableRow className="border-border/40 hover:bg-muted/30 transition-all duration-500 group/row relative overflow-hidden">
        <TableCell className="py-8 pl-10 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-500 shrink-0 shadow-lg group-hover/row:scale-110 transition-transform font-bold text-xl">
              {passenger.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-foreground font-semibold text-base leading-none mb-1.5 group-hover/row:text-amber-500 transition-colors">{passenger.name}</p>
              <div className="flex items-center gap-2">
                 <Mail className="w-3 h-3 text-muted-foreground opacity-40" />
                 <p className="text-muted-foreground text-sm font-medium opacity-60">{passenger.email}</p>
              </div>
            </div>
          </div>
        </TableCell>

        <TableCell className="py-8 relative z-10">
           <div className="flex items-center gap-3">
              <div className="p-2 bg-muted rounded-xl">
                 <Phone className="w-3 h-3 text-amber-500 opacity-60" />
              </div>
              <p className="text-foreground text-sm font-medium">
                {passenger.phone ?? <span className="opacity-40">No phone</span>}
              </p>
           </div>
        </TableCell>

        <TableCell className="py-8 relative z-10">
           <div className="flex items-center gap-3">
              <div className="p-2 bg-muted rounded-xl">
                 <User className="w-3 h-3 text-blue-500 opacity-60" />
              </div>
              <p className="text-foreground text-sm font-medium">
                {passenger.passengerProfile?.gender ?? <span className="opacity-40">Not set</span>}
              </p>
           </div>
        </TableCell>

        <TableCell className="py-8 relative z-10">
           <div className="flex items-center gap-3">
              <div className="p-2 bg-muted rounded-xl">
                 <Calendar className="w-3 h-3 text-emerald-500 opacity-60" />
              </div>
              <p className="text-foreground text-sm font-medium">
                {passenger.passengerProfile?.dateOfBirth ?? <span className="opacity-40">Not set</span>}
              </p>
           </div>
        </TableCell>

        <TableCell className="py-8 relative z-10">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-500 shadow-lg">
                 <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="text-sm font-semibold text-amber-600">
                {passenger.role}
              </span>
           </div>
        </TableCell>

        <TableCell className="py-8 relative z-10">
          <StatusBadge status="ACTIVE" />
        </TableCell>

        <TableCell className="py-8 pr-10 text-right relative z-10">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setDeleteOpen(true)}
            className="h-12 w-12 rounded-2xl bg-muted border border-border text-muted-foreground hover:bg-destructive hover:text-white hover:border-destructive transition-all duration-500 group/btn shadow-xl hover:-translate-y-1"
          >
            <Trash2 className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
          </Button>
        </TableCell>
        
        <div className="absolute top-0 left-0 w-1 h-0 bg-amber-500 group-hover/row:h-full transition-all duration-500" />
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