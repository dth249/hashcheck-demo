"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

function ProductSkeleton() {
    return (
        <div className="p-2 bg-white border border-gray-200 gap-3 flex flex-col animate-pulse">
            <div className="w-full h-[200px] bg-gray-200" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="flex justify-between items-center">
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-7 bg-gray-200 rounded w-16" />
            </div>
        </div>
    );
}

export default function Products() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/products")
            .then((res) => res.json())
            .then((data) => setProducts(data.products))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Danh sách sản phẩm</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-gray-100 border border-gray-200">
                {loading
                    ? Array.from({ length: 6 }).map((_, i) => <ProductSkeleton key={i} />)
                    : products.map((product) => (
                        <Link href={`/product/${product.id}`} className="p-2 bg-white border border-gray-200 gap-3 flex flex-col hover:-translate-y-2 transition-all cursor-pointer" key={`${product.id}-${product.name}`}>
                            <div className="w-full h-[200px] relative">
                                <Image src={product.img_url} alt={product.name} fill className="object-cover" />
                            </div>
                            <p>{product.name}</p>
                            <div className="flex justify-between items-center">
                                <p className="text-red-500 font-bold">{product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                                <button className="bg-red-500 text-white px-2 py-1">Chi tiết</button>
                            </div>
                        </Link>
                    ))
                }
            </div>
        </div>
    );
}


export type Product = {
    id: number;
    name: string;
    price: number;
    description: string;
    img_url: string;
    created_at: string;
}

