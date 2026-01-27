'use client'

import { useRef, useEffect, useState } from 'react'
import Image from 'next/image'
import { Download, Printer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

interface InvoiceItem {
  id: number
  name: string
  generic_name: string
  hsn_code: string
  quantity: number
  unit_price: number
  discount_percentage: number
  total_price: number
}

interface InvoiceDocumentProps {
  order: any
  items: InvoiceItem[]
  customerName: string
  customerPhone: string
  pharmacyName: string
  pharmacyGst: string
  pharmacyAddress: string
  pharmacyCity: string
  pharmacyState: string
  pharmacyPincode: string
  licenseNumber: string
}

export function InvoiceDocument({
  order,
  items,
  customerName,
  customerPhone,
  pharmacyName,
  pharmacyGst,
  pharmacyAddress,
  pharmacyCity,
  pharmacyState,
  pharmacyPincode,
  licenseNumber,
}: InvoiceDocumentProps) {
  const invoiceRef = useRef<HTMLDivElement>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const calculateGST = (subtotal: number) => subtotal * 0.05

  const downloadPDF = async () => {
    if (!invoiceRef.current) return

    // Create a canvas from the invoice element
    const element = invoiceRef.current
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
    })

    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF.jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    })

    const imgWidth = 210 // A4 width in mm
    const pageHeight = 297 // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight
    let position = 0

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight

    while (heightLeft > 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    pdf.save(`Invoice-${order.order_number}.pdf`)
  }

  if (!isClient) return null

  return (
    <div className="space-y-4">
      <div className="flex gap-2 justify-end no-print">
        <Button onClick={() => window.print()} className="flex items-center gap-2">
          <Printer className="h-4 w-4" />
          Print
        </Button>
        <Button onClick={downloadPDF} className="flex items-center gap-2 bg-primary">
          <Download className="h-4 w-4" />
          Download PDF
        </Button>
      </div>

      <Card className="p-8 print:shadow-none print:border-0 print:p-0" ref={invoiceRef}>
        {/* Header with Logo */}
        <div className="mb-8 border-b border-border pb-8">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16">
                <Image
                  src="/lovemedix-logo.jpg"
                  alt="LoveMedix Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-primary">LoveMedix Pharmacy</h2>
                <p className="text-sm text-muted-foreground">TAX INVOICE</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-foreground text-lg">Order #{order.order_number}</p>
              <p className="text-sm text-muted-foreground">
                Date: {new Date(order.created_at).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Seller and Buyer Details */}
        <div className="mb-8 grid grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold text-foreground mb-3 text-sm uppercase">Sold By:</h3>
            <div className="space-y-1">
              <p className="font-semibold text-foreground text-base">{pharmacyName}</p>
              <p className="text-sm text-muted-foreground">{pharmacyAddress}</p>
              <p className="text-sm text-muted-foreground">
                {pharmacyCity}, {pharmacyState} - {pharmacyPincode}
              </p>
              <div className="mt-3 space-y-1 pt-2 border-t border-border">
                <p className="text-sm">
                  <span className="text-muted-foreground">Drug License (DL):</span>
                  <span className="font-medium ml-2">{licenseNumber}</span>
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">GST No:</span>
                  <span className="font-medium ml-2">{pharmacyGst}</span>
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-3 text-sm uppercase">Bill To:</h3>
            <div className="space-y-1">
              <p className="font-semibold text-foreground text-base">{customerName}</p>
              <p className="text-sm text-muted-foreground">Phone: {customerPhone}</p>
              <p className="text-sm text-muted-foreground">Order Status: <span className="font-medium capitalize">{order.order_status}</span></p>
              <p className="text-sm text-muted-foreground">Payment: <span className="font-medium capitalize">{order.payment_method === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</span></p>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-8">
          <h3 className="font-semibold text-foreground mb-3 text-sm uppercase">Items</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-foreground bg-muted">
                <th className="text-left py-3 px-2 font-semibold">Medicine Name</th>
                <th className="text-left py-3 px-2 font-semibold">HSN Code</th>
                <th className="text-right py-3 px-2 font-semibold">Qty</th>
                <th className="text-right py-3 px-2 font-semibold">Unit Price</th>
                <th className="text-right py-3 px-2 font-semibold">Discount %</th>
                <th className="text-right py-3 px-2 font-semibold">Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={item.id} className="border-b border-border">
                  <td className="py-3 px-2">
                    <div>
                      <p className="font-medium text-foreground">{item.name}</p>
                      {item.generic_name && (
                        <p className="text-xs text-muted-foreground">{item.generic_name}</p>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-2 text-sm text-muted-foreground">{item.hsn_code || 'N/A'}</td>
                  <td className="py-3 px-2 text-right">{item.quantity}</td>
                  <td className="py-3 px-2 text-right">₹{Number(item.unit_price).toFixed(2)}</td>
                  <td className="py-3 px-2 text-right">{item.discount_percentage}%</td>
                  <td className="py-3 px-2 text-right font-medium">
                    ₹{Number(item.total_price).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="mb-8 flex justify-end">
          <div className="w-full md:w-96">
            <div className="space-y-2 border-t border-border pt-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal (Before GST):</span>
                <span className="font-semibold">₹{Number(order.subtotal).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">GST (5%):</span>
                <span className="font-semibold">₹{calculateGST(order.subtotal).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery Charge:</span>
                <span className="font-semibold">
                  {order.delivery_charge === 0 ? 'FREE' : `₹${Number(order.delivery_charge).toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between border-t-2 border-foreground pt-3 mt-3">
                <span className="font-bold text-foreground">Total Amount Payable:</span>
                <span className="text-xl font-bold text-primary">₹{Number(order.total_amount).toFixed(2)}</span>
              </div>
              <div className="mt-4 pt-3 border-t border-border">
                <p className="text-xs text-muted-foreground capitalize">
                  Payment Method: <span className="font-medium">{order.payment_method === 'cod' ? 'Cash on Delivery (COD)' : 'Online Payment'}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border pt-6 text-center text-xs text-muted-foreground space-y-1">
          <p className="font-semibold text-foreground">This is a computer-generated invoice</p>
          <p>For queries, contact: lovemedixpharmapvtltd@gmail.com | Phone: +91 9508178521</p>
          <p className="text-[11px] mt-3">Address: Silao, Nalanda, Bihar</p>
          <p className="mt-2 text-green-600 font-medium">Thank you for using LoveMedix Pharmacy!</p>
        </div>
      </Card>
    </div>
  )
}
