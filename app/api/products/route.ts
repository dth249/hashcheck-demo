import conn from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const result = await conn`
        SELECT 
            p.id,
            p.name,
            p.price,
            p.description,
            p.created_at
        FROM products AS p
        ORDER BY p.created_at DESC
        `;

        return NextResponse.json(
            result,
            { status: 200 }
        );
    } catch (error: unknown) {
        console.error("Lỗi khi lấy danh sách sản phẩm", error);
        return NextResponse.json(
            { success: false, message: "Lấy danh sách sản phẩm thất bại", errorDetail: error },
            { status: 500 }
        );
    }
}