import { redirect } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { getCurrentUser } from '@/lib/auth'
import { checkSellerVerification, getSellerProfile } from '@/lib/seller-auth'
import { sql } from '@/lib/db'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircle, Plus } from 'lucide-react'
import Link from 'next/link'

export default async function PharmacyMedicinesPage() {
  const user = await getCurrentUser()

  if (!user || user.user_type !== 'pharmacy') {
    redirect('/signin')
  }

  // Check if pharmacy is verified
  const verification = await checkSellerVerification(user.id, 'pharmacy')
  const profile = await getSellerProfile(user.id, 'pharmacy')

  if (!profile) {
    redirect('/pharmacy/register')
  }

  // Get pharmacy inventory
  const inventory = await sql`
    SELECT 
      pi.id,
      pi.medicine_id,
      pi.stock_quantity,
      pi.selling_price,
      pi.discount_percentage,
      pi.batch_number,
      pi.expiry_date,
      m.name as medicine_name,
      m.generic_name,
      m.manufacturer,
      m.category,
      m.strength
    FROM pharmacy_inventory pi
    JOIN medicines m ON pi.medicine_id = m.id
    WHERE pi.pharmacy_id = ${profile.id}
    ORDER BY m.category, m.name
  `

  return (
    <div className='flex min-h-screen flex-col'>
      <Header />
      <main className='flex-1'>
        <div className='container mx-auto px-4 py-8'>
          <div className='mb-8 flex items-center justify-between'>
            <h1 className='text-3xl font-bold text-foreground'>Manage Inventory</h1>
            {verification.verified && (
              <Link href='/pharmacy/medicines/add'>
                <Button className='flex items-center gap-2'>
                  <Plus className='h-4 w-4' />
                  Add Medicine
                </Button>
              </Link>
            )}
          </div>

          {!verification.verified && (
            <Card className='border-destructive/50 bg-destructive/5 mb-8'>
              <CardContent className='p-6'>
                <div className='flex items-start gap-4'>
                  <AlertCircle className='h-5 w-5 text-destructive mt-1 flex-shrink-0' />
                  <div>
                    <h3 className='font-semibold text-foreground mb-2'>Verification Required</h3>
                    <p className='text-sm text-muted-foreground mb-4'>
                      Your pharmacy is not yet verified. Only verified pharmacies can add and manage medicines in the marketplace.
                    </p>
                    <p className='text-sm text-muted-foreground'>
                      Current status: <span className='font-medium capitalize'>{profile.verification_status}</span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {verification.verified && inventory.length === 0 ? (
            <Card>
              <CardContent className='p-12 text-center'>
                <p className='text-muted-foreground mb-4'>No medicines in your inventory yet</p>
                <Link href='/pharmacy/medicines/add'>
                  <Button>Add Your First Medicine</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className='overflow-x-auto'>
              <table className='w-full text-sm'>
                <thead>
                  <tr className='border-b'>
                    <th className='text-left py-3 px-4 font-semibold'>Medicine Name</th>
                    <th className='text-left py-3 px-4 font-semibold'>Category</th>
                    <th className='text-right py-3 px-4 font-semibold'>Stock</th>
                    <th className='text-right py-3 px-4 font-semibold'>Price</th>
                    <th className='text-right py-3 px-4 font-semibold'>Expiry</th>
                    <th className='text-left py-3 px-4 font-semibold'>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(inventory as any[]).map((item) => (
                    <tr key={item.id} className='border-b hover:bg-muted/50'>
                      <td className='py-3 px-4'>
                        <div>
                          <p className='font-medium'>{item.medicine_name}</p>
                          <p className='text-xs text-muted-foreground'>{item.generic_name}</p>
                        </div>
                      </td>
                      <td className='py-3 px-4 text-muted-foreground'>{item.category}</td>
                      <td className='py-3 px-4 text-right'>{item.stock_quantity}</td>
                      <td className='py-3 px-4 text-right'>₹{Number(item.selling_price).toFixed(2)}</td>
                      <td className='py-3 px-4 text-right text-muted-foreground'>{item.expiry_date}</td>
                      <td className='py-3 px-4'>
                        <div className='flex gap-2'>
                          <Link href={`/pharmacy/medicines/${item.id}/edit`}>
                            <Button variant='outline' size='sm'>Edit</Button>
                          </Link>
                          <Button variant='outline' size='sm' className='text-destructive'>Delete</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
