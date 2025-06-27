'use client'

import * as React from 'react'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { cn } from '@/lib/utils'
import { ControllerRenderProps } from 'react-hook-form'
interface CustomSelectDateProps {
  label?: string
  field: ControllerRenderProps<any, any>
  disabledPast?: boolean
  disabledFuture?: boolean
  formDescription?:string
}

export function CustomSelectDate({
  field,
  label = 'Select Date',
  disabledPast = false,
  disabledFuture = false,
  formDescription,
}: CustomSelectDateProps) {
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date | undefined>()
  const [month, setMonth] = React.useState<Date | undefined>(date)
React.useEffect(()=>{
  if(field.value){
    setDate(field.value)
  }
},[field.value])

  const isDisabled = (date: Date) => {
    const today = new Date()
    if (disabledPast && date < new Date('1900-01-01')) return true
    if (disabledFuture && date > today) return true
    return false
  }

  return (
    <FormItem className="flex flex-col">
   {label && <FormLabel>{label}</FormLabel>}
    <Popover open={open} onOpenChange={(_open:boolean)=>{setOpen(_open)}}>
        <PopoverTrigger asChild>
        <FormControl>
            <Button
            variant={"outline"}
            className={cn("pl-3 text-left font-normal", !date && "text-muted-foreground")}
            >
              { date ? (format(date, "PPP")) : (<span>Pick a date</span>)}
            {/* {field?.value ? (format(field.value, "PPP")) : date ? (format(date, "PPP")) : (<span>Pick a date</span>)} */}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
         </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="end">
        <Calendar
            mode="single"
            selected={date} 
            captionLayout="dropdown"
            month={month}
            onMonthChange={setMonth}
            onSelect={(date)=>{
              field.onChange(date);
              setDate(date);
              setOpen(false);
            }}
            disabled={isDisabled}
        />
        </PopoverContent>
    </Popover>
    {formDescription && <FormDescription>{formDescription}</FormDescription>}
    <FormMessage />
    </FormItem>
  )
}
