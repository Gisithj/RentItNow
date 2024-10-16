"use client"

import { Button } from '@/app/components/ui/button'
import { Calendar } from '@/app/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/app/components/ui/popover'
import { cn } from '@/utils/utils'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import React from 'react'

interface DateTimePickerProps {
  onDateChange: (date: Date) => void;
}
function DateTimePicker({ onDateChange }: DateTimePickerProps) {
    const [date, setDate] = React.useState<Date>()
    
    const handleDateChange = (date?: Date) => {
      if (date) {
        setDate(date);
        onDateChange(date);
      }
    };
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"default"}
            className={cn(
              "w-[280px] justify-start text-left font-normal text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateChange}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    )
}

export default DateTimePicker