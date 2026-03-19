"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Products() {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        setProducts(ProductsExample);
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Danh sách sản phẩm</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-gray-100 border border-gray-200">
                {products.map((product) => (
                    <Link href={`/product/${product.id}`} className="p-2 bg-white border border-gray-200 gap-3 flex flex-col hover:-translate-y-2 transition-all cursor-pointer" key={`${product.id}-${product.name}`}>
                        <div className="w-full h-[200px] relative">
                            <Image src={`https://picsum.photos/300/300?random=${product.id}`} alt={product.name} fill className="object-cover" />
                        </div>
                        <p>{product.name}</p>
                        <div className="flex justify-between items-center">
                            <p className="text-red-500 font-bold">{product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                            <button className="bg-red-500 text-white px-2 py-1">Chi tiết</button>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}


export type Product = {
    id: number;
    name: string;
    price: number;
    description: string;
}

export const ProductsExample: Product[] = [
    {
        id: 1,
        name: "Áo thun nam",
        price: 150000,
        description: "Áo thun nam chất liệu cotton thoáng mát, thấm hút mồ hôi tốt. Kiểu dáng trẻ trung, năng động, phù hợp cho nhiều dịp.",
    },
    {
        id: 2,
        name: "Áo thun nữ",
        price: 120000,
        description: "Áo thun nữ form rộng, tôn dáng. Chất vải mềm mịn, không xù lông mang lại cảm giác thoải mái khi mặc.",
    },
    {
        id: 3,
        name: "Quần short nam",
        price: 180000,
        description: "Quần short nam kaki cao cấp. Thiết kế hiện đại, đường may chắc chắn. Có nhiều màu sắc để lựa chọn.",
    },
    {
        id: 4,
        name: "Quần short nam",
        price: 180000,
        description: "Quần short nam kaki cao cấp. Thiết kế hiện đại, đường may chắc chắn. Có nhiều màu sắc để lựa chọn.",
    },
    {
        id: 5,
        name: "Quần short nam",
        price: 180000,
        description: "Quần short nam kaki cao cấp. Thiết kế hiện đại, đường may chắc chắn. Có nhiều màu sắc để lựa chọn.",
    },
    {
        id: 6,
        name: "Quần short nam",
        price: 180000,
        description: "Quần short nam kaki cao cấp. Thiết kế hiện đại, đường may chắc chắn. Có nhiều màu sắc để lựa chọn.",
    },
];