import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface InventoryItem {
  id?: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  price: number;
  expiryDate?: string;
  status?: "in-stock" | "low-stock" | "out-of-stock" | "expiring-soon";
}

interface InventoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: (item: InventoryItem) => void;
  initialData?: InventoryItem | null;
}

export function InventoryForm({
  isOpen,
  onClose,
  onSaved,
  initialData,
}: Readonly<InventoryFormProps>) {
  const [formData, setFormData] = useState<InventoryItem>({
    id: "",
    name: "",
    category: "",
    quantity: 0,
    unit: "",
    price: 0,
    expiryDate: undefined,
    status: "in-stock",
  });

  const categories = ["Groceries", "Medicines", "Vegetables", "Stationery"];
  const units = ["kg", "tablets", "pieces", "liters"];

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        id: "",
        name: "",
        category: "",
        quantity: 0,
        unit: "",
        price: 0,
        expiryDate: undefined,
        status: "in-stock",
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) return alert("Please enter item name");
    if (!formData.category) return alert("Please select a category");
    if (formData.quantity < 0) return alert("Quantity cannot be negative");
    if (!formData.unit) return alert("Please select a unit");
    if (formData.price < 0) return alert("Price cannot be negative");

    let status: InventoryItem["status"] = "in-stock";
    if (formData.quantity === 0) status = "out-of-stock";
    else if (formData.quantity <= 10) status = "low-stock";

    if (formData.expiryDate) {
      const expiry = new Date(formData.expiryDate);
      const now = new Date();
      const diffDays = (expiry.getTime() - now.getTime()) / (1000 * 3600 * 24);
      if (diffDays <= 30) status = "expiring-soon";
    }

    const payload = {
      name: formData.name,
      category: formData.category,
      quantity: formData.quantity,
      unit: formData.unit,
      price: formData.price,
      expiryDate: formData.expiryDate || null,
      status: status,
    };

    try {
      let response;
      if (formData.id) {
        response = await axios.put(
          `http://localhost:8080/api/inventory/${formData.id}`,
          payload
        );
      } else {
        response = await axios.post(
          "http://localhost:8080/api/inventory",
          payload
        );
      }
      onSaved(response.data);
      onClose();
    } catch (error: any) {
      console.error("❌ Failed to save inventory item:", error);
      alert(error.response?.data?.message || "Network or server error while saving item.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] w-full max-h-[85vh] overflow-y-auto rounded-lg shadow-lg p-6 bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[hsl(var(--foreground))]">
            {formData.id ? "Edit Inventory Item" : "Add New Inventory Item"}
          </DialogTitle>
          <DialogDescription className="text-sm text-[hsl(var(--muted-foreground))]">
            Fill in the details of the inventory item.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div className="flex flex-col">
            <Label htmlFor="name" className="mb-1 font-medium text-[hsl(var(--foreground))]">Item Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter item name"
              required
              className="border-[hsl(var(--border))] bg-[hsl(var(--input))] text-[hsl(var(--foreground))] focus:ring-2 focus:ring-[hsl(var(--ring))] rounded-md"
            />
          </div>

          <div className="flex flex-col">
            <Label htmlFor="category" className="mb-1 font-medium text-[hsl(var(--foreground))]">Category *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger className="border-[hsl(var(--border))] bg-[hsl(var(--input))] text-[hsl(var(--foreground))] focus:ring-2 focus:ring-[hsl(var(--ring))] rounded-md">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <Label htmlFor="quantity" className="mb-1 font-medium text-[hsl(var(--foreground))]">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                value={formData.quantity}
                onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
                required
                className="border-[hsl(var(--border))] bg-[hsl(var(--input))] text-[hsl(var(--foreground))] focus:ring-2 focus:ring-[hsl(var(--ring))] rounded-md"
              />
            </div>

            <div className="flex flex-col">
              <Label htmlFor="unit" className="mb-1 font-medium text-[hsl(var(--foreground))]">Unit *</Label>
              <Select
                value={formData.unit}
                onValueChange={(value) => setFormData(prev => ({ ...prev, unit: value }))}
              >
                <SelectTrigger className="border-[hsl(var(--border))] bg-[hsl(var(--input))] text-[hsl(var(--foreground))] focus:ring-2 focus:ring-[hsl(var(--ring))] rounded-md">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {units.map(unit => <SelectItem key={unit} value={unit}>{unit}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <Label htmlFor="price" className="mb-1 font-medium text-[hsl(var(--foreground))]">Price per Unit (₹) *</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                required
                className="border-[hsl(var(--border))] bg-[hsl(var(--input))] text-[hsl(var(--foreground))] focus:ring-2 focus:ring-[hsl(var(--ring))] rounded-md"
              />
            </div>

            <div className="flex flex-col">
              <Label htmlFor="expiryDate" className="mb-1 font-medium text-[hsl(var(--foreground))]">Expiry Date</Label>
              <Input
                id="expiryDate"
                type="date"
                value={formData.expiryDate || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value || undefined }))}
                className="border-[hsl(var(--border))] bg-[hsl(var(--input))] text-[hsl(var(--foreground))] focus:ring-2 focus:ring-[hsl(var(--ring))] rounded-md"
              />
            </div>
          </div>

          <DialogFooter className="flex justify-end gap-3 mt-2">
            <Button type="button" variant="outline" className="border-[hsl(var(--border))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:opacity-90 rounded-md px-4 py-2">
              {formData.id ? "Update Item" : "Add Item"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
