import conn from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const result = await conn`
        SELECT 
            o.id,
            o.product_id,
            o.quantity,
            o.total_price,
            o.hash,
            o.signature,
            o.created_at
        FROM orders AS o
        ORDER BY o.created_at DESC
        `;

        return NextResponse.json(
            result,
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Lỗi khi lấy danh sách đơn hàng", error);
        return NextResponse.json(
            { success: false, message: "Lấy danh sách đơn hàng thất bại", errorDetail: error },
            { status: 500 }
        );
    }
}