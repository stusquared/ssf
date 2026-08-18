import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price_cents: z.number().int().positive("Price must be greater than $0"),
  timeframe: z.string().min(1, "Timeframe is required"),
  total_spots: z.number().int().nonnegative("Must be 0 or more"),
  spots_remaining: z.number().int().nonnegative("Must be 0 or more"),
  is_active: z.boolean(),
});

export type ProductFormValues = z.infer<typeof schema>;

type Props = {
  defaultValues?: ProductFormValues;
  onSubmit: (values: ProductFormValues) => Promise<void>;
  submitLabel: string;
};

const defaultEmpty: ProductFormValues = {
  name: "",
  description: "",
  price_cents: 0,
  timeframe: "",
  total_spots: 0,
  spots_remaining: 0,
  is_active: true,
};

function field(label: string, error?: string, children: React.ReactNode = null) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      {children}
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}

const inputClass =
  "w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-ink)] transition-colors";

export function ProductForm({ defaultValues = defaultEmpty, onSubmit, submitLabel }: Props) {
  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const isActive = watch("is_active");

  // Price is stored in cents but displayed in dollars
  const [dollarDisplay, setDollarDisplay] = useState(
    defaultValues.price_cents ? (defaultValues.price_cents / 100).toFixed(2) : "",
  );

  const submit = async (values: ProductFormValues) => {
    setApiError("");
    try {
      await onSubmit(values);
    } catch (e) {
      setApiError(e instanceof Error ? e.message : "Something went wrong.");
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="bg-white p-8 shadow-sm space-y-6">
      {field(
        "Package Name",
        errors.name?.message,
        <input
          {...register("name")}
          className={inputClass}
          placeholder="Summer Weekly Share"
        />,
      )}

      {field(
        "Description (optional)",
        errors.description?.message,
        <textarea
          {...register("description")}
          rows={3}
          className={`${inputClass} resize-none`}
          placeholder="A weekly box of seasonal vegetables, herbs, and flowers from the farm."
        />,
      )}

      {field(
        "Price per share (dollars)",
        errors.price_cents?.message,
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={dollarDisplay}
            onChange={(e) => {
              setDollarDisplay(e.target.value);
              const cents = Math.round(parseFloat(e.target.value || "0") * 100);
              setValue("price_cents", cents, { shouldValidate: true });
            }}
            className={`${inputClass} pl-8`}
            placeholder="35.00"
          />
        </div>,
      )}

      {field(
        "Timeframe",
        errors.timeframe?.message,
        <input
          {...register("timeframe")}
          className={inputClass}
          placeholder="Summer 2026 · June – August"
        />,
      )}

      <div className="grid grid-cols-2 gap-4">
        {field(
          "Total spots",
          errors.total_spots?.message,
          <input
            {...register("total_spots", { valueAsNumber: true })}
            type="number"
            min="0"
            className={inputClass}
          />,
        )}
        {field(
          "Available spots",
          errors.spots_remaining?.message,
          <input
            {...register("spots_remaining", { valueAsNumber: true })}
            type="number"
            min="0"
            className={inputClass}
          />,
        )}
      </div>

      <div className="flex items-center justify-between py-4 border-t border-gray-100">
        <div>
          <p className="text-sm font-medium text-gray-700">Active</p>
          <p className="text-xs text-gray-400 mt-0.5">
            {isActive
              ? "Visible on the CSA page and open for signup."
              : "Hidden from customers — use to pause sales."}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setValue("is_active", !isActive)}
          // shrink-0 is load-bearing: the knob is absolutely positioned, so the
          // track's min-content width is 0 and the label beside it would otherwise
          // squash this flex item to nothing.
          className={`relative w-12 h-6 rounded-full shrink-0 transition-colors ${isActive ? "bg-green-500" : "bg-gray-200"}`}
        >
          <span
            className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${isActive ? "translate-x-6" : "translate-x-0"}`}
          />
        </button>
      </div>

      {apiError && <p className="text-sm text-red-600">{apiError}</p>}

      <div className="flex items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-[var(--color-ink)] text-white px-6 py-3 text-sm font-medium hover:bg-[var(--color-ink)]/90 disabled:opacity-50 transition-colors"
        >
          {isSubmitting ? "Saving…" : submitLabel}
        </button>
        <a href="/admin/dashboard" className="text-sm text-gray-400 hover:text-gray-600">
          Cancel
        </a>
      </div>
    </form>
  );
}
