import { PrismaClient } from "@prisma/client"
import { generate } from "shortid"

const prisma = new PrismaClient()

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) return Response.json({ error: 'Not Found Id' })

    const result = await prisma.uRL.findFirst({ where: { short: id } })

    return Response.json({ url: result?.full })
}

export async function POST(req: Request) {
    const json = await req.json()

    const newUrl = await prisma.uRL.create({
        data: {
            full: json.url,
            short: generate()
        }
    })

    return Response.json({ url: `/${newUrl.short}/` })
}