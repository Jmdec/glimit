"use client";

import React from "react"
import { useState, useEffect, useCallback } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Trash2, Plus, Upload, X, MoreHorizontal, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DataTable } from "@/components/admin/data-table";

interface PortfolioItem {
  id: number;
  title: string;
  category: string;
  camera?: string;
  alt: string;
  image_path: string;
  order: number;
  created_at: string;
  updated_at: string;
}

const API_IMG = process.env.NEXT_PUBLIC_API_IMG;

export default function AdminPortfolio() {
  const { toast } = useToast();
  const [data, setData] = useState<PortfolioItem[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    camera: "",
    alt: "",
    image: null as File | null,
  });
  const [imagePreview, setImagePreview] = useState<string>("");

  const getImageUrl = (path: string) => {
    if (!path) return "/placeholder.svg";
    if (path.startsWith("http")) return path;
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${API_IMG}/${cleanPath}`;
  };

  const fetchPortfolio = useCallback(async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      query.append('page', (pageIndex + 1).toString());
      query.append('perPage', pageSize.toString());

      const response = await fetch(`/api/portfolio?${query.toString()}`, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const json = await response.json();
      const portfolio = Array.isArray(json.data) ? json.data : Array.isArray(json) ? json : [];
      setData(portfolio);
      setTotalPages(json.last_page ?? 1);
    } catch (err) {
      console.error('Fetch error:', err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : 'Failed to fetch portfolio items',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [pageIndex, pageSize, toast]);

  useEffect(() => {
    fetchPortfolio();
  }, [fetchPortfolio]);

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview("");
    setFormData((prev) => ({ ...prev, image: null }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a title",
        variant: "destructive",
      });
      return;
    }

    if (!formData.category.trim()) {
      toast({
        title: "Error",
        description: "Please enter a category",
        variant: "destructive",
      });
      return;
    }

    if (!formData.alt.trim()) {
      toast({
        title: "Error",
        description: "Please enter alt text",
        variant: "destructive",
      });
      return;
    }

    if (!formData.image) {
      toast({
        title: "Error",
        description: "Please select an image",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("category", formData.category);
      data.append("camera", formData.camera);
      data.append("alt", formData.alt);
      data.append("image", formData.image);

      const response = await fetch("/api/portfolio", {
        method: "POST",
        body: data,
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Upload failed' }));
        throw new Error(errorData.error || "Failed to create portfolio item");
      }

      toast({
        title: "Success",
        description: "Portfolio item created successfully",
      });

      handleRemoveImage();
      setFormData({ title: "", category: "", camera: "", alt: "", image: null });
      setIsAddOpen(false);
      await fetchPortfolio();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create portfolio item",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedItem) return;

    try {
      setLoading(true);

      const response = await fetch(`/api/portfolio/${selectedItem.id}`, {
        method: "DELETE",
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || 'Delete failed');
      }

      setData(data.filter((item) => item.id !== selectedItem.id));
      setIsDeleteOpen(false);
      setSelectedItem(null);

      toast({
        title: "Success",
        description: "Portfolio item deleted successfully",
      });
    } catch (err) {
      console.error('Delete error:', err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to delete portfolio item",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnDef<PortfolioItem>[] = [
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue('title')}</span>
      ),
      enableSorting: true,
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => (
        <span className="inline-block px-2 py-1 rounded-full bg-gold/10 text-gold text-xs font-semibold capitalize">
          {row.getValue('category')}
        </span>
      ),
      enableSorting: true,
    },
    {
      accessorKey: 'camera',
      header: 'Camera',
      cell: ({ row }) => {
        const camera = row.getValue('camera') as string | undefined;
        return (
          <span className="text-sm text-muted-foreground">
            {camera || '-'}
          </span>
        );
      },
      enableSorting: false,
    },
    {
      accessorKey: 'created_at',
      header: 'Created',
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {new Date(row.getValue('created_at') as string).toLocaleDateString()}
        </span>
      ),
      enableSorting: true,
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                setSelectedItem(row.original);
                setIsViewOpen(true);
              }}
            >
              <Eye className="w-4 h-4 mr-2" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setSelectedItem(row.original);
                setIsDeleteOpen(true);
              }}
              className="text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      enableSorting: false,
      enableColumnFilter: false,
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl text-accent sm:text-3xl font-serif font-bold">Portfolio Management</h1>
          <p className="text-muted-foreground mt-1">Create and manage portfolio items</p>
        </div>
        <Button
          onClick={() => setIsAddOpen(true)}
          className="bg-gold hover:bg-gold/90 text-primary-foreground w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Item
        </Button>
      </div>

      <div className="flex w-full flex-col gap-6">
        <DataTable
          columns={columns}
          data={data}
          pageCount={totalPages}
          pageIndex={pageIndex}
          pageSize={pageSize}
          onPageChange={(pi, ps) => {
            setPageIndex(pi);
            setPageSize(ps);
          }}
          searchFields={[]}
          searchPlaceholder=""
          search=""
          onSearchChange={() => {}}
          onSortingChange={() => {}}
        />
      </div>

      {/* Add Portfolio Item Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-2xl bg-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-gray-900 text-xl font-semibold">Add Portfolio Item</DialogTitle>
            <DialogDescription className="text-gray-600">
              Add a new portfolio item with image and details
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Elegant Ceremony"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50 bg-white text-gray-900"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Category *
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                placeholder="e.g., Weddings, Portraits, Events"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50 bg-white text-gray-900"
              />
            </div>

            {/* Camera */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Camera (Optional)
              </label>
              <input
                type="text"
                name="camera"
                value={formData.camera}
                onChange={handleInputChange}
                placeholder="e.g., Canon R5"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50 bg-white text-gray-900"
              />
            </div>

            {/* Alt Text */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Alt Text *
              </label>
              <input
                type="text"
                name="alt"
                value={formData.alt}
                onChange={handleInputChange}
                placeholder="Image description for accessibility"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50 bg-white text-gray-900"
              />
            </div>

            {/* Image Upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gold hover:bg-gold/5 transition-colors bg-white">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="portfolio-image-input"
              />
              <label htmlFor="portfolio-image-input" className="cursor-pointer flex flex-col items-center gap-2">
                <Upload className="w-8 h-8 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">Click to select image</p>
                  <p className="text-sm text-gray-500">or drag and drop (PNG, JPG up to 10MB)</p>
                </div>
              </label>
            </div>

            {/* Image Preview */}
            {imagePreview && (
              <div className="space-y-2">
                <p className="font-medium text-sm text-gray-900">Image preview:</p>
                <div className="relative rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-50">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-64 object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsAddOpen(false);
                  handleRemoveImage();
                  setFormData({ title: "", category: "", camera: "", alt: "", image: null });
                }}
                disabled={uploading}
                className="w-full sm:w-auto bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={uploading || !formData.image || !formData.title.trim() || !formData.category.trim() || !formData.alt.trim()}
                className="w-full sm:w-auto bg-gold hover:bg-gold/90 text-white font-medium shadow-sm disabled:opacity-50"
              >
                {uploading ? 'Creating...' : 'Create Item'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-3xl bg-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-gray-900 text-xl font-semibold">Portfolio Item Details</DialogTitle>
          </DialogHeader>

          {selectedItem && (
            <div className="space-y-4">
              <div className="rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                <img
                  src={getImageUrl(selectedItem.image_path)}
                  alt={selectedItem.alt}
                  className="w-full h-96 object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder.svg';
                  }}
                />
              </div>

              <div>
                <p className="text-gray-500 font-medium text-sm">Title</p>
                <p className="font-semibold text-gray-900">{selectedItem.title}</p>
              </div>
              
              <div>
                <p className="text-gray-500 font-medium text-sm">Category</p>
                <span className="inline-block px-2 py-1 rounded-full bg-gold/10 text-gold text-xs font-semibold capitalize">
                  {selectedItem.category}
                </span>
              </div>

              {selectedItem.camera && (
                <div>
                  <p className="text-gray-500 font-medium text-sm">Camera</p>
                  <p className="text-gray-700">{selectedItem.camera}</p>
                </div>
              )}

              <div>
                <p className="text-gray-500 font-medium text-sm">Alt Text</p>
                <p className="text-gray-700">{selectedItem.alt}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 font-medium">Created</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(selectedItem.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 font-medium">Updated</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(selectedItem.updated_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="text-gray-900 text-xl font-semibold">Delete Portfolio Item</DialogTitle>
            <DialogDescription className="text-gray-600">
              Are you sure you want to delete "{selectedItem?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
              disabled={loading}
              className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {loading ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}