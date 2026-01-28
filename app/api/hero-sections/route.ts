import { NextRequest, NextResponse } from 'next/server'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

/**
 * GET /api/hero-sections
 * Fetch all hero sections from Laravel backend
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const page = searchParams.get('page') || '1'
    const perPage = searchParams.get('perPage') || '10'
    const sortBy = searchParams.get('sortBy') || 'created_at'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // Build Laravel API URL
    const params = new URLSearchParams({
      page,
      per_page: perPage,
      sort_by: sortBy,
      sort_order: sortOrder,
    })
    
    if (status) params.append('status', status)

    const laravelUrl = `${API_URL}/hero-sections?${params.toString()}`

    console.log('🔍 Fetching from Laravel:', laravelUrl)

    const response = await fetch(laravelUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    console.log('📡 Laravel response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Laravel error:', errorText)
      return NextResponse.json(
        { error: 'Failed to fetch hero sections from Laravel' },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log('✅ Hero sections data received:', data)
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('💥 Next.js API route error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/hero-sections
 * Create a new hero section
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    console.log('📤 Creating hero section...')

    const response = await fetch(`${API_URL}/hero-sections`, {
      method: 'POST',
      body: formData,
    })

    console.log('📡 Create response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Create error:', errorText)
      
      try {
        const errorData = JSON.parse(errorText)
        return NextResponse.json(
          { message: errorData.message || 'Failed to create hero section', errors: errorData.errors },
          { status: response.status }
        )
      } catch {
        return NextResponse.json(
          { message: 'Failed to create hero section' },
          { status: response.status }
        )
      }
    }

    const data = await response.json()
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('💥 Create error:', error)
    return NextResponse.json(
      { 
        message: 'Failed to create hero section', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}