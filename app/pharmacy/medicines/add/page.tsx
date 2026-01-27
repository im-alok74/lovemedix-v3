import { redirect } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { getCurrentUser } from '@/lib/auth-server'
import { checkSellerVerification, getSellerProfile } from '@/lib/seller-auth'
import { sql } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AlertCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

async function addMedicineToInventory(formData: FormData) {
  'use server'
  
  const user = await getCurrentUser()
  if (!user || user.user_type !== 'pharmacy') {
    redirect('/signin')
  }

  const verification = await checkSellerVerification(user.id, 'pharmacy')
  if (!verification.verified) {
    redirect('/pharmacy/medicines')
  }

  const profile = await getSellerProfile(user.id, 'pharmacy')
  if (!profile) {
    redirect('/pharmacy/register')
  }

  const medicineId = Number(formData.get('medicine_id'))
  const stockQuantity = Number(formData.get('stock_quantity'))
  const sellingPrice = Number(formData.get('selling_price'))
  const discountPercentage = Number(formData.get('discount_percentage')) || 0
  const batchNumber = formData.get('batch_number') as string
  const expiryDate = formData.get('expiry_date') as string

  try {
    const result = await sql`
      INSERT INTO pharmacy_inventory (pharmacy_id, medicine_id, stock_quantity, selling_price, discount_percentage, batch_number, expiry_date)
      VALUES (${(profile as any).id}, ${medicineId}, ${stockQuantity}, ${sellingPrice}, ${discountPercentage}, ${batchNumber || null}, ${expiryDate || null})
      ON CONFLICT (pharmacy_id, medicine_id, batch_number)
      DO UPDATE SET 
        stock_quantity = ${stockQuantity},
        selling_price = ${sellingPrice},
        discount_percentage = ${discountPercentage},
        expiry_date = ${expiryDate || null},
        last_updated = CURRENT_TIMESTAMP
      RETURNING id
    `

    redirect(`/pharmacy/medicines?added=true`)
  } catch (error) {
    console.error('[v0] Error adding medicine:', error)
    throw error
  }
}

export default async function AddMedicinePage() {
  const user = await getCurrentUser()

  if (!user || user.user_type !== 'pharmacy') {
    redirect('/signin')
  }

  const verification = await checkSellerVerification(user.id, 'pharmacy')
  const profile = await getSellerProfile(user.id, 'pharmacy')

  if (!profile || !verification.verified) {
    redirect('/pharmacy/medicines')
  }

  // Fetch available medicines
  const medicines = await sql`
    SELECT id, name, generic_name, manufacturer, category, strength, mrp, pack_size
    FROM medicines
    WHERE status = 'active'
    ORDER BY category, name
  `

  const groupedMedicines = (medicines as any[]).reduce((acc, med) => {
    if (!acc[med.category]) {
      acc[med.category] = []
    }
    acc[med.category].push(med)
    return acc
  }, {} as Record<string, any[]>)

  return (
    <div className='flex min-h-screen flex-col'>
      <Header />
      <main className='flex-1'>
        <div className='container mx-auto px-4 py-8'>
          <div className='mb-6 flex items-center gap-3'>
            <Link href='/pharmacy/medicines'>
              <Button variant='ghost' size='icon'>
                <ArrowLeft className='h-4 w-4' />
              </Button>
            </Link>
            <h1 className='text-3xl font-bold text-foreground'>Add Medicine to Inventory</h1>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Medicine Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={addMedicineToInventory} className='space-y-6'>
                <div>
                  <label htmlFor='medicine_id' className='block text-sm font-medium mb-2'>
                    Select Medicine <span className='text-destructive'>*</span>
                  </label>
                  <select
                    id='medicine_id'
                    name='medicine_id'
                    required
                    className='w-full px-3 py-2 border border-input rounded-md text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-primary'
                  >
                    <option value=''>Choose a medicine...</option>
                    {Object.entries(groupedMedicines).map(([category, meds]) => (
                      <optgroup key={category} label={category}>
                        {meds.map((med) => (
                          <option key={med.id} value={med.id}>
                            {med.name} - {med.strength} ({med.generic_name}) - MRP: ₹{Number(med.mrp).toFixed(2)}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>

                <div className='grid md:grid-cols-2 gap-4'>
                  <div>
                    <label htmlFor='stock_quantity' className='block text-sm font-medium mb-2'>
                      Stock Quantity <span className='text-destructive'>*</span>
                    </label>
                    <Input
                      type='number'
                      id='stock_quantity'
                      name='stock_quantity'
                      required
                      min='0'
                      placeholder='e.g., 100'
                    />
                  </div>

                  <div>
                    <label htmlFor='selling_price' className='block text-sm font-medium mb-2'>
                      Selling Price (₹) <span className='text-destructive'>*</span>
                    </label>
                    <Input
                      type='number'
                      id='selling_price'
                      name='selling_price'
                      required
                      step='0.01'
                      min='0'
                      placeholder='e.g., 150'
                    />
                  </div>
                </div>

                <div className='grid md:grid-cols-2 gap-4'>
                  <div>
                    <label htmlFor='discount_percentage' className='block text-sm font-medium mb-2'>
                      Discount (%)
                    </label>
                    <Input
                      type='number'
                      id='discount_percentage'
                      name='discount_percentage'
                      step='0.01'
                      min='0'
                      max='100'
                      placeholder='e.g., 10'
                    />
                  </div>

                  <div>
                    <label htmlFor='batch_number' className='block text-sm font-medium mb-2'>
                      Batch Number
                    </label>
                    <Input
                      type='text'
                      id='batch_number'
                      name='batch_number'
                      placeholder='e.g., BATCH001'
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor='expiry_date' className='block text-sm font-medium mb-2'>
                    Expiry Date
                  </label>
                  <Input
                    type='date'
                    id='expiry_date'
                    name='expiry_date'
                  />
                </div>

                <div className='bg-muted/50 p-4 rounded-lg border border-muted'>
                  <h3 className='font-semibold text-sm mb-2'>GST Information</h3>
                  <p className='text-xs text-muted-foreground'>
                    GST will be calculated at checkout based on the medicine category and your registered GST number:
                    <span className='font-medium block mt-1'>{(profile as any).gst_number}</span>
                  </p>
                </div>

                <div className='flex gap-3'>
                  <Button type='submit'>Add Medicine</Button>
                  <Link href='/pharmacy/medicines'>
                    <Button variant='outline'>Cancel</Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
