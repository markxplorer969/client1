import { NextRequest, NextResponse } from 'next/server'
import { adminAuth } from '@/lib/firebase/admin'
import { getUser, userAdd, userEdit } from '@/lib/firebase/db'
import { adminEmail } from '@/lib/firebase/config'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { idToken } = body

    if (!idToken) {
      return NextResponse.json(
        { status: false, message: 'ID token diperlukan' },
        { status: 400 }
      )
    }

    // Verify ID token using Firebase Admin
    const decodedToken = await adminAuth.verifyIdToken(idToken)
    const { email, name, uid } = decodedToken

    if (!email) {
      return NextResponse.json(
        { status: false, message: 'Invalid token' },
        { status: 400 }
      )
    }

    // Check if user exists in Firestore
    const userResult = await getUser(email)

    if (!userResult.status) {
      // Create new user in Firestore
      const isAdmin = email === adminEmail
      await userAdd(
        email,
        name || email,
        isAdmin
      )
    } else {
      // Update user name if changed
      if (userResult.data && userResult.data.name !== name) {
        await userEdit(email, { name: name || userResult.data.name })
      }
    }

    // Return user data with cookie
    const isAdminUser = email === adminEmail
    const response = NextResponse.json({
      status: true,
      message: 'Login berhasil',
      data: {
        uid,
        email,
        name,
        type: isAdminUser ? 'admin' : 'user'
      }
    })

    // Set httpOnly cookie with Firebase token
    response.cookies.set('firebase_token', idToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    })

    // Set additional cookie for backward compatibility
    response.cookies.set('token', idToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    })

    return response
  } catch (error: any) {
    console.error('Login error:', error)

    // Check if it's an auth error
    if (error.code === 'auth/id-token-expired') {
      return NextResponse.json(
        { status: false, message: 'Sesi telah kedaluwarsa. Silakan login kembali.' },
        { status: 401 }
      )
    }

    if (error.code === 'auth/argument-error' || error.code === 'auth/id-token-revoked') {
      return NextResponse.json(
        { status: false, message: 'Token tidak valid. Silakan login kembali.' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { status: false, message: error.message || 'Terjadi kesalahan saat login' },
      { status: 500 }
    )
  }
}
