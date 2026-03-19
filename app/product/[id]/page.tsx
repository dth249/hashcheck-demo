"use client";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Product, ProductsExample } from "@/components/Products";

export default function ProductDetail() {
    const params = useParams();
    const id = Number(params.id);
    const [product, setProduct] = useState<Product | null>(null);

    useEffect(() => {
        const foundProduct = ProductsExample.find(p => p.id === id);
        setProduct(foundProduct || null);
    }, [id]);

    if (!product) {
        return (
            <div className="flex flex-col gap-4">
                <Link href="/" className="hover:underline">← Quay lại</Link>
                <div className="p-8 bg-gray-100 border border-gray-300 text-center">
                    <p className="text-xl">Không tìm thấy sản phẩm</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <Link href="/" className="hover:underline">← Quay lại</Link>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-100 border border-gray-200">
                <div className="w-full aspect-square relative border border-gray-200 bg-white">
                    <Image
                        src={`https://picsum.photos/600/600?random=${product.id}`}
                        alt={product.name}
                        fill
                        className="object-cover"
                    />
                </div>

                <div className="flex flex-col gap-4">
                    <h1 className="text-3xl font-bold">{product.name}</h1>
                    <p className="text-2xl text-red-500 font-bold">
                        {product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                    </p>

                    <div className="h-px bg-gray-400 my-2"></div>

                    <div className="text-gray-700 leading-relaxed">
                        <p className="font-semibold mb-2">Mô tả sản phẩm:</p>
                        <p>{product.description}</p>
                    </div>

                    <div className="mt-auto pt-6 flex flex-col sm:flex-row gap-3">
                        <button className="flex-1 bg-red-500 text-white font-bold py-3 px-6 hover:bg-red-600 transition-colors" onClick={() => alert("Mua ngay")}>
                            MUA NGAY
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
