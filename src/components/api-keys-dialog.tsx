"use client";

// External Dependencies
import { useState } from "react";
import { Eye, EyeOff, Plus, Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Internal Dependencies
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useAddApiKey,
  useApiKeys,
  useDeleteApiKey,
} from "@/hooks/use-api-keys";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  provider: z.enum(["openai", "anthropic", "google"]),
  key: z.string().min(1, "API key is required"),
});

interface ApiKeysDialogProps {
  trigger?: React.ReactNode;
}

export function ApiKeysDialog({ trigger }: ApiKeysDialogProps) {
  const [open, setOpen] = useState(false);
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const { data: apiKeys, isLoading } = useApiKeys();
  const { mutate: addApiKey, isPending: isAdding } = useAddApiKey();
  const { mutate: deleteApiKey, isPending: isDeleting } = useDeleteApiKey();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      provider: "openai",
      key: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    addApiKey(values, {
      onSuccess: () => {
        form.reset();
      },
    });
  }

  const toggleShowKey = (provider: string) => {
    setShowKeys((prev) => ({ ...prev, [provider]: !prev[provider] }));
  };

  // Helper function to get the key for a provider
  const getProviderKey = (provider: string) => {
    if (!apiKeys?.key) return null;
    switch (provider) {
      case "openai":
        return apiKeys.key.encryptedOpenAIKey;
      case "anthropic":
        return apiKeys.key.encryptedAnthropicKey;
      case "google":
        return apiKeys.key.encryptedGoogleKey;
      default:
        return null;
    }
  };

  // List of providers to show
  const providers = ["openai", "anthropic", "google"] as const;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="outline" className="hover:cursor-pointer">
            <Plus className="mr-2 h-4 w-4" />
            Add API Keys
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>API Keys</DialogTitle>
          <DialogDescription>
            Add your API keys for different providers. Your keys are encrypted
            and stored securely.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Your API Keys</h4>
            {isLoading ? (
              <p className="text-muted-foreground text-sm">Loading...</p>
            ) : !apiKeys?.key ? (
              <p className="text-muted-foreground text-sm">No API keys added</p>
            ) : (
              <div className="space-y-2">
                {providers.map((provider) => {
                  const key = getProviderKey(provider);
                  if (!key) return null;

                  return (
                    <div
                      key={provider}
                      className="flex items-center justify-between space-x-2 rounded-md border p-2"
                    >
                      <div className="grid gap-1">
                        <p className="text-sm font-medium capitalize">
                          {provider}
                        </p>
                        <p
                          className={cn(
                            "text-xs",
                            showKeys[provider]
                              ? "text-foreground"
                              : "text-muted-foreground",
                          )}
                        >
                          {showKeys[provider]
                            ? key
                            : "••••••••••••••••••••••••••"}
                        </p>
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleShowKey(provider)}
                          className="hover:cursor-pointer"
                        >
                          {showKeys[provider] ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteApiKey(provider)}
                          disabled={isDeleting}
                          className="hover:cursor-pointer"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Add New API Key Form */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Add New API Key</h4>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid gap-4"
              >
                <FormField
                  control={form.control}
                  name="provider"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Provider</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a provider" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="openai">OpenAI</SelectItem>
                          <SelectItem value="anthropic">Anthropic</SelectItem>
                          <SelectItem value="google">Google</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="key"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>API Key</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your API key"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full hover:cursor-pointer"
                  disabled={isAdding}
                >
                  Add Key
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
