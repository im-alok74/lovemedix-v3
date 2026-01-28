import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/auth-server'
import { sql } from '@/lib/db'

// GET /api/admin/users - Get all users (with optional search, filter, pagination)
export async function GET(request: NextRequest) {
  try {
    await requireRole(['admin'])

    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query') || ''
    const typeFilter = searchParams.get('type') || 'all'
    const statusFilter = searchParams.get('status') || 'all'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit

    let whereClause = ''
    const queryParams: (string | number)[] = []

    if (query) {
      whereClause += `(full_name ILIKE $${queryParams.length + 1} OR email ILIKE $${queryParams.length + 2})`
      queryParams.push(`%${query}%`, `%${query}%`)
    }

    if (typeFilter !== 'all') {
      if (whereClause) whereClause += ' AND '
      whereClause += `user_type = $${queryParams.length + 1}`
      queryParams.push(typeFilter)
    }

    if (statusFilter !== 'all') {
      if (whereClause) whereClause += ' AND '
      whereClause += `status = $${queryParams.length + 1}`
      queryParams.push(statusFilter)
    }

    const finalWhereClause = whereClause ? `WHERE ${whereClause}` : ''

    const usersResult = await sql.query(`
      SELECT id, email, full_name, phone, user_type, status, created_at
      FROM users
      ${finalWhereClause}
      ORDER BY created_at DESC
      LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}
    `, [...queryParams, limit, offset]) as { rows: any[] }
    const users = (usersResult && usersResult.rows) ? usersResult.rows : []

    const totalUsersResult = await sql.query(`
      SELECT COUNT(*) as total
      FROM users
      ${finalWhereClause}
    `, queryParams) as { rows: any[] }

    const totalUsers = (totalUsersResult && totalUsersResult.rows && totalUsersResult.rows.length > 0) ? (totalUsersResult.rows[0] as any).total : 0

    return NextResponse.json({
      users: users,
      totalUsers,
      page,
      limit,
      totalPages: Math.ceil(totalUsers / limit),
    })
  } catch (error: any) {
    console.error('[v0] Error fetching users:', error)
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    return NextResponse.json(
      { error: 'Failed to fetch users', details: String(error) },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/users/[id] - Update user type and status
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireRole(['admin'])

    const userId = Number(params.id)
    if (isNaN(userId)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 })
    }

    const { user_type, status } = await request.json()

    if (!user_type && !status) {
      return NextResponse.json({ error: 'No fields provided for update' }, { status: 400 })
    }

    let updateClause = ''
    const queryParams: (string | number)[] = []

    if (user_type) {
      updateClause += `user_type = $${queryParams.length + 1}`
      queryParams.push(user_type)
    }

    if (status) {
      if (updateClause) updateClause += ', '
      updateClause += `status = $${queryParams.length + 1}`
      queryParams.push(status)
    }

    if (!updateClause) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
    }

    await sql.query(`
      UPDATE users
      SET ${updateClause}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${queryParams.length + 1}
    `, [...queryParams, userId])

    return NextResponse.json({ success: true, message: 'User updated successfully' })
  } catch (error: any) {
    console.error('[v0] Error updating user:', error)
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    return NextResponse.json(
      { error: 'Failed to update user', details: String(error) },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/users/[id] - Delete a user
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireRole(['admin'])

    const userId = Number(params.id)
    if (isNaN(userId)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 })
    }

    await sql.query`
      DELETE FROM users WHERE id = ${userId}
    `

    return NextResponse.json({ success: true, message: 'User deleted successfully' })
  } catch (error: any) {
    console.error('[v0] Error deleting user:', error)
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    return NextResponse.json(
      { error: 'Failed to delete user', details: String(error) },
      { status: 500 }
    )
  }
}