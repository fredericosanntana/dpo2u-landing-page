"use client"

import * as React from "react"
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Users,
  Phone,
  Coffee,
  Briefcase,
  Clock,
  Calendar as CalendarIcon,
  MapPin,
} from "lucide-react"
import { DayButton, DayPicker, getDefaultClassNames } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"]
}) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "bg-background group/calendar p-3 [--cell-size:2rem] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString("default", { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn(
          "relative flex flex-col gap-4 md:flex-row",
          defaultClassNames.months
        ),
        month: cn("flex w-full flex-col gap-4", defaultClassNames.month),
        nav: cn(
          "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-[--cell-size] w-[--cell-size] select-none p-0 aria-disabled:opacity-50",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-[--cell-size] w-[--cell-size] select-none p-0 aria-disabled:opacity-50",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex h-[--cell-size] w-full items-center justify-center px-[--cell-size]",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "flex h-[--cell-size] w-full items-center justify-center gap-1.5 text-sm font-medium",
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          "has-focus:border-ring border-input shadow-xs has-focus:ring-ring/50 has-focus:ring-[3px] relative rounded-md border",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn(
          "bg-popover absolute inset-0 opacity-0",
          defaultClassNames.dropdown
        ),
        caption_label: cn(
          "select-none font-medium",
          captionLayout === "label"
            ? "text-sm"
            : "[&>svg]:text-muted-foreground flex h-8 items-center gap-1 rounded-md pl-2 pr-1 text-sm [&>svg]:size-3.5",
          defaultClassNames.caption_label
        ),
        table: "w-full border-collapse",
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "text-muted-foreground flex-1 select-none rounded-md text-[0.8rem] font-normal",
          defaultClassNames.weekday
        ),
        week: cn("mt-2 flex w-full", defaultClassNames.week),
        week_number_header: cn(
          "w-[--cell-size] select-none",
          defaultClassNames.week_number_header
        ),
        week_number: cn(
          "text-muted-foreground select-none text-[0.8rem]",
          defaultClassNames.week_number
        ),
        day: cn(
          "group/day relative aspect-square h-full w-full select-none p-0 text-center [&:first-child[data-selected=true]_button]:rounded-l-md [&:last-child[data-selected=true]_button]:rounded-r-md",
          defaultClassNames.day
        ),
        range_start: cn(
          "bg-accent rounded-l-md",
          defaultClassNames.range_start
        ),
        range_middle: cn("rounded-none", defaultClassNames.range_middle),
        range_end: cn("bg-accent rounded-r-md", defaultClassNames.range_end),
        today: cn(
          "bg-accent text-accent-foreground rounded-md data-[selected=true]:rounded-none",
          defaultClassNames.today
        ),
        outside: cn(
          "text-muted-foreground aria-selected:text-muted-foreground",
          defaultClassNames.outside
        ),
        disabled: cn(
          "text-muted-foreground opacity-50",
          defaultClassNames.disabled
        ),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return (
            <div
              data-slot="calendar"
              ref={rootRef}
              className={cn(className)}
              {...props}
            />
          )
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return (
              <ChevronLeftIcon className={cn("size-4", className)} {...props} />
            )
          }

          if (orientation === "right") {
            return (
              <ChevronRightIcon
                className={cn("size-4", className)}
                {...props}
              />
            )
          }

          return (
            <ChevronDownIcon className={cn("size-4", className)} {...props} />
          )
        },
        DayButton: CalendarDayButton,
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="flex size-[--cell-size] items-center justify-center text-center">
                {children}
              </div>
            </td>
          )
        },
        ...components,
      }}
      {...props}
    />
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames()

  const ref = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground data-[range-middle=true]:bg-accent data-[range-middle=true]:text-accent-foreground data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-ring/50 flex aspect-square h-auto w-full min-w-[--cell-size] flex-col gap-1 font-normal leading-none data-[range-end=true]:rounded-md data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-md group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[3px] [&>span]:text-xs [&>span]:opacity-70",
        defaultClassNames.day,
        className
      )}
      {...props}
    />
  )
}

// Event interface
interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  time?: string;
  type?: 'meeting' | 'call' | 'consultation' | 'training' | 'deadline';
  attendees?: number;
  location?: string;
  description?: string;
  color?: string;
}

// Event Calendar Component
interface EventCalendarProps {
  events?: CalendarEvent[];
  onDateSelect?: (date: Date | undefined) => void;
  onEventClick?: (event: CalendarEvent) => void;
  variant?: 'default' | 'premium' | 'minimal' | 'compact';
  className?: string;
}

const getEventIcon = (type: CalendarEvent['type']) => {
  switch (type) {
    case 'meeting':
      return Users;
    case 'call':
      return Phone;
    case 'consultation':
      return Coffee;
    case 'training':
      return Briefcase;
    case 'deadline':
      return Clock;
    default:
      return CalendarIcon;
  }
};

const getEventColor = (type: CalendarEvent['type']) => {
  switch (type) {
    case 'meeting':
      return 'bg-brand-sapphire-500';
    case 'call':
      return 'bg-brand-emerald-500';
    case 'consultation':
      return 'bg-purple-500';
    case 'training':
      return 'bg-brand-sapphire-500';
    case 'deadline':
      return 'bg-red-500';
    default:
      return 'bg-brand-gray-500';
  }
};

