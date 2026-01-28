export async function POST(req: Request) {
  try {
    const body = await req.json()

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const errorText = await res.text()
      console.error("Booking API error:", res.status, errorText)
      return new Response(JSON.stringify({ error: errorText }), {
        status: res.status,
        headers: { "Content-Type": "application/json" },
      })
    }

    const data = await res.json()
    return new Response(JSON.stringify(data), {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    })
  } catch (err: any) {
    console.error("Unexpected error:", err)
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}


// get all scheduled dates and time
export async function GET() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/schedule`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })

    if (!res.ok) {
      const errorText = await res.text()
      console.error("Booking API error:", res.status, errorText)
      return new Response(JSON.stringify({ error: errorText }), {
        status: res.status,
        headers: { "Content-Type": "application/json" },
      })
    }

    const data = await res.json()
    const bookedDates = data.map((booking: any) => ({
      date: booking.date,
      time: booking.times,
    }))

    return new Response(JSON.stringify(bookedDates), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (err: any) {
    console.error("Unexpected error:", err)
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
