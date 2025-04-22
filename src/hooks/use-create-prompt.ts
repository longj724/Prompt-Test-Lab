import { useState } from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";

const promptSchema = z.object({
  name: z.string().min(1, "Name is required"),
  systemPrompt: z.string().min(1, "System prompt is required"),
  model: z.string(),
});

type PromptFormData = z.infer<typeof promptSchema>;

export function useCreatePrompt() {
  const router = useRouter();
  const [formData, setFormData] = useState<PromptFormData>({
    name: "",
    systemPrompt: "",
    model: "gpt-4",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof PromptFormData, string>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = <K extends keyof PromptFormData>(
    field: K,
    value: PromptFormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when field is updated
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = () => {
    try {
      promptSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: typeof errors = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as keyof PromptFormData] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (action: "save" | "continue") => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // TODO: Implement API call to save the prompt
      console.log("Saving prompt:", formData);

      if (action === "continue") {
        router.push(`/dashboard/generate-messages?promptId=${123}`); // Replace with actual promptId
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Failed to save prompt:", error);
      // TODO: Show error toast
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/dashboard");
  };

  const resetForm = () => {
    setFormData({
      name: "",
      systemPrompt: "",
      model: "gpt-4",
    });
    setErrors({});
  };

  return {
    formData,
    errors,
    isSubmitting,
    updateField,
    handleSubmit,
    handleCancel,
    resetForm,
  };
}
