import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { addOrder } from "@/api/orderService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Minus } from "lucide-react";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface OrderFormData {
  customerName: string;
  items: OrderItem[];
  paymentMethod: string;
  notes: string;
}

interface OrderFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (orderData: OrderFormData) => void;
  isEdit?: boolean;
  isView?: boolean;
  orderToEdit?: any;
}

export function OrderForm({
  isOpen,
  onClose,
  onSubmit,
  isEdit = false,
  isView = false,
  orderToEdit,
}: OrderFormProps) {
  const [formData, setFormData] = useState<OrderFormData>({
    customerName: "",
    items: [{ id: "1", name: "", quantity: 1, price: 0 }],
    paymentMethod: "",
    notes: "",
  });

  useEffect(() => {
    if (isOpen) {
      if (isEdit && orderToEdit) {
        setFormData({
          customerName: orderToEdit.customerName,
          items: [{ id: "1", name: "", quantity: 1, price: 0 }],
          paymentMethod: orderToEdit.paymentMethod,
          notes: "",
        });
      } else {
        setFormData({
          customerName: "",
          items: [{ id: "1", name: "", quantity: 1, price: 0 }],
          paymentMethod: "",
          notes: "",
        });
      }
    }
  }, [isOpen, isEdit, orderToEdit]);

  const calculateTotal = () => {
    return formData.items.reduce(
      (total, item) => total + item.quantity * item.price,
      0
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName.trim()) return alert("Please enter customer name");
    if (formData.items.some(item => !item.name.trim() || item.quantity <= 0 || item.price <= 0))
      return alert("Please fill in all item details with valid values");
    if (!formData.paymentMethod) return alert("Please select a payment method");

    try {
      const orderPayload = {
        customerName: formData.customerName,
        items: formData.items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        paymentMethod: formData.paymentMethod,
        totalAmount: calculateTotal(),
        notes: formData.notes,
        status: "Pending",
        date: new Date().toISOString(),
      };

      await addOrder(orderPayload);
      alert("✅ Order created successfully!");
      onSubmit(formData);
      setFormData({
        customerName: "",
        items: [{ id: "1", name: "", quantity: 1, price: 0 }],
        paymentMethod: "",
        notes: "",
      });
      onClose();
    } catch (error) {
      console.error("❌ Error creating order:", error);
      alert("Failed to create order. Please try again.");
    }
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { id: (prev.items.length + 1).toString(), name: "", quantity: 1, price: 0 }],
    }));
  };

  const removeItem = (id: string) => {
    if (formData.items.length > 1) {
      setFormData(prev => ({ ...prev, items: prev.items.filter(item => item.id !== id) }));
    }
  };

  const updateItem = (id: string, field: keyof OrderItem, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map(item => (item.id === id ? { ...item, [field]: value } : item)),
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto rounded-lg bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] p-6 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-[hsl(var(--foreground))] text-xl font-bold">
            {isView ? "View Order" : isEdit ? "Edit Order" : "Create New Order"}
          </DialogTitle>
          <DialogDescription className="text-[hsl(var(--muted-foreground))] text-sm">
            {isView ? "Review the order details below." : isEdit ? "Update the order details below." : "Enter the order details below. Add multiple items if needed."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="customerName" className="text-[hsl(var(--foreground))]">Customer Name *</Label>
              <Input
                id="customerName"
                value={formData.customerName}
                onChange={e => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                placeholder="Enter customer name"
                required
                className="border-[hsl(var(--border))] bg-[hsl(var(--input))] text-[hsl(var(--foreground))] focus:ring-2 focus:ring-[hsl(var(--ring))] rounded-md"
              />
            </div>

            <div>
              <Label htmlFor="paymentMethod" className="text-[hsl(var(--foreground))]">Payment Method *</Label>
              <Select
                value={formData.paymentMethod}
                onValueChange={value => setFormData(prev => ({ ...prev, paymentMethod: value }))}
              >
                <SelectTrigger className="border-[hsl(var(--border))] bg-[hsl(var(--input))] text-[hsl(var(--foreground))] focus:ring-2 focus:ring-[hsl(var(--ring))] rounded-md">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Card">Card</SelectItem>
                  <SelectItem value="UPI">UPI</SelectItem>
                  <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-[hsl(var(--foreground))]">Order Items *</Label>
              <Button type="button" variant="outline" size="sm" className="border-[hsl(var(--border))] text-[hsl(var(--foreground))]" onClick={addItem}>
                <Plus className="w-4 h-4 mr-2" /> Add Item
              </Button>
            </div>

            {formData.items.map((item, index) => (
              <div key={item.id} className="border-[hsl(var(--border))] rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-[hsl(var(--foreground))]">Item {index + 1}</h4>
                  {formData.items.length > 1 && (
                    <Button type="button" variant="ghost" className="text-[hsl(var(--destructive))]" onClick={() => removeItem(item.id)}>
                      <Minus className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <Label htmlFor={`item-name-${item.id}`} className="text-[hsl(var(--foreground))]">Item Name</Label>
                    <Input
                      id={`item-name-${item.id}`}
                      value={item.name}
                      onChange={e => updateItem(item.id, "name", e.target.value)}
                      placeholder="Enter item name"
                      className="border-[hsl(var(--border))] bg-[hsl(var(--input))] text-[hsl(var(--foreground))] focus:ring-2 focus:ring-[hsl(var(--ring))] rounded-md"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor={`item-quantity-${item.id}`} className="text-[hsl(var(--foreground))]">Quantity</Label>
                    <Input
                      id={`item-quantity-${item.id}`}
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={e => updateItem(item.id, "quantity", parseInt(e.target.value) || 1)}
                      className="border-[hsl(var(--border))] bg-[hsl(var(--input))] text-[hsl(var(--foreground))] focus:ring-2 focus:ring-[hsl(var(--ring))] rounded-md"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor={`item-price-${item.id}`} className="text-[hsl(var(--foreground))]">Price per Unit (₹)</Label>
                    <Input
                      id={`item-price-${item.id}`}
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.price}
                      onChange={e => updateItem(item.id, "price", parseFloat(e.target.value) || 0)}
                      className="border-[hsl(var(--border))] bg-[hsl(var(--input))] text-[hsl(var(--foreground))] focus:ring-2 focus:ring-[hsl(var(--ring))] rounded-md"
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div>
            <Label htmlFor="notes" className="text-[hsl(var(--foreground))]">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Additional notes (optional)"
              className="border-[hsl(var(--border))] bg-[hsl(var(--input))] text-[hsl(var(--foreground))] focus:ring-2 focus:ring-[hsl(var(--ring))] rounded-md"
            />
          </div>

          <DialogFooter className="flex justify-end gap-3 mt-2">
            <Button type="button" variant="outline" className="border-[hsl(var(--border))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]" onClick={onClose}>
              Cancel
            </Button>
            {!isView && (
              <Button type="submit" className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:opacity-90 rounded-md px-4 py-2">
                {isEdit ? "Update Order" : "Create Order"}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
