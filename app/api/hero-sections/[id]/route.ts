import { NextRequest, NextResponse } from 'next/server'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

/**
 * GET /api/hero-section/[id]
 * Get a single hero section
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    console.log('Fetching hero section:', id) // Debug log

    const response = await fetch(`${API_URL}/hero-sections/${id}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      const text = await response.text()
      console.error('API error response:', text)
      throw new Error(`Laravel API error: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Hero section GET error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch hero section' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/hero-section/[id]
 * Update a hero section
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const formData = await request.formData()

    console.log('Updating hero section:', id) // Debug log

    // Laravel handles form data with _method=PUT
    formData.append('_method', 'PUT')

    const response = await fetch(`${API_URL}/hero-sections/${id}`, {
      method: 'POST', // Laravel uses POST with _method=PUT for form data
      body: formData,
      headers: {
        'Accept': 'application/json',
      },
    })

    console.log('Update response status:', response.status) // Debug log

    if (!response.ok) {
      const text = await response.text()
      console.error('API error response:', text)
      
      try {
        const errorData = JSON.parse(text)
        return NextResponse.json(
          { message: errorData.message || 'Failed to update hero section', errors: errorData.errors },
          { status: response.status }
        )
      } catch {
        return NextResponse.json(
          { message: 'Failed to update hero section' },
          { status: response.status }
        )
      }
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Hero section PUT error:', error)
    return NextResponse.json(
      { message: 'Failed to update hero section', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/hero-section/[id]
 * Delete a hero section
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    console.log('Deleting hero section:', id) // Debug log

    const response = await fetch(`${API_URL}/hero-sections/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })

    console.log('Delete response status:', response.status) // Debug log

    if (!response.ok) {
      const text = await response.text()
      console.error('API error response:', text)
      
      try {
        const errorData = JSON.parse(text)
        return NextResponse.json(
          { message: errorData.message || 'Failed to delete hero section' },
          { status: response.status }
        )
      } catch {
        return NextResponse.json(
          { message: 'Failed to delete hero section' },
          { status: response.status }
        )
      }
    }

    return NextResponse.json({ message: 'Hero section deleted successfully' })
  } catch (error) {
    console.error('Hero section DELETE error:', error)
    return NextResponse.json(
      { message: 'Failed to delete hero section', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}