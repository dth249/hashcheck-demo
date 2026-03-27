import conn from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
    _: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    const result = await conn`
        SELECT * FROM products WHERE id = ${id}
    `;

    if (result.length === 0) {
        return NextResponse.json(
            { success: false, message: "sản phẩm không tồn tại" },
            { status: 404 }
        );
    }

    return NextResponse.json({ success: true, product: result[0] }, { status: 200 });
}