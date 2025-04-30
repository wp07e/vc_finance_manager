'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getExpenses } from '@/services/expenses'
import { getBudgets } from '@/services/budgets'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { format } from 'date-fns'
import { DownloadIcon } from 'lucide-react'

interface ExportConfig {
  type: 'csv' | 'json'
  data: 'expenses' | 'budgets' | 'all'
}

export function DataExport() {
  const [config, setConfig] = useState<ExportConfig>({
    type: 'csv',
    data: 'all',
  })

  const { data: expenses } = useQuery({
    queryKey: ['expenses'],
    queryFn: getExpenses,
  })

  const { data: budgets } = useQuery({
    queryKey: ['budgets'],
    queryFn: getBudgets,
  })

  function handleExport() {
    let exportData: any
    let filename: string

    if (config.data === 'expenses') {
      exportData = expenses
      filename = `expenses-${format(new Date(), 'yyyy-MM-dd')}`
    } else if (config.data === 'budgets') {
      exportData = budgets
      filename = `budgets-${format(new Date(), 'yyyy-MM-dd')}`
    } else {
      exportData = { expenses, budgets }
      filename = `financial-data-${format(new Date(), 'yyyy-MM-dd')}`
    }

    if (config.type === 'csv') {
      const csv = convertToCSV(exportData)
      downloadFile(`${filename}.csv`, csv, 'text/csv')
    } else {
      downloadFile(
        `${filename}.json`,
        JSON.stringify(exportData, null, 2),
        'application/json'
      )
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <DownloadIcon className="mr-2 h-4 w-4" />
          Export Data
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export Financial Data</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Export Format</label>
            <Select
              value={config.type}
              onValueChange={(value: 'csv' | 'json') =>
                setConfig({ ...config, type: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="json">JSON</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Data to Export</label>
            <Select
              value={config.data}
              onValueChange={(value: 'expenses' | 'budgets' | 'all') =>
                setConfig({ ...config, data: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="expenses">Expenses Only</SelectItem>
                <SelectItem value="budgets">Budgets Only</SelectItem>
                <SelectItem value="all">All Data</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleExport} className="w-full">
            Download
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Helper functions
function convertToCSV(data: any): string {
  if (!data || !data.length) return ''

  const headers = Object.keys(data[0])
  const rows = [
    headers.join(','),
    ...data.map((row: any) =>
      headers
        .map((header) => {
          const value = row[header]
          if (value instanceof Date) return format(value, 'yyyy-MM-dd')
          return typeof value === 'string' ? `"${value}"` : String(value)
        })
        .join(',')
    ),
  ]

  return rows.join('\n')
}

function downloadFile(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}