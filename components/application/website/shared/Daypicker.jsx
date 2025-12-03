"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
// import { parseDate } from "chrono-node";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Simple custom parser
// function parseDate(str) {
//   if (!str) return null;
//   const lower = str.toLowerCase().trim();
//   const now = new Date();

//   if (lower === "today") return now;
//   if (lower === "tomorrow") {
//     const d = new Date(now);
//     d.setDate(d.getDate() + 1);
//     return d;
//   }

//   // Regex for "in X days"
//   const inDays = lower.match(/^in (\d+) days?$/);
//   if (inDays) {
//     const days = parseInt(inDays[1], 10);
//     const d = new Date(now);
//     d.setDate(d.getDate() + days);
//     return d;
//   }

//   // Fallback to standard Date parsing
//   const d = new Date(str);
//   return isNaN(d.getTime()) ? null : d;
// }

// Inside Daypicker.js

function parseDate(str) {
  if (!str) return null;
  const lower = str.toLowerCase().trim();
  const now = new Date();

  // 1. Handle Keywords
  if (lower === "today") return now;
  if (lower === "tomorrow") {
    const d = new Date(now);
    d.setDate(d.getDate() + 1);
    return d;
  }

  // 2. Handle "in X days"
  const inDays = lower.match(/^in (\d+) days?$/);
  if (inDays) {
    const days = parseInt(inDays[1], 10);
    const d = new Date(now);
    d.setDate(d.getDate() + days);
    return d;
  }

  // 3. STRICTER parsing for manual input
  const d = new Date(str);

  // If Invalid Date
  if (isNaN(d.getTime())) return null;

  // KEY FIX: If the input results in a year before 2024 (or current year),
  // assume it's garbage input like "2" becoming "2001".
  if (d.getFullYear() < new Date().getFullYear()) {
    return null;
  }

  return d;
}

function formatDate(date) {
  if (!date) return "";
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

// Destructure the onSelectDate prop here
const Daypicker = ({ onSelectDate }) => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(""); // Default empty or set a specific string
  const [date, setDate] = React.useState(() => parseDate(value));
  const [month, setMonth] = React.useState(date || new Date());

  // Handle manual input changes
  const handleInputChange = (e) => {
    const newVal = e.target.value;
    setValue(newVal);
    const parsedDate = parseDate(newVal);

    if (parsedDate) {
      setDate(parsedDate);
      setMonth(parsedDate);
      // setValue(formatDate(parsedDate));
      // Send to parent if parsed successfully
      if (onSelectDate) onSelectDate(parsedDate);
    } else {
      // If parsing fails (garbage input), you might want to
      // pass null or undefined to the parent so validation fails
      // specifically on "required" or "invalid type".
      if (onSelectDate) onSelectDate(undefined);
      // onSelectDate(undefined);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="relative flex gap-2">
        <Input
          id="date"
          value={value}
          placeholder="Select a date..."
          className="bg-background pr-10"
          onChange={handleInputChange} // Use the handler defined above
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
            }
          }}
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id="date-picker"
              variant="ghost"
              className="absolute top-1/2 right-2 size-6 -translate-y-1/2 p-0 hover:bg-transparent"
            >
              <CalendarIcon className="size-3.5 text-muted-foreground" />
              <span className="sr-only">Select date</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="end">
            <Calendar
              mode="single"
              selected={date}
              month={month}
              onMonthChange={setMonth}
              onSelect={(selectedDate) => {
                if (!selectedDate) return;

                // 1. Update Local State
                setDate(selectedDate);
                setValue(formatDate(selectedDate));
                setOpen(false);

                // 2. IMPORTANT: Send data to Parent Form
                if (onSelectDate) {
                  onSelectDate(selectedDate);
                }
              }}
              disabled={{
                before: Date.now(),
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default Daypicker;
