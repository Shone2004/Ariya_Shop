import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductReviews from "../components/ProductReviews";
import apiClient from "../utils/apiClient";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await apiClient(`/products/${id}`);
        const json = await res.json();
        if (json.success && json.data) {
          const prod = {
            ...json.data,
            id: json.data._id
          };
          setProduct(prod);
          
          window.scrollTo(0, 0);
        } else {
          navigate("/shop");
        }
      } catch (err) {
        console.error("Error loading product details:", err);
        navigate("/shop");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  if (loading || !product) {
    return (
      <div className="flex min-h-[60vh] w-full items-center justify-center bg-[#FCF9F5]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#C9A54B] border-t-transparent" />
          <p className="text-sm tracking-widest text-[#9a8a7a] uppercase">Loading Product...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <ProductReviews product={product} />
    </div>
  );
};

export default ProductDetails;
