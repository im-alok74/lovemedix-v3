'use client';

import { redirect } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { getCurrentUser } from '@/lib/auth'
import { sql } from '@/lib/db'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Download, Printer } from 'lucide-react'
import Image from 'next/image'
import html2pdf from 'html2pdf.js'

export default async function InvoicePage({ params }: { params: { orderId: string } }) {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/signin')
  }

  // Fetch order details
  const orderResult = await sql`
    SELECT 
      o.*,
      u.full_name as customer_name,
      u.phone as customer_phone,
      pp.pharmacy_name,
      pp.gst_number as pharmacy_gst,
      pp.address as pharmacy_address,
      pp.city as pharmacy_city,
      pp.state as pharmacy_state,
      pp.pincode as pharmacy_pincode,
      pp.license_number
    FROM orders o
    JOIN users u ON o.customer_id = u.id
    JOIN pharmacy_profiles pp ON o.pharmacy_id = pp.id
    WHERE o.order_number = ${params.orderId} OR o.id = ${Number(params.orderId) || 0}
    AND o.customer_id = ${user.id}
    LIMIT 1
  `

  if (orderResult.length === 0) {
    redirect('/orders')
  }

  const order = orderResult[0] as any

  // Fetch order items with medicine details
  const items = await sql`
    SELECT 
      oi.*,
      m.name,
      m.generic_name,
      m.hsn_code
    FROM order_items oi
    JOIN medicines m ON oi.medicine_id = m.id
    WHERE oi.order_id = ${order.id}
  `

  const calculatedGST = order.subtotal * 0.05
  const platformFee = order.delivery_charge

  return (
    <div className='flex min-h-screen flex-col'>
      <Header />
      <main className='flex-1'>
        <div className='container mx-auto px-4 py-8'>
          <div className='mb-6 flex items-center justify-between'>
            <h1 className='text-3xl font-bold text-foreground'>Invoice</h1>
            <div className='flex gap-2'>
              <Button onClick={() => window.print()} className='flex items-center gap-2'>
                <Printer className='h-4 w-4' />
                Print
              </Button>
            </div>
          </div>

          <Card className='p-8 print:shadow-none print:border-0'>
            {/* Header */}
            <div className='mb-8 border-b border-border pb-8'>
              <div className='flex justify-between items-start mb-6'>
                <div>
                  <h2 className='text-2xl font-bold text-primary'>LoveMedix</h2>
                  <p className='text-sm text-muted-foreground'>Tax Invoice</p>
                </div>
                <div className='text-right'>
                  <p className='font-semibold text-foreground'>Order No: {order.order_number}</p>
                  <p className='text-sm text-muted-foreground'>
                    Date: {new Date(order.created_at).toLocaleDateString('en-IN')}
                  </p>
                </div>
              </div>
            </div>

            {/* Seller Details */}
            <div className='mb-8 grid grid-cols-2 gap-8'>
              <div>
                <h3 className='font-semibold text-foreground mb-2'>Sold By:</h3>
                <p className='font-medium text-foreground'>{order.pharmacy_name}</p>
                <p className='text-sm text-muted-foreground'>{order.pharmacy_address}</p>
                <p className='text-sm text-muted-foreground'>
                  {order.pharmacy_city}, {order.pharmacy_state} - {order.pharmacy_pincode}
                </p>
                <div className='mt-4 space-y-1 text-sm'>
                  <p className='text-muted-foreground'>
                    License: <span className='font-medium text-foreground'>{order.license_number}</span>
                  </p>
                  <p className='text-muted-foreground'>
                    GST: <span className='font-medium text-foreground'>{order.pharmacy_gst}</span>
                  </p>
                </div>
              </div>

              <div>
                <h3 className='font-semibold text-foreground mb-2'>Bill To:</h3>
                <p className='font-medium text-foreground'>{order.customer_name}</p>
                <p className='text-sm text-muted-foreground'>{order.customer_phone}</p>
              </div>
            </div>

            {/* Items Table */}
            <div className='mb-8'>
              <table className='w-full text-sm'>
                <thead>
                  <tr className='border-b-2 border-foreground'>
                    <th className='text-left py-3 px-2 font-semibold'>Item</th>
                    <th className='text-left py-3 px-2 font-semibold'>HSN</th>
                    <th className='text-right py-3 px-2 font-semibold'>Qty</th>
                    <th className='text-right py-3 px-2 font-semibold'>Unit Price</th>
                    <th className='text-right py-3 px-2 font-semibold'>Discount</th>
                    <th className='text-right py-3 px-2 font-semibold'>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {(items as any[]).map((item) => (
                    <tr key={item.id} className='border-b border-border'>
                      <td className='py-3 px-2'>
                        <div>
                          <p className='font-medium text-foreground'>{item.name}</p>
                          <p className='text-xs text-muted-foreground'>{item.generic_name}</p>
                        </div>
                      </td>
                      <td className='py-3 px-2 text-muted-foreground'>{item.hsn_code || 'N/A'}</td>
                      <td className='py-3 px-2 text-right'>{item.quantity}</td>
                      <td className='py-3 px-2 text-right'>₹{Number(item.unit_price).toFixed(2)}</td>
                      <td className='py-3 px-2 text-right'>
                        {item.discount_percentage > 0 && (
                          <span className='text-green-600'>
                            ₹{(Number(item.unit_price) * item.quantity * item.discount_percentage / 100).toFixed(2)}
                          </span>
                        )}
                      </td>
                      <td className='py-3 px-2 text-right font-medium'>
                        ₹{Number(item.total_price).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary */}
            <div className='mb-8 flex justify-end'>
              <div className='w-full md:w-80'>
                <div className='space-y-2 border-t border-border pt-4'>
                  <div className='flex justify-between text-sm'>
                    <span className='text-muted-foreground'>Subtotal (Before GST):</span>
                    <span className='font-medium'>₹{Number(order.subtotal).toFixed(2)}</span>
                  </div>
                  <div className='flex justify-between text-sm'>
                    <span className='text-muted-foreground'>GST (5%):</span>
                    <span className='font-medium'>₹{calculatedGST.toFixed(2)}</span>
                  </div>
                  <div className='flex justify-between text-sm'>
                    <span className='text-muted-foreground'>Delivery Charge:</span>
                    <span className='font-medium'>
                      {platformFee === 0 ? 'FREE' : `₹${Number(platformFee).toFixed(2)}`}
                    </span>
                  </div>
                  <div className='flex justify-between border-t border-foreground pt-2 mt-2'>
                    <span className='font-semibold text-foreground'>Total Amount:</span>
                    <span className='text-lg font-bold text-primary'>
                      ₹{Number(order.total_amount).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className='border-t border-border pt-6 text-center text-xs text-muted-foreground'>
              <p>This is a computer-generated invoice</p>
              <p>For queries, contact support@lovemedix.com</p>
              <p className='mt-4'>Thank you for your purchase!</p>
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
