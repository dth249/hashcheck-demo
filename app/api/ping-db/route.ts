import conn from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const result = await conn`SELECT NOW() AS time`;

        return NextResponse.json({
            success: true,
            message: "Kết nối database thành công",
            serverTime: result[0].time
        });

    } catch (error: any) {
        console.error("Lỗi kết nối DB:", error);

        return NextResponse.json({
            success: false,
            message: "Kết nối database thất bại",
            errorDetail: error
        }, { status: 500 });
    }
}