"use client"

import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export function DistributorVerificationActions({ distributorId }: { distributorId: number }) {
  const { toast } = useToast()
  const router = useRouter()

  const updateStatus = async (status: string) => {
    try {
      const response = await fetch(`/api/admin/distributors/${distributorId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verificationStatus: status }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Distributor ${status}`,
        })
        router.refresh()
      } else {
        toast({
          title: "Error",
          description: "Failed to update status",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex gap-2">
      <Button size="sm" onClick={() => updateStatus("verified")}>
        Verify
      </Button>
      <Button size="sm" variant="destructive" onClick={() => updateStatus("rejected")}>
        Reject
      </Button>
    </div>
  )
}
