"use client"
import { create } from "zustand"

type BookingStore = {
  selectedService: string | null
  setSelectedService: (service: string) => void
}

export const useBookingStore = create<BookingStore>((set) => ({
  selectedService: null,
  setSelectedService: (service) => set({ selectedService: service }),
}))