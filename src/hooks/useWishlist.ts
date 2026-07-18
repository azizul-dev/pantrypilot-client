"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "./useAuth";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export interface WishlistRecipe {
  _id: string;
  title: string;
  shortDescription: string;
  cuisineType: string;
  dietType: string;
  cookTime: number;
  difficulty: string;
  avgRating: number;
  totalReviews: number;
  images: string[];
}

export function useWishlist() {
  const { token, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const { data: wishlist = [], isLoading } = useQuery<WishlistRecipe[]>({
    queryKey: ["wishlist"],
    enabled: isAuthenticated && !!token,
    queryFn: async () => {
      const response = await axios.get(`${apiUrl}/wishlist`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data?.data?.wishlist || [];
    },
  });

  const wishlistIds = new Set(wishlist.map((r) => r._id));

  const addMutation = useMutation({
    mutationFn: async (recipeId: string) => {
      await axios.post(
        `${apiUrl}/wishlist/${recipeId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["wishlist"] }),
  });

  const removeMutation = useMutation({
    mutationFn: async (recipeId: string) => {
      await axios.delete(`${apiUrl}/wishlist/${recipeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["wishlist"] }),
  });

  const isInWishlist = (recipeId: string) => wishlistIds.has(recipeId);

  const toggleWishlist = (recipeId: string) => {
    if (!isAuthenticated) return;
    if (isInWishlist(recipeId)) {
      removeMutation.mutate(recipeId);
    } else {
      addMutation.mutate(recipeId);
    }
  };

  return { wishlist, isLoading, isInWishlist, toggleWishlist, isAuthenticated };
}
