"use client";

import { Gender } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useState } from "react";
import { useAddDoctor } from "@/hooks/use-doctors";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { formatPhoneNumber } from "@/lib/utils";

interface AddDoctorDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddDoctorDialog = ({ isOpen, onClose }: AddDoctorDialogProps) => {
  const [newDoctor, setNewDoctor] = useState({
    name: "",
    email: "",
    phone: "",
    specialty: "",
    gender: "MALE" as Gender,
    isActive: true,
  });

  const { mutate, isPending } = useAddDoctor();

  const handlePhoneNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhoneNumber = formatPhoneNumber(e.target.value);
    setNewDoctor({ ...newDoctor, phone: formattedPhoneNumber });
  };

  const handleSubmit = async () => {
    mutate(newDoctor, {
      onSuccess: () => {
        handleClose();
      },
    });
  };

  const handleClose = () => {
    setNewDoctor({
      name: "",
      email: "",
      phone: "",
      specialty: "",
      gender: "MALE" as Gender,
      isActive: true,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Doctor</DialogTitle>
          <DialogDescription>
            Add a new doctor to your practice
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="new-name">Name</Label>
              <Input
                id="new-name"
                type="text"
                value={newDoctor.name}
                placeholder="John Doe"
                onChange={(e) =>
                  setNewDoctor({ ...newDoctor, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-specialty">Specialty</Label>
              <Input
                type="text"
                id="new-specialty"
                value={newDoctor.specialty}
                placeholder="General Dentist"
                onChange={(e) =>
                  setNewDoctor({ ...newDoctor, specialty: e.target.value })
                }
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-email">Email</Label>
            <Input
              id="new-email"
              type="email"
              value={newDoctor.email}
              placeholder="john.doe@example.com"
              onChange={(e) =>
                setNewDoctor({ ...newDoctor, email: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-phone">Phone</Label>
            <Input
              type="tel"
              id="new-phone"
              value={newDoctor.phone}
              placeholder="123-456-7890"
              onChange={handlePhoneNumber}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="new-gender">Gender</Label>
              <Select
                value={newDoctor.gender || ""}
                onValueChange={(value) =>
                  setNewDoctor({ ...newDoctor, gender: value as Gender })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">Male</SelectItem>
                  <SelectItem value="FEMALE">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-status">Status</Label>
              <Select
                value={newDoctor.isActive ? "active" : "inactive"}
                onValueChange={(value) =>
                  setNewDoctor({ ...newDoctor, isActive: value === "active" })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>

            <Button
              onClick={handleSubmit}
              className="bg-primary hover:bg-primary/90"
              disabled={
                !newDoctor.name ||
                !newDoctor.email ||
                !newDoctor.specialty ||
                isPending
              }
            >
              {isPending ? "Adding..." : "Add Doctor"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddDoctorDialog;
