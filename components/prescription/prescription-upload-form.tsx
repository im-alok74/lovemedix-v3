"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Upload } from "lucide-react"

export function PrescriptionUploadForm() {
  const [formData, setFormData] = useState({
    doctorName: "",
    hospitalName: "",
    prescriptionDate: "",
    notes: "",
  })
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) {
      toast({
        title: "Error",
        description: "Please select a prescription image",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // In a real app, you would upload the file to a storage service
      // For now, we'll use a placeholder URL
      const prescriptionImageUrl = "/placeholder-prescription.jpg"

      const response = await fetch("/api/prescriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctorName: formData.doctorName,
          hospitalName: formData.hospitalName,
          prescriptionDate: formData.prescriptionDate,
          prescriptionImage: prescriptionImageUrl,
          notes: formData.notes,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: "Prescription uploaded successfully! It will be verified shortly.",
        })
        router.push("/prescriptions")
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to upload prescription",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="file">Prescription Image</Label>
        <div className="flex items-center gap-4">
          <Input id="file" type="file" accept="image/*" onChange={handleFileChange} required />
          <Upload className="h-5 w-5 text-muted-foreground" />
        </div>
        <p className="text-xs text-muted-foreground">Upload a clear image of your prescription (JPG, PNG)</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="doctorName">Doctor Name</Label>
        <Input
          id="doctorName"
          type="text"
          placeholder="Dr. John Doe"
          value={formData.doctorName}
          onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="hospitalName">Hospital/Clinic Name</Label>
        <Input
          id="hospitalName"
          type="text"
          placeholder="City Hospital"
          value={formData.hospitalName}
          onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="prescriptionDate">Prescription Date</Label>
        <Input
          id="prescriptionDate"
          type="date"
          value={formData.prescriptionDate}
          onChange={(e) => setFormData({ ...formData, prescriptionDate: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Additional Notes (Optional)</Label>
        <Textarea
          id="notes"
          placeholder="Any special instructions or notes..."
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Uploading..." : "Upload Prescription"}
      </Button>
    </form>
  )
}
