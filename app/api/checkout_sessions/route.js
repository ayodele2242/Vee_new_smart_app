import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
	apiVersion: "2022-11-15",
})

export async function GET(req, res) {
	const urlObj = new URL(req.url)
	const queryParams = urlObj.searchParams
	const session_id = queryParams.get("session_id")
	try {
		const session = await stripe.checkout.sessions.retrieve(session_id)

		return NextResponse.json(
			{
				status: session.status,
				customer_email: session.customer_details.email,
			},
			{ status: 200 }
		)
	} catch (error) {
		return NextResponse.json(error, {
			status: 400,
		})
	}
}

export async function POST(req, res) {
	const { lineItems } = await req.json()

	try {
		const transformedItems = lineItems?.map((item) => ({
			price_data: {
				currency: "usd",
				product_data: {
					name: item.description,
				},
				unit_amount: item.price * 100,
			},
			quantity: parseInt(item.quantity, 10),
		}))
		const session = await stripe.checkout.sessions.create({
			ui_mode: 'embedded',
			payment_method_types: ["card"],
			mode: "payment",
			line_items: transformedItems,
			return_url: `${process.env.SERVER_URL}/cart/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
			//success_url: `${process.env.SERVER_URL}/success?addressId?session_id={CHECKOUT_SESSION_ID}`,
			//cancel_url: `${process.env.SERVER_URL}/cart`,
		})

		return NextResponse.json({ clientSecret: session.client_secret }, { status: 200 })
	} catch (error) {
		return NextResponse.json(error, {
			status: 400,
			message: error
		})
	}
}
