"use client"

import React, { useState } from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import moment from "moment"
import { useNavigation } from "react-day-picker"

export function DatePicker({ date, setDate, fromYear=1950, toYear=(new Date().getFullYear() + 10) }) {
  const [open, setOpen] = useState(false)

  const handleSelect = (selectedDate) => {
    if (selectedDate) {
      const formatted = moment(selectedDate).format("YYYY-MM-DD")
      setDate(formatted)
      setOpen(false)
    }
  }

  const DropdownCaption = ({ displayMonth }) => {
    const { goToMonth } = useNavigation()

    const years = []
    for (let year = fromYear; year <= toYear; year++) {
      years.push(year)
    }

    const months = Array.from({ length: 12 }, (_, i) =>
      new Date(0, i).toLocaleString("default", { month: "long" })
    )

    const handleChange = (e, type) => {
      const month = type === "month" ? parseInt(e.target.value) : displayMonth.getMonth()
      const year = type === "year" ? parseInt(e.target.value) : displayMonth.getFullYear()
      goToMonth(new Date(year, month))
    }

    return (
      <div className="flex justify-between items-center gap-2 px-3 py-2">
        <select
          onChange={(e) => handleChange(e, "month")}
          value={displayMonth.getMonth()}
          className="border rounded-md p-1 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {months.map((month, idx) => (
            <option key={month} value={idx}>
              {month}
            </option>
          ))}
        </select>

        <select
          onChange={(e) => handleChange(e, "year")}
          value={displayMonth.getFullYear()}
          className="border rounded-md p-1 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(new Date(date), "yyyy-MM-dd") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date ? new Date(date) : undefined}
          onSelect={handleSelect}
          initialFocus
          captionLayout="dropdown"
          fromYear={fromYear}
          toYear={toYear}
          components={{
            Caption: DropdownCaption
          }}
        />
      </PopoverContent>
    </Popover>
  )
}
