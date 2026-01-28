import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import Image from "next/image"
import { Linkedin, Instagram, Globe, Facebook } from "lucide-react"

export type TeamMember = {
  name: string
  role: string
  specialty: string
  image: string
  bio: string
  socials?: {
    facebook?: string
    instagram?: string
    linkedin?: string
    website?: string
  }
}

type Props = {
  selectedMember: TeamMember | null
  setSelectedMember: (member: TeamMember | null) => void
}

export function TeamMemberDialog({ selectedMember, setSelectedMember }: Props) {
  return (
    <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
      <DialogContent className="max-w-3xl h-[60vh] bg-gradient-to-br from-[#2d1810] to-[#1a0f0a] border-[#d4a574]/50 overflow-y-auto scrollbar-hide">
        {selectedMember && (
          <>
            {/* HEADER */}
            <DialogHeader>
              <span className="inline-block px-3 py-1 bg-gradient-to-r from-[#d4a574]/20 to-[#c9944a]/20 text-[#d4a574] text-xs font-semibold rounded-full w-fit mb-2 border border-[#d4a574]/30">
                {selectedMember.specialty}
              </span>

              <DialogTitle className="text-2xl font-serif bg-gradient-to-r from-white to-[#d4a574] bg-clip-text text-transparent">
                {selectedMember.name}
              </DialogTitle>

              <DialogDescription className="text-sm text-gray-300">
                {selectedMember.role}
              </DialogDescription>
            </DialogHeader>

            {/* IMAGE */}
            <div className="relative h-96 overflow-hidden bg-black">
              <Image
                src={selectedMember.image}
                alt={selectedMember.name}
                fill
                sizes="w-full h-full"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a0f0a]/70 to-transparent" />
            </div>

            {/* BIO */}
            <p className="text-gray-300 leading-relaxed text-base border-l-4 border-[#d4a574] pl-4 italic">
              {selectedMember.bio}
            </p>

            {/* SOCIALS */}
            {selectedMember.socials && (
              <div className="flex gap-4 mt-6">
                {selectedMember.socials.facebook && (
                  <a
                    href={selectedMember.socials.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full border border-[#d4a574]/40 text-[#FFD700] hover:bg-[#d4a574]/20 transition"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                )}
                {selectedMember.socials.instagram && (
                  <a
                    href={selectedMember.socials.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full border border-[#d4a574]/40 text-[#FFD700] hover:bg-[#d4a574]/20 transition"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                )}
                {selectedMember.socials.linkedin && (
                  <a
                    href={selectedMember.socials.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full border border-[#d4a574]/40 text-[#FFD700] hover:bg-[#d4a574]/20 transition"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                )}
                {selectedMember.socials.website && (
                  <a
                    href={selectedMember.socials.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full border border-[#d4a574]/40 text-[#FFD700] hover:bg-[#d4a574]/20 transition"
                  >
                    <Globe className="w-5 h-5" />
                  </a>
                )}
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
