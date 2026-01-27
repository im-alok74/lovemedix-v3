import { sql } from '@/lib/db'

export interface SellerProfile {
  id: number
  user_id: number
  pharmacy_name?: string
  company_name?: string
  verification_status: 'pending' | 'verified' | 'rejected'
  gst_number: string
}

/**
 * Check if a seller (pharmacy/distributor) is verified and authorized
 */
export async function checkSellerVerification(userId: number, userType: 'pharmacy' | 'distributor') {
  try {
    const table = userType === 'pharmacy' ? 'pharmacy_profiles' : 'distributor_profiles'
    
    const result = await sql`
      SELECT id, verification_status, gst_number
      FROM ${sql.unsafe(table)}
      WHERE user_id = ${userId}
      LIMIT 1
    `

    if (result.length === 0) {
      return { verified: false, reason: 'PROFILE_NOT_FOUND' }
    }

    const profile = result[0] as any

    if (profile.verification_status !== 'verified') {
      return { 
        verified: false, 
        reason: 'NOT_VERIFIED',
        status: profile.verification_status
      }
    }

    if (!profile.gst_number) {
      return { verified: false, reason: 'MISSING_GST' }
    }

    return { verified: true, profile }
  } catch (error) {
    console.error('[v0] Seller verification check failed:', error)
    return { verified: false, reason: 'ERROR' }
  }
}

/**
 * Get seller profile with verification status
 */
export async function getSellerProfile(userId: number, userType: 'pharmacy' | 'distributor') {
  try {
    const table = userType === 'pharmacy' ? 'pharmacy_profiles' : 'distributor_profiles'
    
    const result = await sql`
      SELECT * FROM ${sql.unsafe(table)}
      WHERE user_id = ${userId}
      LIMIT 1
    `

    return result.length > 0 ? result[0] : null
  } catch (error) {
    console.error('[v0] Failed to get seller profile:', error)
    return null
  }
}

/**
 * Log access attempts for unverified sellers (for audit trail)
 */
export async function logAccessAttempt(userId: number, userType: string, action: string, allowed: boolean) {
  try {
    // Future: Store in access_logs table for admin audit
    console.log(`[v0] Access Log: User ${userId} (${userType}) attempted "${action}" - ${allowed ? 'ALLOWED' : 'DENIED'}`)
  } catch (error) {
    console.error('[v0] Failed to log access attempt:', error)
  }
}
