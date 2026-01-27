import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q') || ''
    const category = searchParams.get('category') || ''
    const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : null
    const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : null
    const requiresPrescription = searchParams.get('prescription')
    const sortBy = searchParams.get('sortBy') || 'popularity'
    const limit = Number(searchParams.get('limit')) || 50
    const offset = Number(searchParams.get('offset')) || 0

    let whereCondition = `m.status = 'active' AND pp.verification_status = 'verified' AND pi.stock_quantity > 0`

    if (query) {
      // Escape single quotes in query
      const escapedQuery = query.replace(/'/g, "''")
      whereCondition += ` AND (LOWER(m.name) LIKE LOWER('%${escapedQuery}%') OR LOWER(m.generic_name) LIKE LOWER('%${escapedQuery}%') OR LOWER(m.manufacturer) LIKE LOWER('%${escapedQuery}%'))`
    }

    if (category) {
      whereCondition += ` AND m.category = '${category}'`
    }

    if (minPrice !== null) {
      whereCondition += ` AND pi.selling_price >= ${minPrice}`
    }

    if (maxPrice !== null) {
      whereCondition += ` AND pi.selling_price <= ${maxPrice}`
    }

    if (requiresPrescription === 'true') {
      whereCondition += ` AND m.requires_prescription = true`
    } else if (requiresPrescription === 'false') {
      whereCondition += ` AND m.requires_prescription = false`
    }

    let orderBy = 'pi.selling_price ASC'
    if (sortBy === 'price_high') {
      orderBy = 'pi.selling_price DESC'
    } else if (sortBy === 'name') {
      orderBy = 'm.name ASC'
    } else if (sortBy === 'rating') {
      orderBy = 'RAND() DESC'
    }

    const results = await sql.unsafe(`
      SELECT 
        m.id,
        m.name,
        m.generic_name,
        m.manufacturer,
        m.category,
        m.strength,
        m.form,
        m.pack_size,
        m.mrp,
        m.image_url,
        m.requires_prescription,
        pi.selling_price,
        pi.discount_percentage,
        pp.pharmacy_name,
        pp.id as pharmacy_id,
        (pi.selling_price * (1 - pi.discount_percentage / 100)) as final_price,
        COUNT(*) OVER () as total_count
      FROM medicines m
      JOIN pharmacy_inventory pi ON m.id = pi.medicine_id
      JOIN pharmacy_profiles pp ON pi.pharmacy_id = pp.id
      WHERE ${whereCondition}
      ORDER BY ${orderBy}
      LIMIT ${limit} OFFSET ${offset}
    `)

    // Group by medicine to get best price
    const medicines = results.reduce((acc: any[], med: any) => {
      const existing = acc.find((m) => m.id === med.id)
      if (!existing) {
        acc.push(med)
      } else if (med.final_price < existing.final_price) {
        acc[acc.indexOf(existing)] = med
      }
      return acc
    }, [])

    // Get unique categories for filter
    const categories = await sql`
      SELECT DISTINCT category FROM medicines WHERE status = 'active' ORDER BY category
    `

    return NextResponse.json({
      medicines,
      categories: (categories as any[]).map((c) => c.category),
      total: medicines.length > 0 ? medicines[0].total_count : 0,
      limit,
      offset
    })
  } catch (error) {
    console.error('[v0] Error searching medicines:', error)
    return NextResponse.json(
      { error: 'Failed to search medicines' },
      { status: 500 }
    )
  }
}
