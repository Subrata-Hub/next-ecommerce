"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

/* -------------------- helpers -------------------- */

function parseDate(str, now) {
  if (!str || !now) return null;
  const lower = str.toLowerCase().trim();

  if (lower === "today") return now;

  if (lower === "tomorrow") {
    const d = new Date(now);
    d.setDate(d.getDate() + 1);
    return d;
  }

  const inDays = lower.match(/^in (\d+) days?$/);
  if (inDays) {
    const d = new Date(now);
    d.setDate(d.getDate() + Number(inDays[1]));
    return d;
  }

  const d = new Date(str);
  if (isNaN(d.getTime())) return null;

  if (d.getFullYear() < now.getFullYear()) return null;

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

/* -------------------- component -------------------- */

const Daypicker = ({ onSelectDate }) => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [date, setDate] = React.useState(null);
  const [month, setMonth] = React.useState(null);
  const [today, setToday] = React.useState(null);

  // ✅ ALL time-based logic here
  React.useEffect(() => {
    const now = new Date();
    setToday(now);
    setMonth(now);
  }, []);

  const handleInputChange = (e) => {
    const newVal = e.target.value;
    setValue(newVal);

    if (!today) return;

    const parsed = parseDate(newVal, today);

    if (parsed) {
      setDate(parsed);
      setMonth(parsed);
      onSelectDate?.(parsed);
    } else {
      onSelectDate?.(undefined);
    }
  };

  if (!today) return null; // ✅ prevents prerender access

  return (
    <div className="flex flex-col gap-3">
      <div className="relative flex gap-2">
        <Input
          value={value}
          placeholder="Select a date..."
          className="bg-background pr-10"
          onChange={handleInputChange}
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
              variant="ghost"
              className="absolute right-2 top-1/2 size-6 -translate-y-1/2 p-0"
            >
              <CalendarIcon className="size-3.5 text-muted-foreground" />
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={date}
              month={month}
              onMonthChange={setMonth}
              onSelect={(d) => {
                if (!d) return;
                setDate(d);
                setValue(formatDate(d));
                setOpen(false);
                onSelectDate?.(d);
              }}
              disabled={{ before: today }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default Daypicker;