export const EventCalendar: React.FC<EventCalendarProps> = ({
  events = [],
  onDateSelect,
  onEventClick,
  variant = 'premium',
  className
}) => {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>();

  // Group events by date
  const eventsByDate = React.useMemo(() => {
    const grouped: { [key: string]: CalendarEvent[] } = {};
    events.forEach(event => {
      const dateKey = event.date.toDateString();
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(event);
    });
    return grouped;
  }, [events]);

  const getEventsForDate = (date: Date) => {
    return eventsByDate[date.toDateString()] || [];
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    onDateSelect?.(date);
  };

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  return (
    <div className={cn('space-y-6', className)}>
      <Calendar
        selected={selectedDate}
        onSelect={handleDateSelect}
        className="w-full bg-gradient-to-br from-white to-brand-platinum-50 border border-brand-sapphire-200/30 rounded-3xl shadow-2xl"
      />

      {/* Selected Date Events */}
      {selectedDate && selectedDateEvents.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-brand-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-brand-gray-800 mb-4">
            Events for {selectedDate.toLocaleDateString()}
          </h3>
          <div className="space-y-3">
            {selectedDateEvents.map((event) => {
              const IconComponent = getEventIcon(event.type);
              return (
                <div
                  key={event.id}
                  className="flex items-start space-x-3 p-3 rounded-xl bg-gradient-to-r from-brand-gray-50 to-transparent hover:from-brand-sapphire-50 hover:to-brand-emerald-50/30 cursor-pointer transition-all duration-200"
                  onClick={() => onEventClick?.(event)}
                >
                  <div className={cn(
                    'flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-white',
                    event.color || getEventColor(event.type)
                  )}>
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-brand-gray-800 truncate">
                        {event.title}
                      </h4>
                      {event.time && (
                        <Badge variant="outline" size="sm">
                          {event.time}
                        </Badge>
                      )}
                    </div>
                    {event.description && (
                      <p className="text-sm text-brand-gray-600 mt-1">
                        {event.description}
                      </p>
                    )}
                    <div className="flex items-center space-x-4 mt-2 text-xs text-brand-gray-500">
                      {event.attendees && (
                        <div className="flex items-center space-x-1">
                          <Users className="h-3 w-3" />
                          <span>{event.attendees} attendees</span>
                        </div>
                      )}
                      {event.location && (
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3" />
                          <span>{event.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// Consultation Booking Calendar
interface ConsultationCalendarProps {
  availableSlots?: { date: Date; times: string[] }[];
  onSlotSelect?: (date: Date, time: string) => void;
  className?: string;
}

export const ConsultationCalendar: React.FC<ConsultationCalendarProps> = ({
  availableSlots = [],
  onSlotSelect,
  className
}) => {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = React.useState<string | undefined>();

  const availabilityByDate = React.useMemo(() => {
    const grouped: { [key: string]: string[] } = {};
    availableSlots.forEach(slot => {
      const dateKey = slot.date.toDateString();
      grouped[dateKey] = slot.times;
    });
    return grouped;
  }, [availableSlots]);

  const getAvailableTimes = (date: Date) => {
    return availabilityByDate[date.toDateString()] || [];
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime(undefined);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    if (selectedDate) {
      onSlotSelect?.(selectedDate, time);
    }
  };

  const selectedDateTimes = selectedDate ? getAvailableTimes(selectedDate) : [];

  return (
    <div className={cn('space-y-6', className)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold text-brand-gray-800 mb-4">
            Select Date
          </h3>
          <Calendar
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={(date) => {
              return date < new Date() || getAvailableTimes(date).length === 0;
            }}
            className="bg-gradient-to-br from-white to-brand-platinum-50 border border-brand-sapphire-200/30 rounded-3xl shadow-2xl"
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-brand-gray-800 mb-4">
            Available Times
          </h3>
          {selectedDate ? (
            selectedDateTimes.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {selectedDateTimes.map((time) => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? 'brand' : 'outline'}
                    size="sm"
                    onClick={() => handleTimeSelect(time)}
                    className="justify-start"
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    {time}
                  </Button>
                ))}
              </div>
            ) : (
              <p className="text-brand-gray-600 text-center py-8">
                No available times for this date
              </p>
            )
          ) : (
            <p className="text-brand-gray-600 text-center py-8">
              Please select a date to see available times
            </p>
          )}
        </div>
      </div>

      {selectedDate && selectedTime && (
        <div className="bg-gradient-to-br from-brand-sapphire-50 to-brand-emerald-50 rounded-2xl p-6 border border-brand-sapphire-200/30">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-brand-sapphire-500 to-brand-emerald-500 rounded-xl flex items-center justify-center">
              <CalendarIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-brand-gray-800">
                Consultation Scheduled
              </h4>
              <p className="text-brand-gray-600">
                {selectedDate.toLocaleDateString()} at {selectedTime}
              </p>
            </div>
          </div>
          <div className="bg-white/60 rounded-xl p-4">
            <h5 className="font-medium text-brand-gray-800 mb-2">
              What to expect:
            </h5>
            <ul className="text-sm text-brand-gray-600 space-y-1">
              <li>• Complete LGPD compliance assessment</li>
              <li>• Personalized automation roadmap</li>
              <li>• Live platform demonstration</li>
              <li>• Q&A with LGPD specialists</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export { Calendar, CalendarDayButton, type CalendarEvent };
