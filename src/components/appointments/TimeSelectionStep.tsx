import { useGetBookedTimeSlots } from "@/hooks/use-appointments";
import {
  APPOINTMENT_TYPES,
  getAvailableTimeSlots,
  getNext5Days,
} from "@/lib/utils";
import { Button } from "../ui/button";
import { ChevronLeft, ClockIcon } from "lucide-react";
import { Card, CardContent } from "../ui/card";

interface TimeSelectionStepProps {
  selectedDentistId: string;
  selectedDate: string;
  selectedTime: string;
  selectedType: string;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
  onTypeChange: (type: string) => void;
  onBack: () => void;
  onContinue: () => void;
}

function TimeSelectionStep({
  selectedDentistId,
  selectedDate,
  selectedTime,
  selectedType,
  onDateChange,
  onTimeChange,
  onTypeChange,
  onBack,
  onContinue,
}: TimeSelectionStepProps) {
  const { data: bookedTimeSlots = [] } = useGetBookedTimeSlots(
    selectedDentistId,
    selectedDate
  );

  const availableDates = getNext5Days();
  const availableTimeSlots = getAvailableTimeSlots();

  const handleDateSelect = (date: string) => {
    onDateChange(date);
    onTimeChange("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button onClick={onBack} variant={"ghost"}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h2 className="text-2xl font-semibold">Select Date and Time</h2>
      </div>

      <div className="grid lg: grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Appointment Type</h3>
          <div className="space-y-3">
            {APPOINTMENT_TYPES.map((type) => (
              <Card
                key={type.id}
                className={`cursor-pointer transition-all hover:shadow-sm ${
                  selectedType === type.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => onTypeChange(type.id)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{type.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {type.duration}
                      </p>
                    </div>
                    <span className="font-semibold text-primary">
                      {type.price}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Available Dates</h3>
          <div className="grid grid-cols-2 gap-3">
            {availableDates.map((date) => (
              <Button
                key={date}
                variant={selectedDate === date ? "default" : "outline"}
                onClick={() => handleDateSelect(date)}
                className="h-auto p-3"
              >
                <div className="text-center">
                  <div className="font-medium">
                    {new Date(date).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </div>
              </Button>
            ))}
          </div>

          {selectedDate && (
            <div className="space-y-3">
              <h4 className="font-medium">Available Times</h4>
              <div className="grid grid-cols-3 gap-2">
                {availableTimeSlots.map((time) => {
                  const isBooked = bookedTimeSlots.includes(time);
                  return (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"}
                      onClick={() => !isBooked && onTimeChange(time)}
                      size="sm"
                      disabled={isBooked}
                      className={
                        isBooked ? "opacity-50 cursor-not-allowed" : ""
                      }
                    >
                      <ClockIcon className="w-3 h-3 mr-1" />
                      {time}
                      {isBooked && " (Booked)"}
                    </Button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedType && selectedDate && selectedTime && (
        <div className="flex justify-end">
          <Button onClick={onContinue}>Review Booking</Button>
        </div>
      )}
    </div>
  );
}

export default TimeSelectionStep;
