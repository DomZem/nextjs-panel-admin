"use client";

import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { ScrollArea, ScrollBar } from "./scroll-area";
import { CalendarIcon } from "lucide-react";
import { FormControl } from "./form";
import { Calendar } from "./calendar";
import { Button } from "./button";
import { cn } from "~/lib/utils";
import dayjs from "dayjs";
import { useState } from "react";

export const DateTimePicker = ({
  value,
  onChange,
}: {
  value?: Date;
  onChange: (date: Date) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleDateSelect = (date?: Date) => {
    if (date) {
      onChange(date);
    }
  };

  const handleTimeChange = (type: "hour" | "minute", timeValue: string) => {
    if (!value) return;

    const newDate = new Date(value);

    if (type === "hour") {
      newDate.setHours(parseInt(timeValue, 10));
    } else if (type === "minute") {
      newDate.setMinutes(parseInt(timeValue, 10));
      setIsOpen(false);
    }

    onChange(newDate);
  };

  return (
    <Popover modal open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            className={cn(
              "w-full pl-3 text-left font-normal",
              !value && "text-muted-foreground",
            )}
            onClick={() => setIsOpen(true)}
          >
            {value ? (
              dayjs(value).format("DD/MMM/YYYY HH:mm")
            ) : (
              <span>DD/MMM/YYYY HH:mm</span>
            )}

            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="sm:flex">
          <Calendar
            mode="single"
            selected={value}
            onSelect={handleDateSelect}
            initialFocus
          />
          <div className="flex flex-col divide-y sm:h-[300px] sm:flex-row sm:divide-x sm:divide-y-0">
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex p-2 sm:flex-col">
                {Array.from({ length: 24 }, (_, i) => i)
                  .reverse()
                  .map((hour) => (
                    <Button
                      data-testid={`calendar-hour-${hour}`}
                      key={hour}
                      size="icon"
                      variant={
                        value && value.getHours() === hour ? "default" : "ghost"
                      }
                      className="aspect-square shrink-0 sm:w-full"
                      onClick={() => handleTimeChange("hour", hour.toString())}
                    >
                      {hour}
                    </Button>
                  ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex p-2 sm:flex-col">
                {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
                  <Button
                    data-testid={`calendar-minute-${minute}`}
                    key={minute}
                    size="icon"
                    variant={
                      value && value.getMinutes() === minute
                        ? "default"
                        : "ghost"
                    }
                    className="aspect-square shrink-0 sm:w-full"
                    onClick={() =>
                      handleTimeChange("minute", minute.toString())
                    }
                  >
                    {minute.toString().padStart(2, "0")}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
